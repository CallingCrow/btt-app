import { useEffect, useState } from "react";

import { supabase } from "@/app/supabase-client";
import { calculateCustomizationPrice } from "@/utils/calculateCustomizationPrice";
import { isCustomizationSelectionValid } from "@/utils/isCustomizationSelectionValid";

import type { CustomizationOption } from "@/types/db";
import type {
  SelectedOptions,
  CustomizationGroupWithOptions,
  CustomizationDefaultWithOption,
} from "@/types/ui";

interface UseCustomizationReturn {
  loading: boolean;
  customizations: CustomizationGroupWithOptions[];
  defaultsMap: Record<string, CustomizationDefaultWithOption>;
  selectedOptions: SelectedOptions;
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptions>>;
  finalPrice: number;
  isValid: boolean;
  error: string | null;
}

export function useCustomization(
  id: string,
  basePrice: number,
  open: boolean,
  initialSelectedOptions?: SelectedOptions,
): UseCustomizationReturn {
  const [loading, setLoading] = useState(false);
  const [customizations, setCustomizations] = useState<
    CustomizationGroupWithOptions[]
  >([]);
  const [defaultsMap, setDefaultsMap] = useState<
    Record<string, CustomizationDefaultWithOption>
  >({});
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch the menu item and determine its category.
        const { data: item, error: itemError } = await supabase
          .from("menu")
          .select("id, category_id")
          .eq("id", id)
          .single();

        if (itemError || !item) {
          console.error("Menu item not found", itemError);

          if (!cancelled) {
            setError("Unable to load menu item.");
            setCustomizations([]);
          }

          return;
        }

        // Fetch customization groups associated with the category.
        const { data: categoryGroups, error: categoryGroupsError } =
          await supabase
            .from("category_customization_groups")
            .select(
              `
              group_id (
                id,
                name,
                is_required,
                min_select,
                max_select
              )
            `,
            )
            .eq("category_id", item.category_id);

        if (categoryGroupsError) {
          console.error("Error fetching category groups:", categoryGroupsError);

          if (!cancelled) {
            setError("Error fetching category groups.");
            setCustomizations([]);
          }

          return;
        }

        const groupsList = (categoryGroups ?? [])
          .map((cg) => cg.group_id)
          .filter(
            (group): group is CustomizationGroupWithOptions => group !== null,
          );

        if (groupsList.length === 0) {
          if (!cancelled) {
            setCustomizations([]);
            setDefaultsMap({});
            setSelectedOptions(initialSelectedOptions ?? {});
          }

          return;
        }

        // Fetch all options for these groups.
        const groupIds = groupsList.map((group) => group.id);

        const { data: optionsData, error: optionsError } = await supabase
          .from("customization_options")
          .select("id, name, price, group_id, display_order")
          .in("group_id", groupIds)
          .order("display_order", { ascending: true });

        if (optionsError) {
          console.error("Error fetching customization options:", optionsError);

          if (!cancelled) {
            setError("Error fetching customization options.");
          }

          return;
        }

        const options: CustomizationOption[] = optionsData ?? [];

        const groupsWithOptions = groupsList.map((group) => ({
          ...group,
          options: options.filter((option) => option.group_id === group.id),
        }));

        // Fetch item-specific defaults.
        const { data: defaults, error: defaultsError } = await supabase
          .from("customization_defaults")
          .select(
            "option_id, price_override, is_removable, customization_options(id, group_id)",
          )
          .eq("item_id", id);

        if (defaultsError) {
          console.error("Error fetching defaults:", defaultsError);

          if (!cancelled) {
            setError("Error fetching defaults.");
          }

          return;
        }

        const map: Record<string, CustomizationDefaultWithOption> = {};

        (defaults ?? []).forEach((defaultOption) => {
          map[defaultOption.option_id] = defaultOption;
        });

        // Editing an existing cart item takes priority over defaults.
        let initialSelected: SelectedOptions;

        if (initialSelectedOptions) {
          initialSelected = initialSelectedOptions;
        } else {
          initialSelected = {};

          (defaults ?? []).forEach((defaultOption) => {
            const customizationOption = Array.isArray(
              defaultOption.customization_options,
            )
              ? defaultOption.customization_options[0]
              : defaultOption.customization_options;

            const groupId = customizationOption?.group_id;

            if (!groupId) {
              return;
            }

            if (!initialSelected[groupId]) {
              initialSelected[groupId] = [];
            }

            initialSelected[groupId].push({
              optionId: defaultOption.option_id,
              isDefault: true,
            });
          });
        }

        if (cancelled) {
          return;
        }

        setCustomizations(groupsWithOptions);
        setDefaultsMap(map);
        setSelectedOptions(initialSelected);
      } catch (err) {
        console.error("Error fetching customization data:", err);

        if (!cancelled) {
          setError("Error fetching customization options.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [open, id, initialSelectedOptions]);

  const isValid = isCustomizationSelectionValid(
    customizations,
    selectedOptions,
  );

  const finalPrice = calculateCustomizationPrice({
    basePrice,
    selectedOptions,
    customizations,
    defaultsMap,
  });

  return {
    loading,
    customizations,
    defaultsMap,
    selectedOptions,
    setSelectedOptions,
    finalPrice,
    isValid,
    error,
  };
}
