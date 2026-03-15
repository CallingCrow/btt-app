import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';
import { CustomizeModal } from './CustomizeModal';
import { EditModal } from './EditModal';
import { useState } from 'react';

interface MenuCardProps {
  id: number;
  name: string;
  type: string;
  priceR: number;
  priceL: number;
  image: string;
  descriptionS: string;
  descriptionL: string;
  isAdmin: boolean;
} 

const MenuCard = ({id, name, type, priceR, priceL, image, descriptionS, descriptionL, isAdmin}: MenuCardProps) => {
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
      <Card onClick={openModal} className='py-0 pl-[15px] flex flex-row justify-between rounded-[10px] h-[140px] cursor-pointer'>
          <div className='flex flex-col justify-between text-wrap w-full'>
              <CardHeader className='pt-[20px] gap-y-[6px]'>
                  <CardTitle className='!text-[16px] line-clamp-2'>{name}</CardTitle>
                  <CardDescription className='!text-[14px] line-clamp-2'>{descriptionS}</CardDescription>
              </CardHeader>
              <CardFooter className=''>
              <p className='pb-[20px] text-[14px]'>${priceR}</p>
              </CardFooter>
          </div>
          <CardContent className='px-0 max-w-[120px]'>
              <img
              src='https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png'
              alt='Banner'
              className='size-full rounded-r-[10px]'
              />
          </CardContent>
      </Card>
      <CustomizeModal open={isCustomizeModalOpen} onOpenChange={setIsCustomizeModalOpen} name={name} priceR={priceR} image={image} descriptionL={descriptionL} />
      <EditModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} id={id} name={name} type={type} priceR={priceR} priceL={priceL} image={image} descriptionS={descriptionS} descriptionL={descriptionL}></EditModal>
    </div>
  )
}

export default MenuCard;
