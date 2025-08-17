
// Helper function for error handling
export const handleError = (error: unknown, operation: string) => {
  console.error(`Error in ${operation}:`, error);

  if (error instanceof Error) {
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }

  throw new Error(`Failed to ${operation}: Unknown error occurred`);
}