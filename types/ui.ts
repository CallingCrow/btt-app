import type {
  CustomizationGroup,
  CustomizationOption,
  CustomizationDefault,
} from "./db";

export interface SelectedOption {
  optionId: string;
  isDefault: boolean;
}

export type SelectedOptions =
  Record<string, SelectedOption[]>;

export interface CustomizationGroupWithOptions
  extends CustomizationGroup {
  options: CustomizationOption[];
}

export interface CustomizationDefaultWithOption {
  option_id: string;
  is_removable: boolean;
  price_override: number | null;

  customization_options: {
    id: string;
    group_id: string;
  } | null;
}