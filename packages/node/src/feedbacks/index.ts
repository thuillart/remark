import {
  CreateFeedbackOptions,
  CreateFeedbackResponse,
  FeedbackFields,
} from "../feedbacks/interfaces";
import { Remark } from "../remark";

export class Feedbacks {
  constructor(private readonly remark: Remark) {}

  /**
   * Creates a new feedback.
   * @throws {Error} If the API request fails
   * @example
   * ```ts
   * const { data: feedback } = await remark.feedbacks.create({
   *   from: "alan@turing.com",
   *   text: "Great product!",
   *   metadata: {
   *     os: "macOS"
   *     path: "/page"
   *     device: "undefined"
   *     browser: "Google Chrome"
   *   }
   * });
   * ```
   */
  async create(
    options: CreateFeedbackOptions,
  ): Promise<CreateFeedbackResponse> {
    return this.remark.post<FeedbackFields>(`/feedbacks`, {
      from: options.from,
      text: options.text,
      metadata: options.metadata,
    });
  }
}
