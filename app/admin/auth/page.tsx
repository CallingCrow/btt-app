import { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@/app/supabase-client";

export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError) {
            console.error("Error signing up:", signInError.message);
            return;
        }
    }

    return (
        <div className="bg-secondary min-h-[100vh]">
        <div className="min-w-[400px] m-auto p-[2.5rem] rounded-lg bg-white items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <form onSubmit={handleSubmit} className="flex flex-col -gap-y-2">
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                        }
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="p-[0.5rem] bg-primary text-white"
                    >
                        Log In
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};