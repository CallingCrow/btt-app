import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import buildCartItem from "@/utils/buildCartItem";
import { formatCurrency } from "@/lib/utils";
import { CustomizeBlock } from "@/components/CustomizeBlock";
import { useCustomization } from "@/hooks/useCustomization";

interface CustomizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  price: number;
  image: string | null;
  descriptionL: string;
}

export function CustomizeModal({
  open,
  onOpenChange,
  id,
  name,
  price,
  image,
  descriptionL,
}: CustomizeModalProps) {
  const { addToCart } = useCart();
  const {
    loading,
    customizations,
    defaultsMap,
    selectedOptions,
    setSelectedOptions,
    finalPrice,
    isValid,
    error,
  } = useCustomization(id, price, open);
  const [quantity, setQuantity] = useState(1);

  // reset customizations when modal is closed
  useEffect(() => {
    if (!open) {
      setQuantity(1);
    }
  }, [open]);

  function handlePlus() {
    if (quantity < 10) {
      setQuantity((a) => a + 1);
    }
  }
  function handleMinus() {
    if (quantity > 1) {
      setQuantity((a) => a - 1);
    }
  }

  function handleAddToCart() {
    const item = buildCartItem({
      itemId: id,
      name,
      price,
      finalPrice,
      quantity,
      selectedOptions,
      customizationGroups: customizations,
    });

    addToCart(item);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col w-full h-full rounded-none md:rounded-lg md:flex-row md:w-[80vw] md:h-[80vh]">
        {/* Image on left only on desktop */}
        <div className="hidden md:flex">
          <div className="w-auto h-auto flex">
            {/* Image */}
            {image === null || image === "" ? (
              <div></div>
            ) : (
              <img
                src={image}
                alt="Image of Drink"
                className="size-full rounded-l-lg max-h-[30vh] md:max-h-[100vh] md:w-auto md:h-[100%] object-contain"
              />
            )}
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex">
            {/* Image on left of text only on mobile view */}
            <div className="flex md:hidden pl-[1.25rem] max-h-[20vh] max-w-[25vw]">
              {/* Image */}
              {image === null || image === "" ? (
                <div></div>
              ) : (
                <img
                  src={image}
                  alt="Image of Drink"
                  className="size-full max-h-[80vh] md:max-h-[100vh] md:w-auto md:h-[100%] object-contain"
                />
              )}
            </div>
            <DialogHeader className="py-4 ml-[1rem] mr-[2.5rem] text-left">
              <DialogTitle className="!text-[1.5rem]">{name}</DialogTitle>
              <DialogDescription className="flex flex-col -mt-2">
                <span className="!text-[1.25rem]">
                  {formatCurrency(finalPrice)}
                </span>
                <span className="text-muted-foreground !text-[0.875rem] flex flex-col">
                  {descriptionL}
                  {!isValid && (
                    <span className="text-destructive mt-[0.5rem]">
                      Please complete all required selections
                    </span>
                  )}
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="bg-gray-100 px-[2.5rem] h-full overflow-y-auto">
            <div className="-mx-4 no-scrollbar overflow-y-auto px-4 py-4">
              <span className="text-[1.25rem]">Customize your item</span>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : (
                customizations.map((group) => (
                  <CustomizeBlock
                    key={group.id}
                    group={group}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    defaultsMap={defaultsMap}
                  />
                ))
              )}
            </div>
          </div>
          <DialogFooter className="py-2 px-[2.5rem] h-[3.75rem] flex items-center">
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-x-2 items-center">
                <button onClick={handleMinus} className="cursor-pointer">
                  <CircleMinus />
                </button>
                <h5>{quantity}</h5>
                <button onClick={handlePlus} className="cursor-pointer">
                  <CirclePlus />
                </button>
              </div>

              <DialogClose asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="px-10 cursor-pointer"
                  onClick={handleAddToCart}
                  disabled={!isValid}
                >
                  Add to Cart
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
