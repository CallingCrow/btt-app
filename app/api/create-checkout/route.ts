import { supabaseAdmin } from "@/lib/supabase-admin";
import { createCloverCheckout } from "@/lib/clover";
//import { validateCustomer } from "@/lib/validateCustomer";
import { validateCart } from "@/lib/validateCart";
import { toCheckoutJson } from "@/utils/toCheckoutJson";
import type { SelectedOptions } from "@/types/ui";
import type {
  CustomizationGroup,
  CustomizationOption,
  CustomizationDefault,
} from "@/types/db";
import type { CartCustomization } from "@/types/cart";
import type { CheckoutLineItem } from "@/types/cart";

const MAX_QUANTITY_PER_ITEM = 10;
const MAX_CART_ITEMS = 10;
const TAX_RATE = 0.101; // 10.1%

function uniqueCustomizations(
  selectedOptions: SelectedOptions,
  optionMap: Record<string, CustomizationOption>,
): CartCustomization[] {
  const result: CartCustomization[] = [];

  for (const groupId in selectedOptions) {
    for (const selected of selectedOptions[groupId]) {
      const option = optionMap[selected.optionId];

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
    const { items } = await req.json();
    //validateCustomer(customer || {});
    validateCart(items);

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    if (items.length > MAX_CART_ITEMS) {
      throw new Error("Too many items in cart");
    }

    let lineItems: CheckoutLineItem[] = [];

    for (const item of items) {
      const { itemId, quantity, selectedOptions = {} } = item;

      // normalize selectedOptions into: Record<groupId, number[]>
      const normalizedSelectedOptions: Record<string, string[]> =
        Object.fromEntries(
          Object.entries(selectedOptions).map(([groupId, options]) => [
            groupId,
            options.map((o) => o.optionId),
          ]),
        );

      // quantity validation
      if (
        typeof quantity !== "number" ||
        quantity < 1 ||
        quantity > MAX_QUANTITY_PER_ITEM
      ) {
        throw new Error("Invalid quantity");
      }

      // fetch menu item
      const { data: menuItem } = await supabaseAdmin
        .from("menu")
        .select("id, name, price, category_id")
        .eq("id", itemId)
        .single();

      if (!menuItem) throw new Error("Invalid menu item");

      let total = Number(menuItem.price);

      // fetch groups for category
      const { data: categoryGroups } = await supabaseAdmin
        .from("category_customization_groups")
        .select(
          `
          group_id (
            id,
            name,
            is_required,
            min_select,
            max_select
          )
        `,
        )
        .eq("category_id", menuItem.category_id);

      const groups = (categoryGroups || [])
        .map((g) => g.group_id)
        .filter(Boolean);

      const groupMap: Record<string, CustomizationGroup> = {};
      groups.forEach((g) => {
        groupMap[g.id] = g;
      });

      const groupIds = groups.map((g) => g.id);

      // fetch options ONLY for relevant groups
      const { data: optionsData } = await supabaseAdmin
        .from("customization_options")
        .select("id, name, price, group_id")
        .in("group_id", groupIds);

      const options = optionsData || [];

      const optionMap: Record<string, CustomizationOption> = {};
      options.forEach((o) => {
        optionMap[o.id] = o;
      });

      // fetch defaults
      const { data: defaultsData } = await supabaseAdmin
        .from("customization_defaults")
        .select(
          `
          id,
          item_id,
          option_id,
          price_override,
          is_removable
        `,
        )
        .eq("item_id", itemId);

      const defaultsMap: Record<string, CustomizationDefault> = {};
      (defaultsData || []).forEach((d) => {
        defaultsMap[d.option_id] = d;
      });

      // validate group rules
      for (const groupId of groupIds) {
        const selected = normalizedSelectedOptions[groupId] || [];
        const uniqueSelected = [...new Set(selected)];

        const group = groupMap[groupId];

        // count defaults belonging to this group
        const defaultCount = Object.values(defaultsMap).filter((d) => {
          const option = optionMap[d.option_id];
          return option?.group_id === groupId;
        }).length;

        const count = uniqueSelected.length + defaultCount;

        if (count < group.min_select || count > group.max_select) {
          throw new Error(`Invalid selection count for group ${groupId}`);
        }
      }

      // validate, price options
      for (const groupId in selectedOptions) {
        const optionIds = normalizedSelectedOptions[groupId] ?? [];
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

      const unitPrice = total;

      lineItems.push({
        itemId,

        name: menuItem.name,

        price: unitPrice,

        quantity,

        selectedOptions,

        customizations: uniqueCustomizations(selectedOptions, optionMap),
      });
    }

    // Calculate order totals
    const subtotal = lineItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    const tax = Math.round(subtotal * TAX_RATE);

    const total = subtotal + tax;

    // send cart to orders table
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        status: "pending",

        subtotal,
        tax,
        total,

        order_items: toCheckoutJson(lineItems),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase order insert error:", error);

      throw new Error(error.message);
    }

    if (!order) {
      throw new Error("Order was not returned");
    }
    const orderId = order.id;

    const session = await createCloverCheckout(lineItems, orderId, tax);

    const { error: cloverSessionError } = await supabaseAdmin
      .from("orders")
      .update({
        clover_checkout_session_id: session.checkoutSessionId,
      })
      .eq("id", order.id);

    if (cloverSessionError) {
      console.error(
        "Failed to save Clover checkout session:",
        cloverSessionError,
      );

      return Response.json(
        { error: "Failed to initialize payment" },
        { status: 500 },
      );
    }
    console.log("Returning checkout session:", session);

    return new Response(JSON.stringify(session), { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown checkout error";

    console.error(err);

    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
