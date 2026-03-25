'use client'

import React from "react";
import { useState, useEffect } from "react";
import MenuSection from "./MenuSection";
import { useMenu } from "@/context/MenuContext";

const Menu = ({ showAll }: any) => {
  const { groupedItems, categories, loading } = useMenu();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (categories.length && selectedCategory===null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  return (
    <div>
      <div>
        {showAll ? (
          <div className="flex flex-col min-h-screen">
            <div className="sticky z-50 top-[64px] bg-white flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollTo(`category-${category.id}`)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div></div>
            </div>
            <div>
              {categories.map((category) => {
                const items = groupedItems.get(category.id) || [];
                if (!items.length) return null;

                return (
                <div id={`category-${category.id}`} key={category.id}>
                  <MenuSection
                    type={category.name}
                    items={items}
                    showHeader={true}
                    isAdmin={false}
                  />
                </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between border-b-2 border-solid mb-[40px] py-[10px] px-[20px] md:px-[40px] lg:px-[96px]">
              <div className="text-[20px] flex gap-x-[40px]">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${selectedCategory === category.id && "font-semibold"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div></div>
            </div>
            <MenuSection
              type={
                categories.find((c) => c.id === selectedCategory)?.name || ""
              }
              items={groupedItems.get(selectedCategory!) || []}
              showHeader={false}
              isAdmin={false}
            />
          </div>

        )}
      </div>
    </div>
  );
};

export default Menu;
