"use client";

import { Bell, Menu, Search, Settings, User } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  level: number;
}

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
  onNotificationsClick: () => void;
}

export function Header({
  user,
  onMenuClick,
  onNotificationsClick,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-600 text-white";
      case "ADMIN":
        return "bg-purple-600 text-white";
      case "WASTE_MANAGER":
        return "bg-blue-600 text-white";
      case "USER":
        return "bg-forest-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "WASTE_MANAGER":
        return "Waste Manager";
      case "USER":
        return "Recycler";
      default:
        return role;
    }
  };

  return (
    <header className="border-gray-200 border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            className="lg:hidden"
            onClick={onMenuClick}
            size="sm"
            variant="ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search bar */}
          <div className="hidden items-center space-x-2 md:flex">
            <div className="relative">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
              <Input
                className="w-64 border-gray-200 bg-gray-50 pl-10"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                type="text"
                value={searchQuery}
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            className="relative"
            onClick={onNotificationsClick}
            size="sm"
            variant="ghost"
          >
            <Bell className="h-5 w-5" />
            <Badge className="-top-1 -right-1 absolute h-5 w-5 bg-red-500 p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex items-center space-x-2 p-2"
                variant="ghost"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={user.name} src="" />
                  <AvatarFallback className="bg-forest-green-100 text-forest-green-600">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="font-medium text-gray-900 text-sm">
                    {user.name}
                  </p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  {user.role === "USER" && (
                    <Badge variant="outline">Level {user.level}</Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.role === "USER" && (
                <DropdownMenuItem>
                  <div className="flex w-full items-center justify-between">
                    <span>Points</span>
                    <span className="font-semibold text-forest-green-600">
                      {user.points.toLocaleString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
