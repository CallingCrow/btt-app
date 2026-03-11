import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card';

interface Props {
  name: string;
  descriptionS: string;
  priceR: number;
} 

const MenuCard = ({name, descriptionS, priceR}: Props) => {
  return (
    <Card className='py-0 pl-[15px] flex flex-row justify-between rounded-[10px] h-[140px]'>
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
  )
}

export default MenuCard;
