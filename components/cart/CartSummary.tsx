import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function CartSummary() {
  const { cart } = useCart();
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  async function handleCheckout() {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError("");

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

      if (!res.ok) {
        setCheckoutError(data.error || "Unable to start checkout.");
        setIsCheckingOut(false);
        return;
      }

      if (data.href) {
        console.log("Redirecting to Clover:", data.href);
        window.location.href = data.href;
      } else {
        setCheckoutError("Unable to start checkout.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError("Unable to start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="pt-2">
        <p>Subtotal: {formatCurrency(total)}</p>
      </div>

      {checkoutError && (
        <div
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold">Bubble Tea Time is closed</p>
              <p className="text-sm">
                Please come back during our regular hours to place your order.
              </p>
            </div>
          </div>
        </div>
      )}
      <Button
        onClick={handleCheckout}
        disabled={cart.length === 0 || isCheckingOut}
        className={`w-full ${
          cart.length === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {isCheckingOut ? (
          <>
            Checkout
            <Spinner />
          </>
        ) : (
          "Checkout"
        )}
      </Button>
    </div>
  );
}
