import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Input } from "../ui/input";

export default function CartSummary() {
  const { cart } = useCart();
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  async function handleCheckout() {
    setCheckoutError("");

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!customerName.trim()) {
      setCheckoutError("Please enter your name.");
      return;
    }

    if (!customerEmail.trim()) {
      setCheckoutError("Please enter your email.");
      return;
    }

    if (!customerPhone.trim()) {
      setCheckoutError("Please enter your phone number.");
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
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
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
      <div>
        <label htmlFor="customerName">Full Name</label>
        <Input
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="mt-1 -mb-2"
        />
      </div>

      <div>
        <label htmlFor="customerEmail">Email</label>
        <Input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="mt-1 -mb-2"
        />
      </div>

      <div>
        <label htmlFor="customerPhone">Phone</label>
        <Input
          id="customerPhone"
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
          className="mt-1 -mb-2"
        />
      </div>
      <div className="pt-2">
        <p>Subtotal: {formatCurrency(total)}</p>
      </div>

      {checkoutError && (
        <div
          role="alert"
          className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-sm"
        >
          <p className="font-semibold">{checkoutError}</p>
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
