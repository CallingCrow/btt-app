import { NavBar } from "@/components/NavBar";
import Menu from "@/components/Menu";
import React from "react";

const MenuPage = () => {
  return (
    <div>
      <header className="sticky z-50 top-0 bg-white">
        <NavBar />
      </header>
      <main>
        <div>
          <Menu showAll={true} />
        </div>
      </main>
    </div>
  );
};

export default MenuPage;
