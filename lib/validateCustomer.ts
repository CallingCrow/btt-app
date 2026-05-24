interface Customer {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
}

export function validateCustomer(customer: Customer) {
  // name
  if (
    customer.name &&
    (
      typeof customer.name !== "string" ||
      customer.name.length > 100
    )
  ) {
    throw new Error("Invalid customer name");
  }

  // email
  if (
    customer.email &&
    (
      typeof customer.email !== "string" ||
      !customer.email.includes("@") ||
      customer.email.length > 200
    )
  ) {
    throw new Error("Invalid email");
  }

  // phone
  if (
    customer.phone &&
    (
      typeof customer.phone !== "string" ||
      customer.phone.length > 30
    )
  ) {
    throw new Error("Invalid phone");
  }
}