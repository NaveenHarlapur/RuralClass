"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  WifiOff,
  ServerCrash,
  FileWarning,
  RefreshCw,
  Home,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  showBackLink?: boolean;
}

export function GeneralError({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or contact support if the problem persists.",
  onRetry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-3">
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {showHomeLink && (
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NetworkError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
          <WifiOff className="h-8 w-8 text-orange-500" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">No Internet Connection</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Please check your internet connection and try again. Your offline content is still available.
        </p>
        <div className="flex gap-3">
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/dashboard/student/offline">View Offline Content</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ServerError({
  onRetry,
}: {
  onRetry?: () => void;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ServerCrash className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Server Error</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Our servers are experiencing issues. We&apos;re working to fix this. Please try again in a few minutes.
        </p>
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NotFoundError({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileWarning className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AccessDeniedError() {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Access Denied</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function FormError({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-destructive hover:bg-destructive/20"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      )}
    </div>
  );
}
