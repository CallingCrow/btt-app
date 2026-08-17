import { useState } from "react";
import { CustomizeModal } from "../CustomizeModal";
import { useCart } from "@/context/CartContext";
import { useMenu } from "@/context/MenuContext";
import CartSummary from "./CartSummary";
import type { CartItem } from "@/types/cart";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import CartIcon from "../CartIcon";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cart, removeFromCart } = useCart();
  const { items } = useMenu();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const menuItem = editingItem
    ? items.find((item) => item.id === editingItem.itemId)
    : null;

  return (
    <div className="">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-screen md:w-[24rem] max-h-screen">
          <SheetHeader className="pt-2 border-b-2">
            <div className="flex items-center gap-4">
              <CartIcon w={25} h={25}></CartIcon>
              <SheetTitle className="!text-[1.25rem]">Your Cart</SheetTitle>
            </div>

            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {cart.length === 0 && <p>Your cart is empty</p>}
            {cart.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="flex justify-between">
                  <div className="gap-2 flex flex-row">
                    <p>x{item.quantity}</p>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                  <p>{formatCurrency(item.finalPrice * item.quantity)}</p>
                </div>

                <p className="text-[0.875rem] text-gray-500">
                  {item.customizations.map((c) => c.name).join(", ")}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    aria-label={`Edit ${item.name}`}
                    className="cursor-pointer text-primary hover:text-destructive"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                    className="cursor-pointer text-primary hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <SheetFooter className="border-t-2">
            <CartSummary />
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {editingItem && menuItem && (
        <CustomizeModal
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingItem(null);
            }
          }}
          id={menuItem.id}
          name={menuItem.name}
          price={menuItem.price}
          image={menuItem.image}
          descriptionL={menuItem.descriptionL}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
