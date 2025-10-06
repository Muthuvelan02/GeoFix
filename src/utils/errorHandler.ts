// Utility for handling API errors consistently
export const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as {
      response?: {
        data?: {
          error?: string;
          message?: string;
        };
      };
    };
    throw new Error(apiError.response?.data?.error || apiError.response?.data?.message || defaultMessage);
  }
  
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  
  throw new Error(defaultMessage);
};