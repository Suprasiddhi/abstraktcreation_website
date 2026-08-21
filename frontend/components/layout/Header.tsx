import React from "react";
import Button from "../ui/Button";

export default function Header() {
  const navLinks = [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Work", href: "#work" },
    { label: "Studio", href: "#studio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="w-full py-5 px-6 md:px-12 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-xl md:text-2xl font-black tracking-tight text-foreground transition-opacity hover:opacity-80"
          style={{ fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 900 }}
        >
          ABSTRAKT
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15px] text-neutral-500 hover:text-foreground font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div>
          <a href="#contact">
            <Button variant="primary">
              Start a project
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
