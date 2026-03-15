import MenuCard from "./MenuCard";

interface MenuItem {
  id: number;
  name: string;
  type: string;
  priceR: number;
  priceL: number;
  image: string;
  descriptionS: string;
  descriptionL: string;
}

interface MenuSectionProps {
  type: string;
  items: MenuItem[];
  showHeader: boolean;
  isAdmin: boolean
}

const MenuSection = ({type, items, showHeader, isAdmin}: MenuSectionProps) => {
  return (
    <div className="mx-[20px] md:mx-[40px] lg:mx-[96px] mb-[40px]">
      {showHeader && <h6 className="mb-[20px] font-semibold">{type}</h6>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[20px] gap-x-[40px]">
        {items?.map((item, index) => (
          <MenuCard 
            key={index}
            id={item.id}
            name={item.name}
            type={item.type}
            priceR={item.priceR}
            priceL={item.priceL}
            image={item.image}
            descriptionS={item.descriptionS}
            descriptionL={item.descriptionL}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default MenuSection;