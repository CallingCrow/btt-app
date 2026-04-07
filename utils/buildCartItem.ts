import { CartItem } from "@/types/cart";

interface BuildCartItemProps {
  name: string;
  price: number;
  finalPrice: number;
  quantity: number;
  selectedOptions: Record<string, any[]>;
  customizations: any[];
}

export default function buildCartItem({
  name,
  price,
  finalPrice,
  quantity,
  selectedOptions,
  customizations
}: BuildCartItemProps): CartItem {
    const customizationsList: { name: string; price: number }[] = [];

    Object.values(selectedOptions || {}).forEach((group: any) => {
        group.forEach((opt: any) => {
            const option = customizations
                ?.flatMap((g: any) => g.options)
                .find((o: any) => o.id === opt.optionId);

            if (option) {
                customizationsList.push({
                    name: option.name,
                    price: Number(option.price) || 0
                });
            }
        });
    });

    return {
        id: crypto.randomUUID(),
        name,
        basePrice: Number(price) || 0,
        finalPrice,
        quantity,
        customizations: customizationsList
    };
}