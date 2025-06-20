// client/src/components/shared/ErrorBoundary.tsx
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError() as any;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                    {error.status === 404 ? '404 - Page Not Found' : 'Oops! Something went wrong'}
                </h1>
                <p className="text-muted-foreground">
                    {error.status === 404 
                        ? "The page you're looking for doesn't exist."
                        : "We're sorry, but something went wrong."}
                </p>
                <div className="space-x-4">
                    <Link 
                        to="/"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                    >
                        Go Home
                    </Link>
                    <Link 
                        to="/dashboard"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorBoundary;