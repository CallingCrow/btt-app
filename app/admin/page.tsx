"use client"

import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { useState } from 'react';
import { supabase } from '../supabase-client';
import MenuSection from '@/components/MenuSection';
import { useMenu } from '@/context/MenuContext';
import './AdminPage.css';

type MenuItem = {
    name: string;
    type: string;
    priceR: number;
    priceL: number;
    image: string;
    descriptionS: string;
    descriptionL: string;
};

const AdminPage = () => {

    const {groupedItems, refetch, loading} = useMenu();

    const [newItem, setNewItem] = useState<MenuItem>({
        name: "",
        type: "",
        priceR: 0,
        priceL: 0,
        image: "",
        descriptionS: "",
        descriptionL: ""
    });

    if (loading) {
        return <div>Loading menu...</div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { error } = await supabase.from("menu").insert(newItem).single();

        if (error) {
            console.error("Error adding item: ", error.message);
            return;
        }

        await refetch();
        setNewItem({ name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: "" })
    };

    return (
        <div>
            <header className="sticky z-50 top-0 bg-white">
                <NavBar />
            </header>
            <main>
                <div>
                    <div className="bg-gray-100 p-16">
                        <h5>Add Item</h5>
                        <form onSubmit={handleSubmit}>
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

                    <div>
                        {[...groupedItems.entries()].map(([type, items]) => (
                            <MenuSection key={type} type={type} items={items} showHeader={true} isAdmin={true}/>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminPage;