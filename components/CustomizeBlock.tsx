import { formatCurrency } from "@/lib/utils";

import type { Dispatch, SetStateAction } from "react";

import type { CustomizationOption } from "@/types/db";

import type {
  SelectedOptions,
  CustomizationGroupWithOptions,
  CustomizationDefaultWithOption,
} from "@/types/ui";

interface CustomizeBlockProps {
  group: CustomizationGroupWithOptions;

  selectedOptions: SelectedOptions;

  setSelectedOptions: Dispatch<SetStateAction<SelectedOptions>>;

  defaultsMap: Record<string, CustomizationDefaultWithOption>;
}

export const CustomizeBlock = ({
  group,
  selectedOptions,
  setSelectedOptions,
  defaultsMap,
}: CustomizeBlockProps) => {
  function toggleOption(
    option: CustomizationOption,
    group: CustomizationGroupWithOptions,
  ) {
    setSelectedOptions((prev) => {
      const groupSelections = prev[group.id] || [];

      const exists = groupSelections.find((o) => o.optionId === option.id);

      if (exists) {
        //block removing non-removable default
        if (
          exists.isDefault &&
          defaultsMap[option.id] &&
          !defaultsMap[option.id].is_removable
        ) {
          return prev;
        }

        //prevent remove if below min_select
        if (groupSelections.length <= group.min_select) {
          return prev;
        }

        // remove
        return {
          ...prev,
          [group.id]: groupSelections.filter((o) => o.optionId !== option.id),
        };
      }

      //prevent exceed max_select
      if (groupSelections.length >= group.max_select) {
        //if single select
        if (group.max_select === 1) {
          //add
          return {
            ...prev,
            [group.id]: [{ optionId: option.id, isDefault: false }],
          };
        }
        return prev;
      }

      //add normally
      return {
        ...prev,
        [group.id]: [
          ...groupSelections,
          { optionId: option.id, isDefault: false },
        ],
      };
    });
  }
  return (
    <div className="bg-card px-[1.25rem] py-[1.25rem] rounded-lg my-2">
      <h6>{group.name}</h6>
      <div className="text-muted-foreground">
        {" "}
        Select{" "}
        {group.min_select != group.max_select
          ? `${group.min_select} - ${group.max_select}`
          : `${group.min_select}`}{" "}
      </div>

      {(group.options || []).map((opt, key) => {
        const selected = (selectedOptions[group.id] || []).some(
          (o) => o.optionId === opt.id,
        );

        const defaultData = defaultsMap[opt.id];
        let displayPrice = opt.price;
        if (defaultData) {
          if (
            defaultData.price_override !== null &&
            defaultData.price_override !== undefined
          ) {
            displayPrice = defaultData.price_override;
          } else {
            displayPrice = 0;
          }
        }

        const isSingle = group.max_select === 1 && group.min_select === 1;
        const isLocked =
          selected && defaultsMap[opt.id] && !defaultsMap[opt.id].is_removable;

        return (
          <div key={key} className="mt-1 py-2 border-t-2">
            <label
              key={opt.id}
              className="flex flex-row justify-between items-center gap-2 cursor-pointer"
            >
              <div className="flex flex-col">
                {opt.name}
                <span className="text-muted-foreground">
                  +{formatCurrency(displayPrice)}
                </span>
              </div>
              <div className="">
                <input
                  type={isSingle ? "radio" : "checkbox"}
                  checked={selected}
                  disabled={isLocked}
                  onChange={() => toggleOption(opt, group)}
                  className="accent-primary hover:cursor-pointer"
                />
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
};
