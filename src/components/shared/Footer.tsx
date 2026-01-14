import React from "react";

import Link from "next/link";
import { josefin } from "@/fonts/fonts";
import {
  IconBrandFacebook,
  IconBrandX,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { label: "Home", href: "/reader/home" },
      { label: "Browse Books", href: "/reader/browse-books" },
      { label: "My Library", href: "/reader/my-library" },
      { label: "Tutorials", href: "/reader/tutorials" },
    ],
    resources: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Support", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  const socialLinks = [
    {
      icon: IconBrandFacebook,
      href: "https://facebook.com",
      label: "Facebook",
    },
    { icon: IconBrandX, href: "https://x.com", label: "X" },
    {
      icon: IconBrandInstagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: IconBrandLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-muted border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link
              href="/reader/home"
              className={`text-2xl font-bold text-primary ${josefin.className}`}
            >
              BookWorm
            </Link>
            <p className="text-sm text-muted-foreground">
              Your digital library for discovering and enjoying great books.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} BookWorm. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
