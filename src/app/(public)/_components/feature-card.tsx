import { Card, CardContent } from "@/components/ui/card";

interface IProps {
   title: string;
   description: string;
   icon: string;
}

const FeatureCard = ({ title, description, icon }: IProps) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-2xl">
          <span aria-hidden>{icon}</span>
        </div>
         <h3 className="font-semibold text-lg">{title}</h3>
         <p className="mt-2 text-muted-foreground text-center">{description}</p>
      </CardContent>
    </Card>
  );
};
export default FeatureCard;
