import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Loader2
        className="h-8 w-8 animate-spin"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
