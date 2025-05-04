/**
 * Represents the result of a try-catch operation, containing either the successful data
 * or an error, but never both.
 */
type TryCatchResult<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Abstracts the try-catch operation for the sake of readability.
 * @param promise - Promise to execute
 * @returns Object with data or error
 */
export async function tryCatch<T>(
  promise: Promise<T>,
): Promise<TryCatchResult<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error: unknown) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
