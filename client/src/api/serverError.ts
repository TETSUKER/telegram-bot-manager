interface ServerError {
  error: {
    message: string;
    timestamp: string;
  };
}

export function isServerError(error: unknown): error is ServerError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as any).error.message === "string" &&
    typeof (error as any).error.timestamp === "string"
  );
}
