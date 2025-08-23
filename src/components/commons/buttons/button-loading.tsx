import { cn } from "@/lib/utils";
import React from "react";

type ButtonLoadingProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
  className?: string;
};

const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
     
      type="button"
      disabled={loading || disabled}
      className={cn("inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground",className)}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoading;