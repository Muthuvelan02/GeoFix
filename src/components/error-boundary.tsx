'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error to external service (e.g., Sentry, LogRocket)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Implement error logging to external service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.warn('Error logging service not implemented');
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-gray-100 p-3 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 text-xs text-red-600 whitespace-pre-wrap">
                        {this.state.error.message}
                      </pre>
                    </div>
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                  variant="ghost"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                Error ID: {Date.now().toString(36)}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// API Error Display Component
export function ApiErrorDisplay({ 
  error, 
  onRetry, 
  className = '' 
}: { 
  error: any; 
  onRetry?: () => void; 
  className?: string;
}) {
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred';
  };

  const getErrorCode = (error: any): string | null => {
    if (error?.code) return error.code;
    if (error?.response?.status) return `HTTP ${error.response.status}`;
    return null;
  };

  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-red-800">
              Error
            </h4>
            <p className="text-sm text-red-700 mt-1">
              {getErrorMessage(error)}
            </p>
            {getErrorCode(error) && (
              <p className="text-xs text-red-600 mt-1">
                Code: {getErrorCode(error)}
              </p>
            )}
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Network Error Component
export function NetworkErrorDisplay({ 
  onRetry, 
  className = '' 
}: { 
  onRetry?: () => void; 
  className?: string;
}) {
  return (
    <Card className={`border-orange-200 bg-orange-50 ${className}`}>
      <CardContent className="p-4 text-center">
        <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
        <h4 className="text-sm font-medium text-orange-800 mb-1">
          Connection Problem
        </h4>
        <p className="text-sm text-orange-700 mb-3">
          Unable to connect to the server. Please check your internet connection.
        </p>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Loading Error Component
export function LoadingErrorDisplay({ 
  error, 
  onRetry, 
  title = "Failed to load data",
  className = '' 
}: { 
  error: any; 
  onRetry?: () => void; 
  title?: string;
  className?: string;
}) {
  return (
    <div className={`text-center py-8 ${className}`}>
      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        {error?.message || 'Something went wrong while loading the data.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
