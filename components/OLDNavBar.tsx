"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavBar() {
  return (
    <div className="mx-[20px] md:mx-[96px] flex bg-red-300">
      <NavigationMenu className="max-w-full bg-blue-400">
        <NavigationMenuList className="w-full bg-red-400 flex justify-between">
          <div>
            <NavigationMenuItem>
              <div>
                Bubble Tea Time
              </div>
            </NavigationMenuItem>
          </div>
          <div className="flex gap-x-[20px]">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/menu">Menu</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/contact">Contact</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
          <div className="flex">
            <NavigationMenuItem>
              Order Now
            </NavigationMenuItem>
            <NavigationMenuItem>
              Cart
            </NavigationMenuItem>
          </div>

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

