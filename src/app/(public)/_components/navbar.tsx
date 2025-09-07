import UserDropdown from "@/components/commons/misc/user-dropdown";
import ThemeToggle from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/model/constants/router";

const navItems = [
   {
      name: "Home",
      href: ROUTES.HOME,
   },
   {
      name: "Courses",
      href: ROUTES.COURSES,
   },
   {
      name: "Dashboard",
      href: ROUTES.DASHBOARD
   },
];

const Navbar = async () => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });


   return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60  w-full">
         <div className="container flex min-h-16 items-center justify-between px-4 md:px-6 lg:px-8">
            <Link href="/" className="flex flex-row items-center spac-x-2 mr-4">
               <Image
                  src={"images/lms-logo.svg"}
                  alt="logo"
                  height={10}
                  width={10}
                  className="size-9"
               />
               <h1 className="font-bold text-xl">E-Learning</h1>
            </Link>

            {/* Desktop navigation */}
            <nav>
               <div className="flex flex-row gap-2">
                  {navItems.map((item) => (
                     <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-medium transition-colors hover:text-primary px-4 py-2"
                     >
                        {item.name}
                     </Link>
                  ))}
               </div>
            </nav>

            <div className="flex flex-row items-center gap-2">
               <ThemeToggle />
               {session?.user ? (
                  <UserDropdown 
                     user={{
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image || null,
                        isAdmin: session.user.role === "admin" ? true : false,
                     }}
                  />
                  ) : (<Link className={buttonVariants({ variant: "outline" })} href={ROUTES.AUTH_SIGN_IN}>Sign In</Link>)}
            </div>
         </div>
      </header>
   );
};
export default Navbar;
