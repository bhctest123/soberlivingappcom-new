import * as React from "react";
// Using custom menu icon instead of lucide-react
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navigationItems, mobileNavigationItems, type NavItem } from "@/data/navigation";
import { features } from "@/data/features";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps = {}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (itemTitle: string) => {
    setActiveDropdown(activeDropdown === itemTitle ? null : itemTitle);
  };

  const handleDropdownEnter = (itemTitle: string) => {
    if (!activeDropdown) {
      setActiveDropdown(itemTitle);
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-[200] w-full border-b bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm",
      className
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <span className="relative font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sober Living App
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
          <nav className="flex items-center space-x-1 static">
            {navigationItems.map((item) => (
              <div key={item.title} className="relative">
                {item.children ? (
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1",
                        activeDropdown === item.title 
                          ? "text-blue-600 bg-blue-50 shadow-sm" 
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                      onClick={() => handleDropdownToggle(item.title)}
                      onMouseEnter={() => handleDropdownEnter(item.title)}
                    >
                      {item.title}
                      <img 
                        src="/images/icons/chevron.png" 
                        alt="Dropdown arrow" 
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeDropdown === item.title && "rotate-180"
                        )}
                      />
                    </button>
                    {/* Enhanced Dropdown Menu */}
                    <div 
                      ref={dropdownRef}
                      className={cn(
                        "fixed top-[4rem] bg-white border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 overflow-hidden",
                        "w-[1200px] max-w-[95vw]",
                        "left-1/2 -translate-x-1/2",
                        "mx-auto",
                        activeDropdown === item.title ? "opacity-100 visible z-[500] scale-100" : "opacity-0 invisible pointer-events-none scale-95"
                      )}
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Features</h2>
                        <p className="text-xs text-gray-600">Comprehensive tools for managing your sober living operations</p>
                      </div>
                      
                      {/* Content Grid - 2 rows of 4 categories */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {item.children.map((child) => {
                          return (
                            <div key={child.title} className="group relative">
                              {/* Category Header */}
                              <div className="mb-3 p-2 rounded-lg bg-gray-50">
                                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{child.title}</h3>
                                <p className="text-xs text-gray-600 leading-tight">{child.description}</p>
                              </div>
                              
                              {/* Feature Links */}
                              <div className="space-y-1">
                                {child.children?.slice(0, 5).map((subChild) => {
                                  // Find matching feature icon - match by href path
                                  const featureId = subChild.href?.split('/').pop(); // Extract feature id from href
                                  const feature = features.find(f => f.id === featureId || f.name === subChild.title);
                                  const featureIcon = feature?.iconPath || "/images/icons/ic_sober_living_app.png";
                                  
                                  return (
                                    <a
                                      key={subChild.title}
                                      href={subChild.href || "#"}
                                      className="group/item flex items-center gap-3 p-2 rounded-md text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <img src={featureIcon} alt={subChild.title} className="w-8 h-8 flex-shrink-0" />
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-900 group-hover/item:text-blue-600 transition-colors text-sm">{subChild.title}</span>
                                        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{subChild.description}</p>
                                      </div>
                                    </a>
                                  );
                                })}
                                {child.children && child.children.length > 5 && (
                                  <a
                                    href={`/features#${child.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="group/item flex items-center gap-3 p-2 rounded-md text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border-t border-gray-100 mt-2 pt-2"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <img src="/images/icons/more_horizontal.png" alt="More" className="w-6 h-6 flex-shrink-0" />
                                    <span className="font-medium text-xs">View all {child.children.length} features</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Footer CTA */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-center sm:text-left">
                            <h3 className="text-white font-semibold text-base mb-0.5">Ready to streamline your operations?</h3>
                            <p className="text-blue-100 text-xs">Join thousands of recovery facilities using our platform</p>
                          </div>
                          <div className="flex gap-2">
                            <a
                              href="/features"
                              className="px-3 py-2 bg-white/10 text-white text-xs font-medium rounded-md hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                              onClick={() => setActiveDropdown(null)}
                            >
                              View All Features
                            </a>
                            <a
                              href="/signup"
                              className="px-3 py-2 bg-white text-blue-600 text-xs font-medium rounded-md hover:bg-gray-100 transition-colors shadow-md"
                              onClick={() => setActiveDropdown(null)}
                            >
                              Start Free Trial
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <a
                    href={item.href || "#"}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {item.title}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/login">Log In</a>
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md" 
            asChild
          >
            <a href="/signup">Get Started</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <img src="/images/icons/menu.png" alt="Menu" className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
                    Sober Living App
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col space-y-4">
                {mobileNavigationItems.map((item) => (
                  <MobileNavItem key={item.title} item={item} setIsOpen={setIsOpen} />
                ))}
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/login" onClick={() => setIsOpen(false)}>
                      Log In
                    </a>
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" 
                    asChild
                  >
                    <a href="/signup" onClick={() => setIsOpen(false)}>
                      Get Started
                    </a>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MobileNavItem({ 
  item, 
  setIsOpen 
}: { 
  item: NavItem; 
  setIsOpen: (open: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between py-2 text-base font-medium transition-colors hover:text-primary"
        >
          {item.title}
          <img 
            src="/images/icons/chevron.png" 
            alt="Expand arrow" 
            className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        {isExpanded && (
          <div className="ml-4 mt-2 space-y-2">
            {item.children.map((child) => (
              <div key={child.title}>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {child.title}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {child.description}
                </div>
                {child.children && (
                  <div className="ml-2 space-y-1">
                    {child.children.map((subChild) => (
                      <a
                        key={subChild.title}
                        href={subChild.href || "#"}
                        onClick={() => setIsOpen(false)}
                        className="block py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {subChild.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <a
      href={item.href || "#"}
      onClick={() => setIsOpen(false)}
      className="py-2 text-base font-medium transition-colors hover:text-primary"
    >
      {item.title}
    </a>
  );
}

export default Navigation;