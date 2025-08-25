
// Helper function for error handling
export const handleError = (error: unknown, operation: string) => {
  console.error(`Error in ${operation}:`, error);

   return {
      success: false,
      data: null,
      error: new Error(`Failed to ${operation}: ${error instanceof Error ? error.message : "Unknown error occurred"}`),
      message: `Failed to ${operation}`
   };
}