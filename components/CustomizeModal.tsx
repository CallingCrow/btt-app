import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import { useState, useEffect } from "react";
import { supabase } from "@/app/supabase-client";


interface CustomizeModalProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    id: string,
    name: string,
    price: number,
    image: string,
    descriptionL: string,
}

export function CustomizeModal({ open, onOpenChange, id, name, price, image, descriptionL }: CustomizeModalProps) {
    const [loading, setLoading] = useState(false);
    const [customizations, setCustomizations] = useState<any[]>([]);
    const [defaultsMap, setDefaultsMap] = useState<Record<string, any>>({});
    const [selectedOptions, setSelectedOptions] = useState<Record<string, any[]>>({});
    const [quantity, setQuantity] = useState(1);
    const [finalPrice, setFinalPrice] = useState();

    useEffect(() => {
        if (!open) return;

        async function fetchData() {
            try {
                setLoading(true);

                // 1️⃣ Fetch the menu item to get its category
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

                // 2️⃣ Fetch all groups linked to this category via the join table
                const { data: categoryGroups, error: categoryGroupsError } = await supabase
                    .from("category_customization_groups")
                    .select(`
        group_id (
          id,
          name,
          is_required,
          min_select,
          max_select
        )
      `)
                    .eq("category_id", item.category_id);

                if (categoryGroupsError) {
                    console.error("Error fetching category groups:", categoryGroupsError);
                    setCustomizations([]);
                    return;
                }

                const groupsList = (categoryGroups || []).map(cg => cg.group_id);

                if (groupsList.length === 0) {
                    setCustomizations([]);
                    return;
                }

                // 3️⃣ Fetch all options for all groups at once (only if groupIds exist)
                const groupIds = groupsList.map(g => g.id);
                let options: any[] = [];

                if (groupIds.length > 0) {
                    const { data: optionsData, error: optionsError } = await supabase
                        .from("customization_options")
                        .select("id, name, price, group_id")
                        .in("group_id", groupIds);

                    if (optionsError) {
                        console.error("Error fetching customization options:", optionsError);
                    } else {
                        options = optionsData || [];
                    }
                }

                // 4️⃣ Merge options into groups
                const groupsWithOptions = groupsList.map(group => ({
                    ...group,
                    options: options.filter(o => o.group_id === group.id)
                }));

                setCustomizations(groupsWithOptions);

                // 5️⃣ Fetch defaults for this menu item
                const { data: defaults, error: defaultsError } = await supabase
                    .from("customization_defaults")
                    .select("option_id, price_override, customization_options(id, group_id)")
                    .eq("item_id", id);

                if (defaultsError) {
                    console.error("Error fetching defaults:", defaultsError);
                }

                // 6️⃣ Build defaults map for quick lookup
                const map: Record<string, any> = {};
                (defaults || []).forEach(d => {
                    map[d.option_id] = d;
                });
                setDefaultsMap(map);

                // 7️⃣ Preselect defaults in frontend state
                const initialSelected: Record<string, any[]> = {};
                (defaults || []).forEach(d => {
                    const groupId = d.customization_options?.group_id;
                    if (!groupId) return; // safety check

                    if (!initialSelected[groupId]) {
                        initialSelected[groupId] = [];
                    }

                    initialSelected[groupId].push({
                        optionId: d.option_id,
                        isDefault: true
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
        let total = price;

        Object.values(selectedOptions).forEach((group: any) => {
            group.forEach((opt: any) => {
                if (opt.isDefault && defaultsMap[opt.optionId]?.price_override !== null) {
                    total += defaultsMap[opt.optionId].price_override;
                } else {
                    const option = customizations
                        .flatMap(g => g.options)
                        .find(o => o.id === opt.optionId);

                    if (option) {
                        total += option.price;
                    }
                }
            });
        });

        setFinalPrice(total);
    }, [selectedOptions, customizations]);

    function handlePlus() {
        setQuantity(a => a + 1);
    }
    function handleMinus() {
        if (quantity > 1) {
            setQuantity(a => a - 1);
        }
    }

    //total = base_price + sum(selectedOptions.price_adjustment)
    /*
    Pricing logic
    function getOptionPrice(optionId, defaultsMap) {
        const defaultEntry = defaultsMap[optionId];

        if (defaultEntry) {
            return defaultEntry.price_override ?? option.price_adjustment;
        }

        return option.price_adjustment;
    }

    //must distinguish between default selection and user-added slection
    in frontend state:
    {
        optionId: "boba_id",
        isDefault: true
    }

    */

    /*
    Selecting defaults

    const [selectedOptions, setSelectedOptions] = useState({})
    defaults.forEach(opt => {
    setSelectedOptions(prev => ({
        ...prev,
        [opt.group_id]: [...(prev[opt.group_id] || []), opt.id]
    }))
    })


    */

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="flex w-[70vw] h-[80vh]">
                <div>
                    {/* Image */}
                    <img
                        src={image}
                        alt='Image of Drink'
                        className='size-full rounded-l-lg w-auto'
                    />
                </div>
                <div>
                    <DialogHeader className="py-4 ml-[40px]">
                        <DialogTitle><h5>{name}</h5></DialogTitle>
                        <DialogDescription>
                            <h5>
                                ${finalPrice}
                            </h5>
                            <p className="text-muted-foreground">
                                {descriptionL}
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-gray-100 px-[40px]">
                        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 py-4">
                            <span className="text-[20px]">Customize your item</span>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                customizations.map(group => (
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
                    <DialogFooter className="pb-4 pr-4 ml-[40px]">
                        <div className="flex justify-between w-full mt-4">
                            <div className="flex gap-x-2">
                                <button onClick={handleMinus} className="cursor-pointer"><CircleMinus /></button>
                                <h5>{quantity}</h5>
                                <button onClick={handlePlus} className="cursor-pointer"><CirclePlus /></button>
                            </div>

                            <DialogClose asChild>
                                <Button variant="default" size="md" className="px-10 cursor-pointer">Add to Cart</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface CustomizeBlockProps {
    group: any;
    selectedOptions: any;
    setSelectedOptions: any;
    defaultsMap: any;
}

const CustomizeBlock = ({ group, selectedOptions, setSelectedOptions, defaultsMap }: CustomizeBlockProps) => {

    function toggleOption(option: any, group: any) {
        setSelectedOptions((prev: any) => {
            const groupSelections = prev[group.id] || [];

            const exists = groupSelections.find((o: any) => o.optionId === option.id);

            if (exists) {
                //block removing non-removable default
                if (exists.isDefault && defaultsMap[option.id] && !defaultsMap[option.id].is_removable) {
                    return prev;
                }


                //prevent remove if below min_select
                if (groupSelections.length <= group.min_select) {
                    return prev;
                }

                // remove
                return {
                    ...prev,
                    [group.id]: groupSelections.filter((o: any) => o.optionId !== option.id)
                };
            }

            //prevent exceed max_select
            if (groupSelections.length >= group.max_select) {
                //if single select
                if (group.max_select === 1) {
                    //add
                    return {
                        ...prev,
                        [group.id]: [{ optionId: option.id, isDefault: false }]
                    };
                }
                return prev;
            }

            //add normally
            return {
                ...prev,
                [group.id]: [
                    ...groupSelections,
                    { optionId: option.id, isDefault: false }
                ]
            };
        });
    }

    return (
        <div className="bg-card px-[20px] py-[20px] rounded-lg my-2">
            <h6>{group.name}</h6>
            <div className="text-muted-foreground"> Select {group.min_select != group.max_select ? `${group.min_select} - ${group.max_select}` : `${group.min_select}`} </div>

            {group.options.map((opt: any, key: any) => {
                const selected = (selectedOptions[group.id] || []).some(
                    (o: any) => o.optionId === opt.id
                );

                const isSingle = group.max_select === 1;
                const isLocked =
                    selected &&
                    defaultsMap[opt.id] &&
                    !defaultsMap[opt.id].is_removable;

                return (
                    <div key={key} className="mt-1 py-2 border-t-2">
                        <label key={opt.id} className="flex justify-between items-center gap-2 cursor-pointer">
                            <span className="flex flex-col">
                                {opt.name} 
                                <span className="text-muted-foreground">+${opt.price}</span>
                            </span>
                            <input
                                type={isSingle ? "radio" : "checkbox"}
                                checked={selected}
                                disabled={isLocked}
                                onChange={() => toggleOption(opt, group)}
                            />
                        </label>
                    </div>
                );
            })}
        </div>
    );
};