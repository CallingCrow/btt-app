import { supabase } from "@/app/supabase-client";
import { createCloverCheckout } from "@/lib/clover";
import { validateCustomer } from "@/lib/validateCustomer";
import { validateCart } from "@/lib/validateCart";

const MAX_QUANTITY_PER_ITEM = 10;
const MAX_CART_ITEMS = 10;
const TAX_RATE = 0.101; // 10.1%

function uniqueCustomizations(
  selectedOptions: Record<string, number[]>,
  optionMap: Record<number, any>
) {
  const result: any[] = [];

  for (const groupId in selectedOptions) {
    for (const optionId of selectedOptions[groupId]) {
      const option = optionMap[optionId];

      if (option) {
        result.push({
          id: option.id,
          name: option.name,
          price: option.price,
        });
      }
    }
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json();
    validateCustomer(customer || {});
    validateCart(items);

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (items.length > MAX_CART_ITEMS) {
      throw new Error("Too many items in cart");
    }

    let lineItems: any[] = [];

    for (const item of items) {
      const { itemId, quantity, selectedOptions = {} } = item;

      // normalize selectedOptions into: Record<groupId, number[]>
      const normalizedSelectedOptions: Record<string, number[]> = {};

      for (const [groupId, value] of Object.entries(selectedOptions)) {
        normalizedSelectedOptions[groupId] = (value as any[])
          .map((v) => (typeof v === "object" ? v.optionId : v))
          .filter(Boolean);
      }

      // quantity validation
      if (
        typeof quantity !== "number" ||
        quantity < 1 ||
        quantity > MAX_QUANTITY_PER_ITEM
      ) {
        throw new Error("Invalid quantity");
      }

      // fetch menu item
      const { data: menuItem } = await supabase
        .from("menu")
        .select("id, name, price, category_id")
        .eq("id", itemId)
        .single();

      if (!menuItem) throw new Error("Invalid menu item");

      let total = Number(menuItem.price);

      // fetch groups for category
      const { data: categoryGroups } = await supabase
        .from("category_customization_groups")
        .select(`
          group_id (
            id,
            min_select,
            max_select
          )
        `)
        .eq("category_id", menuItem.category_id);

      const groups = (categoryGroups || [])
        .map((g: any) => g.group_id)
        .filter(Boolean);

      const groupMap: Record<number, any> = {};
      groups.forEach((g: any) => {
        groupMap[g.id] = g;
      });

      const groupIds = groups.map((g: any) => g.id);

      // fetch options ONLY for relevant groups
      const { data: optionsData } = await supabase
        .from("customization_options")
        .select("id, name, price, group_id")
        .in("group_id", groupIds);

      const options = optionsData || [];

      const optionMap: Record<number, any> = {};
      options.forEach((o) => {
        optionMap[o.id] = o;
      });

      // fetch defaults
      const { data: defaultsData } = await supabase
        .from("customization_defaults")
        .select("option_id, price_override")
        .eq("item_id", itemId);

      const defaultsMap: Record<number, any> = {};
      (defaultsData || []).forEach((d) => {
        defaultsMap[d.option_id] = d;
      });

      // validate group rules
      for (const groupId of groupIds) {
        const selected = normalizedSelectedOptions[groupId] || [];
        const uniqueSelected = [...new Set(selected)];

        const group = groupMap[groupId];

        // count defaults belonging to this group
        const defaultCount = Object.values(defaultsMap).filter((d: any) => {
          const option = optionMap[d.option_id];
          return option?.group_id === groupId;
        }).length;

        const count = uniqueSelected.length + defaultCount;

        if (count < group.min_select || count > group.max_select) {
          throw new Error(
            `Invalid selection count for group ${groupId}`
          );
        }
      }

      // validate, price options
      for (const groupId in selectedOptions) {
        const optionIds: number[] = normalizedSelectedOptions[groupId];
        const uniqueOptionIds = [...new Set(optionIds)];

        for (const optionId of uniqueOptionIds) {
          const option = optionMap[optionId];

          if (!option) {
            throw new Error("Invalid option selected");
          }

          // ensure option belongs to correct group
          if (String(option.group_id) !== String(groupId)) {
            throw new Error("Option-group mismatch");
          }

          const defaultData = defaultsMap[optionId];

          if (defaultData) {
            const override = defaultData.price_override;
            total += override != null ? Number(override) : 0;
          } else {
            total += Number(option.price) || 0;
          }
        }
      }

      const finalItemTotal = total * quantity;

      lineItems.push({
        itemId,

        name: menuItem.name,

        price: finalItemTotal,

        quantity,

        selectedOptions,

        customizations: uniqueCustomizations(selectedOptions, optionMap),
      });
    }

    // Calculate order totals
    const subtotal =
      lineItems.reduce(
        (sum, i) => sum + i.price,
        0
      );

    const tax =
      Math.round(subtotal * TAX_RATE);

    const total =
      subtotal + tax;

    // send cart to orders table
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        status: "pending",

        subtotal,
        tax,
        total,

        customer_name: customer?.name || null,
        customer_email: customer?.email || null,
        customer_phone: customer?.phone || null,

        order_items: lineItems,
      })
      .select()
      .single();

    if (error || !order) {
      throw new Error("Failed to create order");
    }
    const orderId = order.id;

    const session = await createCloverCheckout(lineItems, orderId, tax);

    return new Response(JSON.stringify(session), { status: 200 });
  } catch (err: any) {
    console.error("Checkout error:", err);

    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}