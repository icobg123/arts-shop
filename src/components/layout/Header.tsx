"use client";

import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CartIcon from "@/components/cart/CartIcon";
import CartDropdown from "@/components/cart/CartDropdown";
import CartModal from "@/components/cart/CartModal";
import { getCategories, getCategoryUrl } from "@/lib/api/products";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const cartModalRef = useRef<HTMLDialogElement>(null);

  // Subscribe to cart changes to optionally auto-open dropdown
  // const totalItems = useCartStore((state) => state.totalItems);
  // const [prevTotalItems, setPrevTotalItems] = useState(0);

  /*// Auto-open dropdown when items are added to cart
  useEffect(() => {
    if (totalItems > prevTotalItems && totalItems > 0) {
      setIsCartOpen(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setIsCartOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);*/

  // Click-outside detection for cart dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isCartOpen]);

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-md">
      <nav className="navbar-compact navbar container mx-auto px-4">
        {/* Left: Logo/Brand + Mobile Menu Button */}
        <div className="navbar-start">
          <Link
            href="/"
            className="btn text-xl font-bold normal-case btn-ghost"
          >
            <span className="text-primary">ARTS</span>
            <span className="text-base-content">Shop</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="navbar-center hidden lg:flex"></div>

        {/* Right: Cart Icon + Theme Switcher */}
        <div className="navbar-end gap-2">
          {/* Theme Switcher */}
          <div className="sm:block">
            <ThemeSwitch />
          </div>

          {/* Cart with Dropdown (Desktop) / Modal (Mobile) */}
          <div className="relative" ref={cartDropdownRef}>
            <CartIcon
              onClick={() => {
                // Mobile: Open modal (< 640px)
                if (window.innerWidth < 640) {
                  cartModalRef.current?.showModal();
                } else {
                  // Desktop: Toggle dropdown
                  setIsCartOpen(!isCartOpen);
                }
              }}
              className=""
            />
            {/* Desktop Dropdown - Hidden on mobile */}
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-2 hidden sm:block">
                <CartDropdown onClose={() => setIsCartOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Cart Modal */}
      <CartModal ref={cartModalRef} />
    </header>
  );
}
