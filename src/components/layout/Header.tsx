"use client";

import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CartIcon from "@/components/cart/CartIcon";
import CartDropdown from "@/components/cart/CartDropdown";
import { getCategories } from "@/lib/api/products";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to cart changes to optionally auto-open dropdown
  const totalItems = useCartStore((state) => state.totalItems);
  const [prevTotalItems, setPrevTotalItems] = useState(0);

  useEffect(() => {
    // Fetch categories for navigation
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // Auto-open dropdown when items are added to cart
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
  }, [totalItems, prevTotalItems]);

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
      <nav className="navbar navbar-compact container mx-auto px-4">
        {/* Left: Logo/Brand + Mobile Menu Button */}
        <div className="navbar-start">
          <button
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold normal-case"
          >
            <span className="text-primary">ARTS</span>
            <span className="text-base-content">Shop</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {/* Home */}
            <li>
              <Link href="/">Home</Link>
            </li>

            {/* Products */}
            <li>
              <Link href="/products">Products</Link>
            </li>

            {/* Categories Dropdown */}
            <li>
              <details>
                <summary>
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </summary>
                <ul className="bg-base-100 p-2 w-52 shadow-lg">
                  <li>
                    <Link href="/products">All Products</Link>
                  </li>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category}>
                        <Link
                          href={`/products?category=${encodeURIComponent(category)}`}
                          className="capitalize"
                        >
                          {category.replace(/-/g, " ")}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="loading loading-spinner loading-xs"></span>
                    </li>
                  )}
                </ul>
              </details>
            </li>
          </ul>
        </div>

        {/* Right: Cart Icon + Theme Switcher */}
        <div className="navbar-end gap-2">
          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>

          {/* Cart with Dropdown */}
          <div className="relative" ref={cartDropdownRef}>
            <CartIcon
              onClick={() => setIsCartOpen(!isCartOpen)}
              className=""
            />
            {isCartOpen && (
              <div className="absolute right-0 top-full mt-2">
                <CartDropdown onClose={() => setIsCartOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-base-200 border-t border-base-300">
          <ul className="menu menu-compact p-4">
            <li>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <details>
                <summary>Categories</summary>
                <ul>
                  <li>
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/products?category=${encodeURIComponent(category)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="capitalize"
                      >
                        {category.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li className="sm:hidden mt-4 border-t border-base-300 pt-4">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <ThemeSwitch />
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
