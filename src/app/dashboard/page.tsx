import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "../../components/commons/signout-button";


const Dashboard = async () => {
   const session = await auth.api.getSession({
      headers: await headers(),
   });

   //sign out
   async function signOut() {
      await auth.api.signOut({
         headers: await headers(),
      });
   }

   return (
      <main>
         <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
         <p className="mt-4">This is a simple starter template.</p>
         {session ? <p>Welcome back! {session.user.name}</p> : <p>Please sign in.</p>}
        <SignOutButton />
      </main>
   );
}

export default Dashboard;
