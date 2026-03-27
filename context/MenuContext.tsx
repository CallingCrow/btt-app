    "use client";

    import { createContext, useContext, useEffect, useState } from "react";
    import { supabase } from "@/app/supabase-client";
    import { useMemo } from "react";

    export type MenuItem = {
        id: number;
        name: string;
        category_id: number;
        price: number;
        image: string;
        descriptionS: string;
        descriptionL: string;
        menu_categories: {
            id: number;
            name: string;
        };
    };

    type MenuContextType = {
        items: MenuItem[];
        groupedItems: Map<number, MenuItem[]>;
        categories: { id: number; name: string }[];
        loading: boolean;
        refetch: () => Promise<void>;
    };

    const MenuContext = createContext<MenuContextType | null>(null);

    export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        const { data, error } = await supabase
        .from("menu")
        .select(`
            id,
            name,
            category_id,
            price,
            image,
            descriptionS,
            descriptionL,
            menu_categories (
                id,
                display_order,
                name
            )
        `)
        .order("category_id")
        .order("name");

        if (error) {
            console.error("Error fetching menu:", error.message);
            return;
        }

        setItems(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("menu_categories")
            .select("*")
            .order("id");

        if (error) {
            console.error(error);
            return;
        }

        setCategories(data || []);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const groupedItems = useMemo(() => {
        const map = new Map<number, MenuItem[]>();

        items.forEach((item) => {  
            const categoryId = item.category_id;
            
            if (!categoryId) return;
            if (!map.has(categoryId)) {
                map.set(categoryId, []);
            }

            map.get(categoryId)!.push(item);
        });

        return map;
    }, [items]);

    return (
        <MenuContext.Provider
            value={{
                items,
                groupedItems,
                categories,
                loading,
                refetch: fetchMenu,
            }}
        >
        {children}
        </MenuContext.Provider>
    );
    };

    export const useMenu = () => {
        const context = useContext(MenuContext);

        if (!context) {
            throw new Error("useMenu must be used inside MenuProvider");
        }

        return context;
    };