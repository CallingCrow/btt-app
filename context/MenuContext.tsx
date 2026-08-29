"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/supabase-client";

export type MenuItem = {
  id: string;
  name: string;
  category_id: string;
  price: number;
  image: string;
  descriptionS: string;
  descriptionL: string;
  menu_categories: {
    id: string;
    display_order: number;
    name: string;
  };
};

type MenuContextType = {
  items: MenuItem[];
  groupedItems: Map<string, MenuItem[]>;
  categories: { id: string; name: string }[];
  loading: boolean;
  refetch: () => Promise<void>;
};

const MenuContext = createContext<MenuContextType | null>(null);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from("menu")
      .select(
        `
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
      `,
      )
      .order("category_id")
      .order("name");

    console.log("Menu data:", data);

    if (error) {
      console.error("Error fetching menu:", error.message);
      setLoading(false);
      return;
    }

    // TODO: UPDATE IN FUTURE
    setItems((data as unknown as MenuItem[]) || []);
    setLoading(false);
  };

  // const fetchCategories = async () => {
  //   const { data, error } = await supabase
  //     .from("menu_categories")
  //     .select("*")
  //     .order("display_order");

  //   if (error) {
  //     console.error("Error fetching categories:", error.message);
  //     return;
  //   }

  //   setCategories(data || []);
  // };

  useEffect(() => {
    const loadMenu = async () => {
      const { data, error } = await supabase
        .from("menu")
        .select(
          `
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
        `,
        )
        .order("category_id")
        .order("name");

      console.log("Menu data:", data);

      if (error) {
        console.error("Error fetching menu:", error.message);
        setLoading(false);
        return;
      }

      setItems((data as unknown as MenuItem[]) || []);
      setLoading(false);
    };

    void loadMenu();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("menu_categories")
        .select("*")
        .order("display_order");

      if (error) {
        console.error("Error fetching categories:", error.message);
        return;
      }

      setCategories(data || []);
    };

    void loadCategories();
  }, []);

  const groupedItems = useMemo(() => {
    const map = new Map<string, MenuItem[]>();

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
