import * as React from "react";
import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
  image?: string | null;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar: React.FC<AvatarProps> = ({ 
  image, 
  name, 
  className, 
  size = "md" 
}) => {
  // Generate initials from name
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <ShadcnAvatar className={cn(sizeClasses[size], className)}>
      {image && (
        <AvatarImage 
          src={image} 
          alt={name}
          className="object-cover"
        />
      )}
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(name)}
      </AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;