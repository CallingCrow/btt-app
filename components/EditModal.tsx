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

export function EditModal({ open, onOpenChange, id, name, type, priceR, priceL, image, descriptionL }: EditModalProps) {
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
            return;
        }
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
                        <DialogTitle>{name}</DialogTitle>
                        <DialogDescription>
                            <h5>
                                price
                            </h5>
                            <p className="text-muted-foreground">
                                {descriptionL}
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-gray-300 px-[40px]">
                        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4 py-4">
                            <h6>Edit Item</h6>

                            <form onSubmit={(e) => { e.preventDefault; updateItem(id); }}>
                                <div className="flex flex-wrap gap-x-20">
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
                                <button type="submit" className='bg-primary'>Add Item</button>
                            </form>
                        </div>
                    </div>
                    <DialogFooter className="pb-4 pr-4 ml-[40px]">
                        <div className="flex justify-between w-full mt-4">
                            <Button onClick={() => deleteItem(id)}>Delete</Button>

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
