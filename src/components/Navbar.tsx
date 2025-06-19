// import React from "react";
// import Link from "next/link";

// import { getAuthSession } from "@/lib/next-auth";
// import Login from "./Login";
// import NavbarProfile from "./NavbarProfile";

// const Navbar = async () => {

//     const session = await getAuthSession();
//     console.log("Session in Navbar:", session);

//   return (
//     <div className="fixed inset-x-0 top-0 z-[10] bg-black h-fit border-b border-[#ff7f01] py-2">
//         <div className="flex items-center justify-between h-full gap-2 mx-auto px-8 max-w-7xl">

//             <Link href={'/'} className="flex items-center gap-2">
//                 <p className="rounded-lg border-2 border-b-4 border-r-4 border-[#ff7f01] px-2 py-1 text-xl font-bold text-[#ff7f01] transition-all hover:scale-110 duration-300 md:block">
//                     Quizora
//                 </p>
//             </Link>

//             <div className="flex items-center">
//                 {
//                     session?.user ? (
//                         <NavbarProfile user={session.user} />
//                     ) : (
//                         <Login text="Login" />
//                     )
//                 }
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Navbar;


import React from "react";
import Link from "next/link";

import { getAuthSession } from "@/lib/next-auth";
import Login from "./Login";
import NavbarProfile from "./NavbarProfile";
import Darkmode from "@/helpers/Darkmode";

const Navbar = async () => {
  const session = await getAuthSession();
  console.log("Session in Navbar:", session);

  return (
    <div className="fixed inset-x-0 top-0 z-[10] bg-black h-fit border-b border-[#ff7f01] py-3 shadow-md">
      <div className="flex items-center justify-between h-full gap-2 mx-auto px-8 max-w-7xl">
        <Link href={'/'} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-[#ff7f01] px-3 py-1.5 text-xl font-bold text-[#ff7f01] transition-all hover:scale-105 hover:shadow-[#ff7f01]/20 hover:shadow-lg duration-300 md:block">
            Quizora
          </p>
        </Link>

        <div className="flex items-center">
            <Darkmode />
          {session?.user ? (
            <NavbarProfile user={session.user} />
          ) : (
            <Login text="Login" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;