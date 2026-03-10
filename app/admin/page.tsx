"use client"

import React from 'react';
import { NavBar } from '@/components/NavBar';
import { useState } from 'react';
import { supabase } from '../supabase-client';

const AdminPage = () => {
    const [newItem, setNewItem] = useState({ name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: "" });

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const {error} = await supabase.from("menu").insert(newItem).single();

        if (error) {
            console.error("Error adding item: ", error.message);
        }

        setNewItem({name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: ""})
    };

    return (
        <div>
            <header className="sticky z-50 top-0 bg-white">
                <NavBar />
            </header>
            <main>
                <div>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="drink name" onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, name: e.target.value }))
                        } />
                        <input type="text" placeholder="drink type" onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, type: e.target.value }))
                        } />
                        <input type="number" placeholder="regular size price" onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, priceR: e.target.value }))
                        } />
                        <input type="number" placeholder="large size price" onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, priceL: e.target.value }))
                        } />
                        <input type="text" placeholder="image" onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, image: e.target.value }))
                        } />
                        <textarea placeholder='short description' onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, descriptionS: e.target.value }))
                        } />
                        <textarea placeholder='long description' onChange={(e) =>
                            setNewItem((prev) => ({ ...prev, descriptionL: e.target.value }))
                        } />
                        <button type="submit" className='bg-blue-200'>Add Item</button>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default AdminPage;