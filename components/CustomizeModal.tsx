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
import { supabase } from "@/app/supabase-client";
import { useCart } from "@/context/CartContext";
import buildCartItem from "@/utils/buildCartItem";
import { formatCurrency } from "@/lib/utils";

interface CustomizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  name: string;
  price: number;
  image: string;
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
  const [loading, setLoading] = useState(false);
  const [customizations, setCustomizations] = useState<any[]>([]);
  const [defaultsMap, setDefaultsMap] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any[]>>(
    {},
  );
  const [quantity, setQuantity] = useState(1);
  const [finalPrice, setFinalPrice] = useState<number>(price || 0);
  const [isValid, setIsValid] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch the menu item, get its category
        const { data: item, error: itemError } = await supabase
          .from("menu")
          .select("id, category_id")
          .eq("id", id)
          .single();

        if (itemError || !item) {
          console.error("Menu item not found", itemError);
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
          setCustomizations([]);
          return;
        }

        type Group = {
          id: number;
          name: string;
          is_required: boolean;
          min_select: number;
          max_select: number;
        };

        // unwrap array
        const groupsList = (categoryGroups || [])
          .map((cg: any) => cg.group_id)
          .filter(Boolean) as Group[];

        if (groupsList.length === 0) {
          setCustomizations([]);
          return;
        }

        // Fetch all options for all groups at once (only if groupIds exist)
        const groupIds = groupsList.map((g) => g.id);
        let options: any[] = [];

        if (groupIds.length > 0) {
          const { data: optionsData, error: optionsError } = await supabase
            .from("customization_options")
            .select("id, name, price, group_id")
            .in("group_id", groupIds);

          if (optionsError) {
            console.error(
              "Error fetching customization options:",
              optionsError,
            );
          } else {
            options = optionsData || [];
          }
        }

        // Merge options into groups
        const groupsWithOptions = groupsList.map((group) => ({
          ...group,
          options: (options || []).filter((o) => o.group_id === group.id),
        }));

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
        }

        // Build defaults map for quick lookup
        const map: Record<string, any> = {};
        (defaults || []).forEach((d) => {
          map[d.option_id] = d;
        });
        setDefaultsMap(map);

        // Preselect defaults in frontend state
        const initialSelected: Record<string, any[]> = {};
        (defaults || []).forEach((d) => {
          const groupId = d.customization_options?.[0]?.group_id;
          if (groupId == null) return; // safety check

          if (!initialSelected[groupId]) {
            initialSelected[groupId] = [];
          }

          initialSelected[groupId].push({
            optionId: d.option_id,
            isDefault: true,
          });
        });

        setSelectedOptions(initialSelected);
      } catch (err) {
        console.error("Unexpected error fetching customization data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [open, id]);

  useEffect(() => {
    //passed in price
    let total = Number(price) || 0;

    Object.values(selectedOptions).forEach((group: any) => {
      group.forEach((opt: any) => {
        const defaultData = defaultsMap[opt.optionId];

        //if has a default
        if (defaultData) {
          const override = defaultData.price_override;

          if (override !== null && override !== undefined) {
            total += Number(override);
          } else {
            total += 0; //if no override, default to free
          }

          return;
        }

        //no default
        const option = customizations
          .flatMap((g) => g.options)
          .find((o) => o.id === opt.optionId);

        if (option) {
          total += Number(option.price) || 0;
        }
      });
    });

    setFinalPrice(total);
  }, [selectedOptions, customizations, price]);

  useEffect(() => {
    if (!open) {
      setSelectedOptions({});
      setDefaultsMap({});
      setCustomizations([]);
      setQuantity(1);
      setFinalPrice(price || 0);
    }
  }, [open]);

  //check if selections change
  useEffect(() => {
    const valid = isSelectionValid();
    setIsValid(valid);
  }, [selectedOptions, customizations]);

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
      customizations,
    });

    addToCart(item);
  }

  //ensure selections are within min_select and max_select
  function isSelectionValid(): boolean {
    if (!customizations.length) return false;

    for (const group of customizations) {
      const selected = selectedOptions[group.id] || [];

      const count = selected.length;

      // required minimum
      if (count < group.min_select) return false;

      // max constraint
      if (count > group.max_select) return false;
    }

    return true;
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
            <div className="flex md:hidden pl-[1.25rem]">
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
            <div className="-mx-4 no-scrollbar max-h-[65vh] min-[32rem]:max-h-[62vh] md:max-h-[48vh] overflow-y-auto px-4 py-4">
              <span className="text-[1.25rem]">Customize your item</span>
              {loading ? (
                <p>Loading...</p>
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

interface CustomizeBlockProps {
  group: any;
  selectedOptions: any;
  setSelectedOptions: any;
  defaultsMap: any;
}

const CustomizeBlock = ({
  group,
  selectedOptions,
  setSelectedOptions,
  defaultsMap,
}: CustomizeBlockProps) => {
  function toggleOption(option: any, group: any) {
    setSelectedOptions((prev: any) => {
      const groupSelections = prev[group.id] || [];

      const exists = groupSelections.find((o: any) => o.optionId === option.id);

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
          [group.id]: groupSelections.filter(
            (o: any) => o.optionId !== option.id,
          ),
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

      {(group.options || []).map((opt: any, key: any) => {
        const selected = (selectedOptions[group.id] || []).some(
          (o: any) => o.optionId === opt.id,
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

        const isSingle = group.max_select === 1;
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
