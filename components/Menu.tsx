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
            <div className="sticky z-50 top-[4rem] bg-white flex justify-between text-nowrap overflow-x-auto border-b-2 border-solid mb-[2.5rem] py-[0.625rem] px-[1.25rem] md:px-[2.5rem] lg:px-[6rem]">
              <h6 className="flex gap-x-[2.5rem]">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollTo(`category-${category.id}`)}
                  >
                    {category.name}
                  </button>
                ))}
              </h6>
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
            <div className="flex justify-between text-nowrap overflow-x-auto border-b-2 border-solid mb-[2.5rem] py-[0.625rem] px-[1.25rem] md:px-[2.5rem] lg:px-[6rem]">
              <h6 className="flex gap-x-[2.5rem]">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${selectedCategory === category.id && "font-semibold"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </h6>
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
