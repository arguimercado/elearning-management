import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import FeatureCard from "./_components/feature-card";
import SignOutButton from "../../components/commons/signout-button";

interface FeatureProps {
   title: string;
   description: string;
   icon: string;
}

const features: FeatureProps[] = [
   {
      title: "Comprehensive Courses",
      description:
         "Access a wide range carefully crafted courses designed by the industry experts.",
      icon: "📚",
   },
   {
      title: "Interactive Learning",
      description:
         "Engage with interactive content, quizzes and assignments to enhance your learning experience",
      icon: "🧩",
   },
   {
      title: "Flexible Schedule",
      description:
         "Learn at your own pace with flexible scheduling options that fit your lifestyle.",
      icon: "🕒",
   },
   {
      title: "Progress Tracking",
      description:
         "Monitor your progress with detailed analytics and insights to stay on track.",
      icon: "📈",
   }
];

const Home = () => {
   return (
      <>
         <section className="py-20">
            <div className="container mx-auto px-4">
               <div className="flex justify-center">
                  <div className="flex flex-col items-center text-center gap-6 py-8">
                     <Badge variant={"outline"}>
                        Future of Online Education
                     </Badge>
                     <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Elevate your Learning Experience
                     </h1>
                     <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        Discover a new way to learn with our modern, interactive
                        learning management system. Access high-quality courses
                        anytime, anywhere.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Link
                           className={buttonVariants({
                              size: "lg",
                           })}
                           href="/courses"
                        >
                           Explore Courses
                        </Link>
                        <Link
                           className={buttonVariants({
                              size: "lg",
                              variant: "outline",
                           })}
                           href="/sign-in"
                        >
                           Sign in
                        </Link>
                           
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <section className="py-12">
            <div className="container mx-auto px-4">
               <h2 className="text-2xl font-semibold mb-6 text-center">
                  Platform features
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((f, idx) => (
                    <FeatureCard {...f} key={idx} />
                  ))}
               </div>
            </div>
         </section>
      </>
   );
};
export default Home;
