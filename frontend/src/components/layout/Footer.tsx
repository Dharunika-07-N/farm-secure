import { Shield } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Risk Assessment", href: "/risk-assessment" },
    { label: "Training", href: "/training" },
    { label: "Alerts", href: "/alerts" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Best Practices", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Community", href: "#" },
    { label: "Status", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">BioSecure</span>
            </a>
            <p className="mb-4 max-w-sm text-muted-foreground">
              Empowering farmers with comprehensive biosecurity management tools for healthier livestock and sustainable farming.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BioSecure. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
