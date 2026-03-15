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
import { supabase } from "@/app/supabase-client";
import { useMenu } from "@/context/MenuContext";

interface EditModalProps {
    open: any,
    onOpenChange: any,
    id: number,
    name: string,
    type: string,
    priceR: number,
    priceL: number,
    image: string,
    descriptionS: string,
    descriptionL: string,
}

type MenuItem = {
    name: string;
    type: string;
    priceR: number;
    priceL: number;
    image: string;
    descriptionS: string;
    descriptionL: string;
};

export function EditModal({ open, onOpenChange, id, name, type, priceR, priceL, image, descriptionS, descriptionL }: EditModalProps) {
    const [newItem, setNewItem] = useState<MenuItem>({
        name,
        type,
        priceR,
        priceL,
        image,
        descriptionS,
        descriptionL
    });

    const deleteItem = async (id: number) => {
        const { error } = await supabase.from("menu").delete().eq("id", id);

        if (error) {
            console.error("Error deleting task: ", error.message);
            return;
        }
    }

    const updateItem = async (id: number) => {
        const { error } = await supabase.from("menu").update(newItem).eq("id", id);

        if (error) {
            console.error("Error editing item: ", error.message);
            return false;
        }

        return true;
    };

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
                        <DialogTitle>{newItem.name}</DialogTitle>
                        <DialogDescription className="">
                            <span className="text-[1.5rem]">
                                price
                            </span>
                            <br />
                            <span className="text-muted-foreground">
                                {newItem.descriptionL}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted px-[40px]">
                        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 py-4">
                            <h6>Edit Item</h6>

                            <form onSubmit={async (e) => { 
                                e.preventDefault(); 
                                const success = await updateItem(id); 
                                if (success) {
                                    onOpenChange(false);
                                }
                            }}
                                className="bg-white rounded-lg px-[20px] pb-[10px] mt-[10px]"
                            >
                                <div className="flex flex-wrap gap-x-16">
                                    <div>
                                        <label>Drink Name</label>
                                        <input type="text" placeholder="drink name" value={newItem.name} className="" onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, name: e.target.value }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Drink Type</label>
                                        <input type="text" placeholder="drink type" value={newItem.type} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, type: e.target.value }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Price Regular Size</label>
                                        <input type="number" step="0.01" min="0" placeholder="regular size price" value={newItem.priceR} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, priceR: parseFloat(e.target.value) }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Price Large Size</label>
                                        <input type="number" step="0.01" min="0" placeholder="large size price" value={newItem.priceL} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, priceL: parseFloat(e.target.value) }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Image</label>
                                        <input type="text" placeholder="image" value={newItem.image} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, image: e.target.value }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Short Description</label>
                                        <textarea placeholder='short description' value={newItem.descriptionS} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, descriptionS: e.target.value }))
                                        } />
                                    </div>
                                    <div>
                                        <label>Long Description</label>
                                        <textarea placeholder='long description' value={newItem.descriptionL} onChange={(e) =>
                                            setNewItem((prev) => ({ ...prev, descriptionL: e.target.value }))
                                        } />
                                    </div>
                                </div>
                                <button type="submit" className='bg-primary'>Edit Item</button>
                            </form>
                        </div>
                    </div>
                    <DialogFooter className="pb-4 pr-4 ml-[40px]">
                        <div className="flex justify-end w-full mt-4">
                            <DialogClose asChild>
                                <Button onClick={() => deleteItem(id)} variant={"destructive"}>Delete</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
