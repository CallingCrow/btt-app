"use client"

import React, { useEffect, useState, ChangeEvent } from 'react';
import { NavBar } from '@/components/NavBar';
import { Auth } from './auth/page';
import { supabase } from '../supabase-client';
import MenuSection from '@/components/MenuSection';
import { useMenu } from '@/context/MenuContext';
import './AdminPage.css';
import { useSupabaseUpload } from '@/hooks/useSupabaseUpload';

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

    const { groupedItems, refetch, loading } = useMenu();

    const [session, setSession] = useState(null);
    const [newItem, setNewItem] = useState<MenuItem>({
        name: "",
        type: "",
        priceR: 0,
        priceL: 0,
        image: "",
        descriptionS: "",
        descriptionL: ""
    });

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        setSession(currentSession.data.session);
    }

    useEffect(() => {
        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })

        return () => {
            authListener.subscription.unsubscribe();
        }
    }, []);

    const {
        file: menuImage,
        handleFileChange,
        uploadImage
    } = useSupabaseUpload("menu-images");

    if (loading) {
        return <div>Loading menu...</div>
    }



    const insertRow = async (table: string, item: any) => {
        const { error } = await supabase.from(table).insert(item).single();

        if (error) {
            console.error(`Error inserting into ${table}:`, error.message);
            return false;
        }

        return true;
    };

    const handleMenuSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const imageUrl = await uploadImage();

        const payload = {
            ...newItem,
            image: imageUrl || ""
        };

        const success = await insertRow("menu", payload);

        if (!success) {
            console.error("Error adding item.");
            return;
        }

        await refetch();

        setNewItem({ name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: "" })
    };

    { /* TO DO */ }
    const handleInfoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const imageUrl = await uploadImage();

        const payload = {
            ...newItem,
            image: imageUrl || ""
        };

        const success = await insertRow("menu", payload);

        if (!success) {
            console.error("Error adding item.");
            return;
        }

        await refetch();

        setNewItem({ name: "", type: "", priceR: 0, priceL: 0, image: "", descriptionS: "", descriptionL: "" })
    };



    const logout = async () => {
        await supabase.auth.signOut();
    }

    return (
        <>
            <header className="sticky z-50 top-0 bg-white">
                <NavBar />
            </header>
            {session ? (
                <div>
                    <main>
                        <div>
                            <div className="bg-gray-100 p-16">
                                <h5>Add Item</h5>
                                <form onSubmit={handleMenuSubmit}>
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
                                                setNewItem((prev) => ({ ...prev, priceR: e.target.value ? parseFloat(e.target.value) : 0 }))
                                            } />
                                        </div>
                                        <div>
                                            <label>Price Large Size</label>
                                            <input type="number" step="0.01" min="0" placeholder="large size price" value={newItem.priceL} onChange={(e) =>
                                                setNewItem((prev) => ({ ...prev, priceL: e.target.value ? parseFloat(e.target.value) : 0 }))
                                            } />
                                        </div>
                                        <div>
                                            <label>Image</label>
                                            <input type="file" accept='image/*' placeholder="image" onChange={(handleFileChange)} />
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
                                    <MenuSection key={type} type={type} items={items} showHeader={true} isAdmin={true} />
                                ))}
                            </div>
                        </div>
                            
                        { /* Info Sections */ }
                        <div>

                        </div>
                    </main>
                    <button onClick={logout} className="p-[0.5rem] bg-primary text-white">Log Out</button>
                </div>
            ) : (
                <Auth></Auth>
            )
            }
        </>

    )
}

export default AdminPage;