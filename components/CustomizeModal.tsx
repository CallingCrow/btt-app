import { Button } from "@/components/ui/button"
import { CirclePlus, CircleMinus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";

interface CustomizeModalProps {
    open: any,
    onOpenChange: any,
    name: string,
    priceR: number,
    image: string,
    descriptionL: string,
}

export function CustomizeModal({ open, onOpenChange, name, priceR, image, descriptionL }: CustomizeModalProps) {
    const [quantity, setQuantity] = useState(1);
    function handlePlus() {
        setQuantity(a => a + 1);
    }
    function handleMinus() {
        if (quantity > 1) {
            setQuantity(a => a - 1);
        }
    }

    const [price, setPrice] = useState(priceR)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="flex">
                <div>
                    {/* Image */}
                    <img
                    src='https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png'
                    alt='Banner'
                    className='size-full rounded-l-lg min-w-[200px]'
                    />
                </div>
                <div>
                    <DialogHeader className="py-4 ml-[40px]">
                        <DialogTitle><h5>{name}</h5></DialogTitle>
                        <DialogDescription>
                            <h5>
                                ${price}
                            </h5>
                            <p className="text-muted-foreground">
                                {descriptionL}
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-gray-300 px-[40px]">
                        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 py-4">
                            <h6>Customize your item</h6>
                            <CustomizeBlock title="Size" options={["this", "that"]} selectQuantity={1} isRequired={true}></CustomizeBlock>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <p key={index} className="mb-4 leading-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="pb-4 pr-4 ml-[40px]">
                        <div className="flex justify-between w-full mt-4">
                            <div className="flex gap-x-2">
                                <button onClick={handleMinus} className="cursor-pointer"><CircleMinus /></button>
                                <h5>{quantity}</h5>
                                <button onClick={handlePlus} className="cursor-pointer"><CirclePlus /></button>
                            </div>
                            
                            <DialogClose asChild>
                                <Button variant="default" size="md" className="px-10 cursor-pointer">Add to Cart</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface CustomizeBlockProps {
    title: string;
    options: string[]; //TO DO: options also needs to include price
    selectQuantity: number;
    isRequired: boolean;
}

const CustomizeBlock = ( {title, selectQuantity, options, isRequired}: CustomizeBlockProps ) => {
    return (
        <div className="bg-card px-[20px] py-[20px] rounded-lg">
            <div className="flex justify-between">
                <div>
                    <h6>{title}</h6>
                    <p className="text-muted">Select {selectQuantity}</p> {/* TO DO: MAKE GRAY */}
                </div>
                <div>
                    <p className="px-2 rounded-lg bg-primary !text-[0.75rem] text-white">Required</p>
                </div>
            </div>
            <div>
                {/*All the options*/}
            </div>
        </div>
    )
}