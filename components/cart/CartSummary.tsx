import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";

export default function CartSummary() {
  const { cart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  async function handleCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            itemId: item.itemId, // real menu item id
            quantity: item.quantity,
            selectedOptions: item.selectedOptions,
          })),
        }),
      });

      const data = await res.json();
      console.log("Checkout response:", data);
      console.log("Checkout response status: ", res.status);
      console.log("Checkout response body: ", data);

      if (data.href) {
        // redirect user to Clover checkout page
        console.log("Redirecting to Clover:", data.href);
        window.location.href = data.href;
      } else {
        console.error("No checkout URL returned", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <p>Total: {formatCurrency(total)}</p>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={cart.length === 0}
        className={`w-full ${
          cart.length === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        Checkout
      </Button>
    </div>
  );
}
