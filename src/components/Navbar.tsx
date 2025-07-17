
// import { useSession } from "next-auth/react";
import { getAuthSession } from "@/lib/next-auth";
import Link from "next/link";
import Login from "./Login";
import NavbarProfile from "./NavbarProfile";
// import Darkmode from "@/helpers/Darkmode";

const Navbar = async () => {
  const session = await getAuthSession();
  // console.log("Session in Navbar:", session);

  return (
    <div className="fixed inset-x-0 top-0 z-[10] bg-white dark:bg-black h-fit border-b border-[#ff7f01] py-2 sm:py-3 shadow-md">
      <div className="flex items-center justify-between h-full gap-2 mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-[#ff7f01] px-2 sm:px-3 py-1 sm:py-1.5 text-lg sm:text-xl font-bold text-[#ff7f01] transition-all hover:scale-105 hover:shadow-[#ff7f01]/20 hover:shadow-lg duration-300">
            Quizora
          </p>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* <div className="flex items-center justify-center">
            <Darkmode />
          </div> */}
          
          {session?.user ? (
            <NavbarProfile user={session.user} />
          ) : (
            <Login text="Login" showIcon={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;