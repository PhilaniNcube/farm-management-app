"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const clerk = useClerk();

  const AuthButtons = () => (
    <>
      <Authenticated>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Welcome back!</span>
          </div>
          <Button
            variant="outline"
            onClick={() => clerk.signOut()}
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="flex items-center gap-2">
            <Button variant="ghost" className="justify-start">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up" className="flex items-center gap-2">
            <Button className="justify-start">Sign Up</Button>
          </Link>
        </div>
      </Unauthenticated>
    </>
  );

  const MobileAuthButtons = () => (
    <div className="flex flex-col gap-3 pt-4 border-t">
      <SignedIn>
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
            <User className="h-4 w-4" />
            <span>Welcome back!</span>
          </div>
          <Button
            variant="outline"
            onClick={() => clerk.signOut()}
            className="flex items-center gap-2 justify-start bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in" className="flex items-center gap-2">
          <Button variant="ghost" className="justify-start">
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up" className="flex items-center gap-2">
          <Button className="justify-start">Sign Up</Button>
        </Link>
      </SignedOut>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-xl">Logo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link
            href="/services"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Services
          </Link>
          <Link
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[400px] px-4 py-10"
          >
            <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                href="/"
                className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Auth Buttons */}
              <MobileAuthButtons />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
