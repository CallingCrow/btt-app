import type { CartItem, CartCustomization } from "@/types/cart";
import type {
  SelectedOptions,
  CustomizationGroupWithOptions,
} from "@/types/ui";

interface BuildCartItemProps {
  itemId: string;
  name: string;
  price: number;
  finalPrice: number;
  quantity: number;

  selectedOptions: SelectedOptions;

  customizationGroups: CustomizationGroupWithOptions[];
}

export default function buildCartItem({
  itemId,
  name,
  price,
  finalPrice,
  quantity,
  selectedOptions,
  customizationGroups,
}: BuildCartItemProps): CartItem {
  const customizationsList: CartCustomization[] = [];

  Object.values(selectedOptions).forEach((group) => {
    group.forEach((opt) => {
      const option = customizationGroups
        ?.flatMap((g) => g.options)
        .find((o) => o.id === opt.optionId);

      if (option) {
        customizationsList.push({
          id: option.id,
          name: option.name,
          price: Number(option.price) || 0,
        });
      }
    });
  });

  return {
    id: crypto.randomUUID(),
    itemId,
    name,
    basePrice: Number(price) || 0,
    finalPrice,
    quantity,
    selectedOptions,
    customizations: customizationsList, //UI display
  };
}
