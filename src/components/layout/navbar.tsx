"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-page border-b border-border shadow-card">
      <div className="max-w-page mx-auto px-lg">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-page font-bold text-sm">R</span>
            </div>
            <span className="ml-sm text-h2 font-semibold text-text">Recycly</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-lg">
            <a href="/" className="text-body text-text hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="/deposit" className="text-body text-text hover:text-primary transition-colors">
              Deposit
            </a>
            <a href="/rewards" className="text-body text-text hover:text-primary transition-colors">
              Rewards
            </a>
            <a href="/profile" className="text-body text-text hover:text-primary transition-colors">
              Profile
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-sm">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <a href="/" className="block px-3 py-2 text-body text-text hover:text-primary">
                Dashboard
              </a>
              <a href="/deposit" className="block px-3 py-2 text-body text-text hover:text-primary">
                Deposit
              </a>
              <a href="/rewards" className="block px-3 py-2 text-body text-text hover:text-primary">
                Rewards
              </a>
              <a href="/profile" className="block px-3 py-2 text-body text-text hover:text-primary">
                Profile
              </a>
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button size="sm" className="w-full bg-primary hover:bg-primary-dark">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
