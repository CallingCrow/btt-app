import { useCart } from "@/context/CartContext";
import CartSummary from "./CartSummary";
import { CartItem } from "@/types/cart";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import CartIcon from "../CartIcon";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cart } = useCart();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-screen">
        <SheetHeader className="pt-2 border-b-2">
          <div className="flex items-center gap-4">
            <CartIcon w={25} h={25}></CartIcon>
            <SheetTitle className="!text-[1.25rem]">Your Cart</SheetTitle>
          </div>

          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          {cart.length === 0 && <p>Your cart is empty</p>}
          {cart.map((item: CartItem) => (
            <div key={item.id} className="mb-4">
              <div className="flex justify-between">
                <div className="gap-2 flex flex-row">
                  <p>x{item.quantity}</p>
                  <p className="font-semibold">{item.name}</p>
                </div>
                <p>{formatCurrency(item.finalPrice)}</p>
              </div>

              <p className="text-[0.875rem] text-gray-500">
                {item.customizations.map((c) => c.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
        <SheetFooter className="border-t-2">
          <CartSummary />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
