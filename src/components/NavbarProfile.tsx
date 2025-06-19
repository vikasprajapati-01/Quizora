'use client';

import React, { useState, useRef, useEffect } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

type Props = {
  user: Pick<User, 'name' | 'email' | 'image'>;
};

const NavbarProfile = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full border-2 border-[#ff7f01] bg-black/10 hover:bg-black/20 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
      >
        {user.image ? (
          <div className="relative h-full w-full overflow-hidden rounded-full">
            <img
              src={user.image}
              alt={user.name ?? "User"}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover ring-1 ring-[#ff7f01]/30"
            />
          </div>
        ) : (
          <div className="relative h-full w-full rounded-full bg-gradient-to-br from-[#ff7f01] to-[#ffb066] flex items-center justify-center text-white font-semibold text-xl sm:text-2xl">
            {user.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}
      </button>
      
      <div 
        className={`absolute right-0 sm:right-0 left-auto sm:left-auto z-10 mt-2 w-64 sm:w-72 origin-top-right rounded-xl bg-black/90 border-2 border-[#ff7f01]/40 shadow-2xl transition-all duration-300 ease-in-out transform overflow-hidden backdrop-blur-md
            ${open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
        >
          <div className="p-3 sm:p-5 border-b border-[#ff7f01]/20 bg-gradient-to-br from-black to-black/80">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-[#ff7f01]/30"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#ff7f01] to-[#ffb066] flex items-center justify-center text-white font-semibold text-xl sm:text-2xl">
                  {user.name?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm sm:text-base">{user.name ?? "User"}</div>
                <div className="text-xs sm:text-sm text-gray-400 truncate">{user.email ?? ""}</div>
              </div>
            </div>
          </div>
          
          <div className="p-1.5 sm:p-2">
            <Link href="/"
            //   className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-[#ff7f01]/10 rounded-lg flex items-center transition-colors duration-200 my-1"
                className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-[#ff7f01]/10 hover:text-white rounded-lg flex items-center transition-all duration-200 my-1 hover:translate-x-1"
              onClick={() => setOpen(false)}
            >
              <FaHome className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#ff7f01]" />
              Dashboard
            </Link>
            
            <Link href="/profile"
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-[#ff7f01]/10 hover:text-white rounded-lg flex items-center transition-all duration-200 my-1 hover:translate-x-1"
              onClick={() => setOpen(false)}
            >
              <FaUser className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#ff7f01]" />
              Profile
            </Link>
            
            <Link href="/settings"
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-300 hover:bg-[#ff7f01]/10 hover:text-white rounded-lg flex items-center transition-all duration-200 my-1 hover:translate-x-1"
              onClick={() => setOpen(false)}
            >
              <FaCog className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-[#ff7f01]" />
              Settings
            </Link>
          </div>
          
          <div className="border-t border-[#ff7f01]/20 mt-1" />
          
          <div className="p-2">
            <button
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg flex items-center transition-all duration-200 my-1 font-medium hover:translate-x-1"
              onClick={() => {
                signOut({ callbackUrl: "/" }).catch(console.error);
              }}
            >
              <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Sign out
            </button>
          </div>
        </div>
    </div>
  );
};

export default NavbarProfile;