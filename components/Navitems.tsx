"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavItems = [
    { label: "Home", href: "/" },
    { label: "Companions", href: "/companions" },
    { label: "My Journey", href: "/my-journey" },
]

const Navitems = () => {
    //to highlight the active link - target the current path from url
    const pathName = usePathname();
  return (
    <nav className="flex gap-4 items-center">
        {NavItems.map(({label, href}) => (
            <Link key={label} href={href} className={cn(pathName=== href ? "text-primary font-semibold" : "text-gray-600 hover:text-primary font-medium", "text-lg")}>
                {label}
            </Link>
        ))}
    </nav>
  )
}

export default Navitems
