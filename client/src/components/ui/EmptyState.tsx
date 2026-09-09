import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-3">
        <Inbox className="h-6 w-6 text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-500">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
