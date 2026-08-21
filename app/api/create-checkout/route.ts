import { supabaseAdmin } from "@/lib/supabase-admin";
import { createCloverCheckout } from "@/lib/clover";
import { getDefaultCloverTaxRate } from "@/lib/cloverTax";
import { validateCart } from "@/lib/validateCart";
import { toCheckoutJson } from "@/utils/toCheckoutJson";
import { getCloverTaxRates } from "@/lib/cloverTax";
import { isStoreOpenServer } from "@/lib/store-hours-server";

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
    const { customer, items } = await req.json();
    //validateCustomer(customer || {});
    validateCart(items);

    const customerName =
      typeof customer?.name === "string" ? customer.name.trim() : "";

    const customerEmail =
      typeof customer?.email === "string" ? customer.email.trim() : "";

    const customerPhone =
      typeof customer?.phone === "string" ? customer.phone.trim() : "";

    // If no customer info
    if (!customerName) {
      throw new Error("Customer name is required");
    }

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    if (!customerPhone) {
      throw new Error("Customer email is required");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }

    const storeOpen = await isStoreOpenServer();

    if (!storeOpen) {
      return Response.json(
        {
          error: "Bubble Tea Time is closed right now.",
        },
        { status: 403 },
      );
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

    // Get the merchant's current default tax rate from Clover
    const cloverTaxRate = await getDefaultCloverTaxRate();

    // Clover represents tax rates in millionths.
    // Example: 10.1% = 1,010,000.
    const taxRateDecimal = cloverTaxRate.rate / 10_000_000;

    // Clover calculates tax at the line-item level.
    // Mirror that calculation locally so our expected
    // order total matches the amount Clover charges.
    const tax = lineItems.reduce((sum, item) => {
      const lineSubtotal = item.price * item.quantity;
      return sum + Math.round(lineSubtotal * taxRateDecimal);
    }, 0);

    const total = subtotal + tax;

    console.log("Checkout tax calculation:", {
      subtotal,
      cloverTaxRate: cloverTaxRate.rate,
      taxRateDecimal,
      tax,
      total,
    });

    // send cart to orders table
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
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

    const session = await createCloverCheckout(
      lineItems,
      orderId,
      tax,
      cloverTaxRate,
    );

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

    return Response.json({
      href: session.href,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown checkout error";

    console.error(err);

    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
