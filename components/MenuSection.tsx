import MenuCard from "./MenuCard";

interface MenuSectionProps {
  category: string;
  showHeader: boolean;
}

{/* TO DO: ADD PROPS */}
const MenuSection = ({category, showHeader}: MenuSectionProps) => {
  return (
    <div className="mx-[20px] sm:mx-[96px] mb-[40px]">
      {showHeader && <h6 className="mb-[20px] font-semibold">{category}</h6>}
      <div className="gap-y-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[20px] gap-x-[40px]">
          <MenuCard />
          <MenuCard />
          <MenuCard />
          <MenuCard />
          <MenuCard />
          <MenuCard />
          <MenuCard />
        </div>
      </div>
    </div>
  )
}

export default MenuSection;