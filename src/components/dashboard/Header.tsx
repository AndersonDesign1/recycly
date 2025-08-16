"use client";

import { useState } from "react";
import { Menu, Bell, Search, User, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu and search */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search bar */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500">
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 p-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="bg-forest-green-100 text-forest-green-600">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
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
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.role === "USER" && (
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
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
