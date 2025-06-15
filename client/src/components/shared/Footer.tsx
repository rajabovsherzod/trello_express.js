import { forwardRef } from "react";
import {
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  Send, // for Telegram
} from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = forwardRef<HTMLDivElement>((_props, ref) => {
  const socialLinks = [
    {
      href: "https://instagram.com/sherzod.21",
      icon: <Instagram className="h-5 w-5" />,
    },
    { href: "https://twitter.com/radjabov_sherzod", icon: <Twitter className="h-5 w-5" /> },
    { href: "https://www.linkedin.com/in/sherzod-rajabov-58a332249/", icon: <Linkedin className="h-5 w-5" /> },
    { href: "https://www.facebook.com/profile.php?id=100078347824638", icon: <Facebook className="h-5 w-5" /> },
    { href: "https://t.me/rajabov_sherzod", icon: <Send className="h-5 w-5" /> },
    { href: "https://github.com/rajabovsherzod", icon: <Github className="h-5 w-5" /> },
  ];

  return (
    <footer
      ref={ref}
      className={cn(
        "w-full bg-background/80 backdrop-blur-sm border-t border-border",
        "py-4 px-6 md:px-8 z-20 flex-shrink-0"
      )}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <a
            href="https://github.com/rajabovsherzod"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Radjabov
          </a>
        </p>
        <div className="flex items-center gap-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

// Forcing git to recognize changes
export { Footer };
