export default function buildCloverLineItems(cart: any) {
    return cart.map((item: any) => ({
        name: item.name,
        price: item.finalPrice,
        unitQty: item.quantity || 1,
        note: item.customizations.map((c: any) => c.name).join(", ")
    }));
}