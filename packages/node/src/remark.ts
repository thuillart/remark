import { tryCatch } from "./common/helpers";
import { ApiResponse, PatchOptions, PostOptions } from "./common/interfaces";
import { Contacts } from "./contacts";
import { Feedbacks } from "./feedbacks";

const PRODUCTION_URL = "https://api.remark.sh/api";
const DEVELOPMENT_URL = "http://localhost:3000/api";

/**
 * The main Remark SDK class. Initialize with your API key to start making requests.
 *
 * @example
 * ```ts
 * const remark = new Remark("your_api_key");
 * ```
 */
export class Remark {
  private readonly headers: Headers;
  private readonly baseUrl: string;

  readonly contacts = new Contacts(this);
  readonly feedbacks = new Feedbacks(this);

  /**
   * Creates a new instance of the Remark SDK.
   * @param key - Your Remark API key
   * @param options - Configuration options
   * @param options.mode - The mode to run the SDK in. This option is for internal use only and should not be modified by users.
   * @throws {Error} If no API key is provided
   */
  constructor(
    readonly key: string,
    options: { mode?: "production" | "development" } = {},
  ) {
    if (!key) {
      throw new Error(
        "Missing API key. Please define it in your .env file as REMARK_API_KEY.",
      );
    }

    this.baseUrl =
      options.mode === "development" ? DEVELOPMENT_URL : PRODUCTION_URL;
    this.headers = new Headers({
      "x-api-key": this.key,
      "Content-Type": "application/json",
    });
  }

  /**
   * Makes a generic fetch request to the Remark API.
   * @throws {Error} If the API request fails
   */
  async fetchRequest<T>(path: string, options = {}): Promise<ApiResponse<T>> {
    // Network error
    const { data: response, error: fetchError } = await tryCatch(
      fetch(`${this.baseUrl}${path}`, options),
    );
    if (fetchError || !response) {
      return {
        data: null,
        error: {
          name: "network_error",
          message: "Unable to fetch data. The request could not be resolved.",
        },
      };
    }

    // Success
    if (response.ok) {
      const { data, error: parseError } = await tryCatch<T>(
        response.json() as Promise<T>,
      );
      if (parseError) {
        return {
          data: null,
          error: {
            name: "parse_error",
            message: "Failed to parse response data",
          },
        };
      }
      return { data, error: null };
    }

    // Error response
    const { data: errorText, error: textError } = await tryCatch(
      response.text(),
    );
    if (textError || !errorText) {
      return {
        data: null,
        error: {
          name: "server_error",
          message: response.statusText,
        },
      };
    }

    // Parse backend error
    const parsed = JSON.parse(errorText);
    return {
      data: null,
      error: {
        name: parsed.code.toLowerCase(),
        message: parsed.error,
      },
    };
  }

  /**
   * Makes a POST request to the Remark API.
   * @throws {Error} If the API request fails
   */
  async post<T>(
    path: string,
    entity?: unknown,
    options: PostOptions = {},
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(entity),
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  /**
   * Makes a PATCH request to the Remark API.
   * @throws {Error} If the API request fails
   */
  async patch<T>(
    path: string,
    entity: unknown,
    options: PatchOptions = {},
  ): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(entity),
      ...options,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  /**
   * Makes a DELETE request to the Remark API.
   * @throws {Error} If the API request fails
   */
  async delete<T>(path: string, query?: unknown): Promise<ApiResponse<T>> {
    const requestOptions = {
      method: "DELETE",
      headers: this.headers,
      body: JSON.stringify(query),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }
}
