interface Customer {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
}

export function validateCustomer(customer: Customer) {
  // Make sure customer is an object
  if (!customer || typeof customer !== "object") {
    throw new Error("Customer information is required");
  }

  // Name
  if (typeof customer.name !== "string" || customer.name.trim().length === 0) {
    throw new Error("Please enter your name");
  }

  if (customer.name.trim().length > 100) {
    throw new Error("Name is too long");
  }

  // Email
  if (
    typeof customer.email !== "string" ||
    customer.email.trim().length === 0
  ) {
    throw new Error("Please enter your email");
  }

  const email = customer.email.trim();

  if (email.length > 200) {
    throw new Error("Email is too long");
  }

  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  // Phone
  if (
    typeof customer.phone !== "string" ||
    customer.phone.trim().length === 0
  ) {
    throw new Error("Please enter your phone number");
  }

  const phone = customer.phone.trim();

  if (phone.length > 30) {
    throw new Error("Phone number is too long");
  }

  // Allow common phone-number characters:
  // digits, spaces, parentheses, hyphens, periods, and +
  const phonePattern = /^[0-9+().\-\s]+$/;

  if (!phonePattern.test(phone)) {
    throw new Error("Please enter a valid phone number");
  }

  return {
    name: customer.name.trim(),
    email,
    phone,
  };
}
