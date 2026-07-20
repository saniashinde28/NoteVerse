import React from "react";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.log("ErrorBoundary executed");

        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });
        console.error("Caught by Error Boundary:", error);
        console.error(errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">
                            Something went wrong.
                        </h1>

                        <p className="mt-3 text-muted-foreground">
                            Please refresh the page.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }

}

export default ErrorBoundary;