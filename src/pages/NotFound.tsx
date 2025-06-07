import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
