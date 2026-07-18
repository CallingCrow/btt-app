import type {
  SelectedOptions,
  CustomizationGroupWithOptions,
  CustomizationDefaultWithOption,
} from "@/types/ui";

interface CalculateCustomizationPriceParams {
  basePrice: number;

  selectedOptions: SelectedOptions;

  customizations: CustomizationGroupWithOptions[];

  defaultsMap: Record<string, CustomizationDefaultWithOption>;
}

export function calculateCustomizationPrice({
  basePrice,
  selectedOptions,
  customizations,
  defaultsMap,
}: CalculateCustomizationPriceParams): number {
  let total = Number(basePrice) || 0;

  Object.values(selectedOptions).forEach((group) => {
    group.forEach((opt) => {
      const defaultData = defaultsMap[opt.optionId];

      if (defaultData) {
        const override = defaultData.price_override;

        if (override !== null && override !== undefined) {
          total += Number(override);
        }

        return;
      }

      const option = customizations
        .flatMap((g) => g.options)
        .find((o) => o.id === opt.optionId);

      if (option) {
        total += Number(option.price) || 0;
      }
    });
  });

  return total;
}
