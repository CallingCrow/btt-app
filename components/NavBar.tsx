"use client"

import * as React from "react"
import Link from "next/link"
import Brand from "./Brand"
import { Button } from "./ui/button"
import CartIcon from "./CartIcon"
import HamburgerIcon from "./HamburgerIcon"


export function NavBar() {

  return (
      <>
        {/* Mobile Layout */}
        <div className="md:hidden flex justify-between items-center mx-[20px] h-[48px]">
          <Brand />
          <div className="flex gap-x-[20px]">
            <CartIcon w={28} h={28}></CartIcon>
            <HamburgerIcon w={28} h={28}></HamburgerIcon>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:mx-[40px] lg:mx-[96px] md:flex flex justify-between h-[64px] items-center">
          <Brand />
          <div className="flex gap-x-[20px] lg:gap-x-[30px] text-[20px]">
            <Link href="/">Home</Link>
            <Link href="/menu">Menu</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="flex items-center gap-x-[10px] lg:gap-x-[20px]">
            <Button size="lg">Order Now</Button>
            <CartIcon w={28} h={28}></CartIcon>
          </div>
        </div>
      </>
    )
};

