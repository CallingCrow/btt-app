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

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0,
  );

  function validateName(value: string) {
    const name = value.trim();

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length > 50) {
      return "Name must be 50 characters or fewer.";
    }

    if (name.split(/\s+/).length < 2) {
      return "Please enter your first and last name.";
    }

    return "";
  }

  function validateEmail(value: string) {
    const email = value.trim();

    if (!email) {
      return "Please enter your email address.";
    }

    if (email.length > 100) {
      return "Email must be 100 characters or fewer.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  function validatePhone(value: string) {
    const phone = value.trim();

    if (!phone) {
      return "Please enter your phone number.";
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
      return "Phone number must be in the format XXX-XXX-XXXX.";
    }

    return "";
  }

  async function handleCheckout() {
    setCheckoutError("");

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const newNameError = validateName(customerName);
    const newEmailError = validateEmail(customerEmail);
    const newPhoneError = validatePhone(customerPhone);

    setNameError(newNameError);
    setEmailError(newEmailError);
    setPhoneError(newPhoneError);

    if (newNameError || newEmailError || newPhoneError) {
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
          onChange={(e) => {
            const value = e.target.value;
            setCustomerName(value);

            if (nameError) {
              setNameError(validateName(value));
            }
          }}
          onBlur={() => setNameError(validateName(customerName))}
          placeholder="John Doe"
          maxLength={50}
          required
          className="mt-1 -mb-2"
        />
        {nameError && (
          <p
            id="customerName-error"
            className="mt-2 -mb-2 text-sm text-destructive"
          >
            {nameError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="customerEmail">Email</label>
        <Input
          id="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => {
            const value = e.target.value;
            setCustomerEmail(value);

            if (emailError) {
              setEmailError(validateEmail(value));
            }
          }}
          onBlur={() => setEmailError(validateEmail(customerEmail))}
          placeholder="JohnDoe@example.com"
          maxLength={50}
          required
          className="mt-1 -mb-2"
        />
        {emailError && (
          <p
            id="customerEmail-error"
            className="mt-2 -mb-2 text-sm text-destructive"
          >
            {emailError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="customerPhone">Phone</label>
        <Input
          id="customerPhone"
          type="tel"
          value={customerPhone}
          onChange={(e) => {
            const value = e.target.value;
            setCustomerPhone(value);

            if (phoneError) {
              setPhoneError(validatePhone(value));
            }
          }}
          onBlur={() => setPhoneError(validatePhone(customerPhone))}
          placeholder="XXX-XXX-XXXX"
          maxLength={12}
          required
          className="mt-1 -mb-2"
        />
        {phoneError && (
          <p
            id="customerPhone-error"
            className="mt-2 -mb-2 text-sm text-destructive"
          >
            {phoneError}
          </p>
        )}
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
