import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import buildCloverLineItems from "@/utils/buildCloverPayload";
import { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";

export default function CartSummary() {
  const { cart } = useCart();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.finalPrice * item.quantity,
    0,
  );

  function formatPhone(value: string) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "").slice(0, 10); // max 10 digits
    const parts = [];

    if (digits.length > 0) parts.push(`(${digits.slice(0, 3)}`);
    if (digits.length >= 4) parts.push(`) ${digits.slice(3, 6)}`);
    if (digits.length >= 7) parts.push(`-${digits.slice(6, 10)}`);

    return parts.join("").trim();
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value));
  }

  useEffect(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(phone); // formatted pattern
    const nameValid = firstName.trim().length > 0 && lastName.trim().length > 0;

    setIsValid(emailValid && phoneValid && nameValid);
  }, [email, firstName, lastName, phone]);

  async function handleCheckout() {
    if (!email || !firstName || !lastName || !phone) {
      alert("Please fill out all customer information fields before checkout.");
      return;
    }

    try {
      const lineItems = buildCloverLineItems(cart);
      const phoneDigits = phone.replace(/\D/g, "");

      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems,
          customer: { email, firstName, lastName, phone },
        }),
      });

      const data = await res.json();
      console.log("Checkout response:", data);

      if (data.href) {
        // redirect user to Clover checkout page
        window.location.href = data.href;
      } else {
        console.error("No checkout URL returned", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <p>Contact</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="pt-4 pb-2">
        <p>Total: {formatCurrency(total)}</p>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={!isValid}
        className={`w-full ${
          isValid
            ? "cursor-pointer"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Checkout
      </Button>
    </div>
  );
}
