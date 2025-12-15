import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Menu,
  Shield,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  HelpCircle,
  BellRing,
  Languages,
  Tractor,
  MapPin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "@/components/NavLink";
import { getCurrentUser, logout } from "@/services/auth.service";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Risk Assessment", href: "/risk-assessment" },
  { label: "Disease Map", href: "/disease-map" },
  { label: "Training", href: "/training" },
  { label: "Alerts", href: "/alerts" },
  { label: "Compliance", href: "/compliance" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">BioSecure</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeClassName="bg-accent text-foreground"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              3
            </span>
          </Button>


          <div className="hidden md:flex items-center gap-3 pl-2 border-l border-border/40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium leading-none">{user?.firstName || 'User'} {user?.lastName || ''}</span>
                    <span className="text-xs text-muted-foreground">{user?.role || 'Farmer'}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full bg-secondary/20 h-9 w-9 p-0 overflow-hidden">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`} alt="User" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Farm Details Summary */}
                {user?.farms && user.farms.length > 0 && (
                  <>
                    <div className="p-2">
                      <div className="rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Tractor className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">{user.farms[0].name}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground ml-6">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.farms[0].location}
                          </div>
                          <div>
                            {user.farms[0].size} {user.farms[0].sizeUnit} • Livestock Farm
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>View Full Profile</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile?tab=farm">
                      <Tractor className="mr-2 h-4 w-4" />
                      <span>Farm Settings</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile?tab=privacy">
                      <BellRing className="mr-2 h-4 w-4" />
                      <span>Notification Preferences</span>
                    </NavLink>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/help-support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
