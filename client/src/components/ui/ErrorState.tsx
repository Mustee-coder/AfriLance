import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const ErrorState = ({
  title,
  description,
  action,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold text-red-900">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-red-600">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default ErrorState;
