"use client"

import React, { useEffect } from 'react';
import { NavBar } from '@/components/NavBar';
import { useState } from 'react';
import { supabase } from '../supabase-client';
import MenuCard from '@/components/MenuCard';
import MenuSection from '@/components/MenuSection';

const AdminPage = () => {
    type MenuItem = {
        name: string;
        type: string;
        priceR: number;
        priceL: number;
        image: string;
        descriptionS: string;
        descriptionL: string;
        };

    const [newItem, setNewItem] = useState<MenuItem>({
        name: "",
        type: "",
        priceR: 0,
        priceL: 0,
        image: "",
        descriptionS: "",
        descriptionL: ""
    });

    const [items, setItems] = useState<MenuItem[]>([]);

    const groupedItems = new Map<string, MenuItem[]>();

    items.forEach((item) => {
        if (!groupedItems.has(item.type)) {
            groupedItems.set(item.type, []);
        }

        groupedItems.get(item.type)!.push(item);
    })

    const fetchItems = async () => {
        const {error, data} = await supabase.from("menu").select("*").order("type");
        
        if (error) {
            console.error("Error reading item: ", error.message);
            return;
        }

        setItems(data);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {error} = await supabase.from("menu").insert(newItem).single();

        if (error) {
            console.error("Error adding item: ", error.message);
            return;
        }

        await fetchItems();
        setNewItem({name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: ""})
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <div>
            <header className="sticky z-50 top-0 bg-white">
                <NavBar />
            </header>
            <main>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="drink name" value={newItem.name} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, name: e.target.value }))
                        } />
                        <input type="text" placeholder="drink type" value={newItem.type} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, type: e.target.value }))
                        } />
                        <input type="number" step="0.01" min="0" placeholder="regular size price" value={newItem.priceR} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, priceR: parseFloat(e.target.value) }))
                        } />
                        <input type="number" step="0.01" min="0" placeholder="large size price"  value={newItem.priceL} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, priceL: parseFloat(e.target.value) }))
                        } />
                        <input type="text" placeholder="image" value={newItem.image} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, image: e.target.value }))
                        } />
                        <textarea placeholder='short description' value={newItem.descriptionS} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, descriptionS: e.target.value }))
                        } />
                        <textarea placeholder='long description' value={newItem.descriptionL} onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, descriptionL: e.target.value }))
                        } />
                        <button type="submit" className='bg-blue-200'>Add Item</button>
                    </form>

                    <div>
                        {[...groupedItems.entries()].map(([type, items]) => (
                             <MenuSection key={type} type={type} items={items} showHeader={true} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminPage;