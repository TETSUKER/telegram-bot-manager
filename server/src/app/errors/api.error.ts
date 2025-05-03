export class ApiError extends Error {
  public timestamp = new Date().toISOString();

  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}
