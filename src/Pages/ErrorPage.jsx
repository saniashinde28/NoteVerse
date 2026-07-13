import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6">

            <div className="max-w-md text-center">

                <h1 className="text-7xl font-bold tracking-tight">
                    {error?.status || "404"}
                </h1>

                <h2 className="mt-4 text-2xl font-semibold">
                    Oops! Something went wrong.
                </h2>

                <p className="mt-3 text-slate-500">
                    {error?.statusText ||
                        error?.message ||
                        "The page you're looking for doesn't exist."}
                </p>

                <Link to="/">
                    <Button className="mt-8">
                        Back to Home
                    </Button>
                </Link>

            </div>

        </div>
    );
}

export default ErrorPage;