import { resend } from "@/lib/resend";
import type { OrderWithItems } from "@/types/cart";

export async function sendMerchantNotification(order: OrderWithItems) {
  // Build Order Items Text

  let itemsText = "";

  for (const item of order.order_items) {
    itemsText += `${item.quantity}x ${item.name}\n`;

    // Customizations
    if (item.customizations?.length) {
      for (const c of item.customizations) {
        itemsText += `  • ${c.name}\n`;
      }
    }

    itemsText += "\n";
  }

  // Build Email Content
  const emailText = `
NEW ORDER

Order ID:
${order.id}

================================

Customer:
${order.customer_name || "N/A"}

Phone:
${order.customer_phone || "N/A"}

Email:
${order.customer_email || "N/A"}

================================

ITEMS

${itemsText}

================================

Subtotal:
$${(order.subtotal / 100).toFixed(2)}

Tax:
$${(order.tax / 100).toFixed(2)}

Total:
$${(order.total / 100).toFixed(2)}
`;

  // Send email
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,

    to: process.env.MERCHANT_EMAIL!,

    subject: `New Order #${order.id}`,

    text: emailText,
  });

  // Handle errors
  if (error) {
    console.error("Resend error:", error);

    throw new Error(`Failed to send merchant email: ${error.message}`);
  }

  console.log("Merchant email sent");
}
