    "use client";

    import { createContext, useContext, useEffect, useState } from "react";
    import { supabase } from "@/app/supabase-client";
    import { useMemo } from "react";

    export type MenuItem = {
    name: string;
    type: string;
    priceR: number;
    priceL: number;
    image: string;
    descriptionS: string;
    descriptionL: string;
    };

    type MenuContextType = {
    items: MenuItem[];
    loading: boolean;
    refetch: () => Promise<void>;
    };

    const MenuContext = createContext<MenuContextType | null>(null);

    export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMenu = async () => {
        const { data, error } = await supabase
        .from("menu")
        .select("*")
        .order("type")
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

    const groupedItems = useMemo(() => {
        const map = new Map<string, MenuItem[]>();

        items.forEach((item) => {
        if (!map.has(item.type)) {
            map.set(item.type, []);
        }

        map.get(item.type)!.push(item);
        });

        return map;
    }, [items]);

    return (
        <MenuContext.Provider value={{ items, groupedItems, loading, refetch: fetchMenu }}>
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