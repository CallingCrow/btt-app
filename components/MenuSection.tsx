import MenuCard from "./MenuCard";

interface MenuItem {
  id: string;
  name: string;
  category_id: string;
  price: number;
  image: string;
  descriptionS: string;
  descriptionL: string;
  menu_categories: {
    id: string;
    name: string;
  };
}

interface MenuSectionProps {
  type: string;
  items: MenuItem[];
  showHeader: boolean;
  isAdmin: boolean
}

const MenuSection = ({type, items, showHeader, isAdmin}: MenuSectionProps) => {
  return (
    <div className="mx-[1.25rem] md:mx-[2.5rem] lg:mx-[6rem] mb-[2.5rem]">
      {showHeader && <h6 className="mb-[1.25rem] font-semibold">{type}</h6>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[1.25rem] gap-x-[2.5rem]">
        {items?.map((item, index) => (
          <MenuCard 
            key={index}
            id={item.id}
            name={item.name}
            category_id={item.category_id}
            price={item.price}
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