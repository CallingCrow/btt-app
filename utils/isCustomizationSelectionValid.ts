import type {
  SelectedOptions,
  CustomizationGroupWithOptions,
} from "@/types/ui";

export function isCustomizationSelectionValid(
  customizations: CustomizationGroupWithOptions[],
  selectedOptions: SelectedOptions,
): boolean {
  if (!customizations.length) {
    return false;
  }

  for (const group of customizations) {
    const selected = selectedOptions[group.id] || [];

    if (selected.length < group.min_select) {
      return false;
    }

    if (selected.length > group.max_select) {
      return false;
    }
  }

  return true;
}
