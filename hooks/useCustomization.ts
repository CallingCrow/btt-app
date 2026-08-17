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
  const [isValid, setIsValid] = useState(false);
  const [finalPrice, setFinalPrice] = useState(basePrice);

  // visual error indicator
  const [error, setError] = useState<string | null>(null);

  // reset customizations when modal is closed
  useEffect(() => {
    if (!open) {
      setSelectedOptions({});
      setDefaultsMap({});
      setCustomizations([]);
      setFinalPrice(basePrice);
    }
  }, [open]);

  //ensure selections are within min_select and max_select
  useEffect(() => {
    setIsValid(isCustomizationSelectionValid(customizations, selectedOptions));
  }, [customizations, selectedOptions]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function fetchData() {
      try {
        setError(null);
        setLoading(true);

        // Fetch the menu item, get its category
        const { data: item, error: itemError } = await supabase
          .from("menu")
          .select("id, category_id")
          .eq("id", id)
          .single();

        if (itemError || !item) {
          console.error("Menu item not found", itemError);
          setError("Unable to load menu item.");
          setCustomizations([]);
          return;
        }

        // Fetch all groups linked to this category via the join table
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
          setError("Error fetching category groups.");
          setCustomizations([]);
          return;
        }

        // unwrap array
        const groupsList = (categoryGroups ?? []).map((cg) => cg.group_id);

        if (groupsList.length === 0) {
          setCustomizations([]);
          return;
        }

        // Fetch all options for all groups at once (only if groupIds exist)
        const groupIds = groupsList.map((g) => g.id);
        let options: CustomizationOption[] = [];

        if (groupIds.length > 0) {
          const { data: optionsData, error: optionsError } = await supabase
            .from("customization_options")
            .select("id, name, price, group_id")
            .in("group_id", groupIds)
            .order("display_order", { ascending: true });

          if (optionsError) {
            console.error(
              "Error fetching customization options:",
              optionsError,
            );
            setError("Error fetching customization options.");
          } else {
            options = optionsData || [];
          }
        }

        // Merge options into groups
        const groupsWithOptions = groupsList.map((group) => ({
          ...group,
          options: options.filter((o) => o.group_id === group.id),
        }));

        if (cancelled) return;

        setCustomizations(groupsWithOptions);

        // Fetch defaults
        const { data: defaults, error: defaultsError } = await supabase
          .from("customization_defaults")
          .select(
            "option_id, price_override, is_removable, customization_options(id, group_id)",
          )
          .eq("item_id", id);

        if (defaultsError) {
          console.error("Error fetching defaults:", defaultsError);
          setError("Error fetching defaults.");
        }

        // Build defaults map for quick lookup
        const map: Record<string, CustomizationDefaultWithOption> = {};
        (defaults || []).forEach((d) => {
          map[d.option_id] = d;
        });
        if (cancelled) return;
        setDefaultsMap(map);

        // Initialize selections.
        //
        // When editing an existing cart item, use its existing selections.
        // Otherwise, use the item's defaults.
        if (initialSelectedOptions) {
          setSelectedOptions(initialSelectedOptions);
        } else {
          const initialSelected: SelectedOptions = {};

          (defaults || []).forEach((d) => {
            const customizationOption = Array.isArray(d.customization_options)
              ? d.customization_options[0]
              : d.customization_options;

            const groupId = customizationOption?.group_id;

            if (groupId == null) return;

            if (!initialSelected[groupId]) {
              initialSelected[groupId] = [];
            }

            initialSelected[groupId].push({
              optionId: d.option_id,
              isDefault: true,
            });
          });

          setSelectedOptions(initialSelected);
        }
      } catch (err) {
        console.error("Error fetching customization data:", err);
        setError("Error fetching customization options");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [open, id, initialSelectedOptions]);

  // calculate customization pricing and apply to final price
  useEffect(() => {
    const total = calculateCustomizationPrice({
      basePrice,
      selectedOptions,
      customizations,
      defaultsMap,
    });

    setFinalPrice(total);
  }, [basePrice, selectedOptions, customizations, defaultsMap]);

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
