"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "전체", href: "/", color: "bg-blue-500" },
  { name: "가전/디지털", href: "/category/electronics", color: "bg-violet-500" },
  { name: "생활/가구", href: "/category/home", color: "bg-cyan-500" },
  { name: "뷰티", href: "/category/beauty", color: "bg-pink-500" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center overflow-hidden">
              <span className="text-white font-bold text-lg">T</span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white">
                테크리뷰
              </span>
              <span className="text-[10px] text-[var(--foreground-subtle)] tracking-widest uppercase">
                Tech Review
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="relative px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-white transition-colors duration-200 group"
              >
                <span className="relative z-10">{category.name}</span>
                <span className="absolute inset-0 rounded-lg bg-[var(--background-elevated)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:text-white transition-colors duration-200 group">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm">검색</span>
              <kbd className="hidden sm:inline-flex h-5 px-1.5 items-center gap-1 rounded bg-[var(--border-default)] text-[10px] font-medium text-[var(--foreground-subtle)]">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--background-elevated)] transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--background-secondary)]">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--foreground-muted)] hover:text-white hover:bg-[var(--background-elevated)] transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${category.color}`} />
                <span className="font-medium">{category.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
