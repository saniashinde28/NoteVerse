import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SearchBar } from "../index";
import { Sun, Moon, PenSquare } from "lucide-react";
import useTheme from "@/context/ThemeContext";
import { Container, Logo, LogoutBtn } from "../index";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {
  const authStatus = useSelector((state) => state.status);
  const userData = useSelector((state) => state.userData);
  const profile = useSelector((state) => state.profile);

  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container>
        <nav className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <Logo width="40px" />

            <span className="text-xl font-bold text-foreground">
              SnapBlog
            </span>
          </Link>

          {/* Center Navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.slug)}
                    >
                      {item.name}
                    </Button>
                  </li>
                )
            )}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Search */}
            <SearchBar />

            {/* Add Post */}
            {authStatus && (
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => navigate("/add-post")}
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Write
              </Button>
            )}

            {/* Avatar */}
            {authStatus && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>
                      {(profile?.name || userData?.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      if (profile) {
                        navigate(`/profile/${profile.username}`);
                      }
                    }}
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <LogoutBtn />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;