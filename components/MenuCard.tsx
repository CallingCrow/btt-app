import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { CustomizeModal } from './CustomizeModal';
import { EditModal } from './EditModal';
import { useState } from 'react';

interface MenuCardProps {
  id: string;
  name: string;
  category_id: string;
  price: number;
  image: string;
  descriptionS: string;
  descriptionL: string;
  isAdmin: boolean;
} 

const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(cents / 100);
};

const MenuCard = ({id, name, category_id, price, image, descriptionS, descriptionL, isAdmin}: MenuCardProps) => {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openModal = () => {
    if (isAdmin) {
      setIsEditModalOpen(true);
    }
    else {
      setIsCustomizeModalOpen(true);
    }
  }
  

  return (
    <div>
      <Card onClick={openModal} className='hover:-translate-y-1 py-0 pl-[1rem] flex flex-row justify-between rounded-[0.625rem] h-[8.75rem] cursor-pointer'>
          <div className='flex flex-col justify-between text-wrap w-full'>
              <CardHeader className='pt-[1.25rem] gap-y-[0.375rem]'>
                  <CardTitle className='!text-[1rem] line-clamp-2'>{name}</CardTitle>
                  <CardDescription className='!text-[0.875rem] line-clamp-2'>{descriptionS}</CardDescription>
              </CardHeader>
              <CardFooter className=''>
              <p className='pb-[1.25rem] text-[0.875rem]'>{formatCurrency(price)}</p>
              </CardFooter>
          </div>
          <CardContent className='px-0 w-full max-w-[10rem] h-auto flex justify-end'>
              {image===null || image==="" ? (
                <div></div>
              ) : (
                <img
                src={image}
                alt='Banner'
                className='size-full w-auto rounded-r-[0.625rem] object-contain'
                />
              )}

          </CardContent>
      </Card>
      <CustomizeModal open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen} id={id} name={name} price={price} image={image} descriptionL={descriptionL} />
      {/* <EditModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} id={id} name={name} price={price} image={image} descriptionS={descriptionS} descriptionL={descriptionL}></EditModal> */}
    </div>
  )
}

export default MenuCard;
