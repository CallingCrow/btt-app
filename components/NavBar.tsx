"use client";

import * as React from "react";
import Link from "next/link";
import Brand from "./Brand";
import { Button } from "./ui/button";
import CartIcon from "./CartIcon";
import HamburgerIcon from "./HamburgerIcon";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CartSidebar from "./cart/CartSidebar";

export function NavBar() {
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const openMenuModal = () => {
    setIsMenuModalOpen(true);
  };
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden flex justify-between items-center mx-[1.25rem] h-[3rem]">
        <Brand />
        <div className="flex gap-x-[0.5rem] items-center">
          <button onClick={openCartModal} className="cursor-pointer">
            <CartIcon w={28} h={28}></CartIcon>
          </button>
          <button onClick={openMenuModal} className="cursor-pointer">
            <HamburgerIcon w={28} h={28}></HamburgerIcon>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:mx-[2.5rem] lg:mx-[6rem] md:flex flex justify-between h-[3.5rem] items-center">
        <Brand />
        <div className="flex gap-x-[1.25rem] lg:gap-x-[1.875rem] text-[1.25rem]">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/menu" className="hover:text-primary">
            Menu
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </div>
        <div className="flex items-center gap-x-[0.625rem] lg:gap-x-[1.25rem]">
          <Button size="lg">Order Now</Button>
          <button onClick={openCartModal} className="cursor-pointer">
            <CartIcon w={28} h={28}></CartIcon>
          </button>
        </div>
      </div>

      <MenuModal
        open={isMenuModalOpen}
        onOpenChange={setIsMenuModalOpen}
      ></MenuModal>
      <CartSidebar
        open={isCartModalOpen}
        onOpenChange={setIsCartModalOpen}
      ></CartSidebar>
    </>
  );
}

interface MenuModalProps {
  open: any;
  onOpenChange: any;
}

export function MenuModal({ open, onOpenChange }: MenuModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full rounded-none">
        <div>
          <DialogHeader className="py-4 p-[1.25rem] items-start">
            <DialogTitle>Bubble Tea Time</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-y-[2.5rem] p-[1.25rem] mt-[1.25rem]">
            <Link href="/">
              <h4>Home</h4>
            </Link>
            <Link href="/menu">
              <h4>Menu</h4>
            </Link>
            <Link href="/about">
              <h4>About</h4>
            </Link>
            <Link href="/contact">
              <h4>Contact</h4>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
