export interface FeedbackFields {
  /**
   * Sender email address.
   * @required
   */
  from: string;
  /**
   * The plain text version of the message.
   * @required
   */
  text: string;
  /**
   * Additional metadata for the feedback.
   * Currently only supports path as a string.
   * @optional
   */
  metadata?: {
    os?: string;
    path?: string;
    device?: string;
    browser?: string;
  };
}

export interface CreateFeedbackOptions extends FeedbackFields {}

export interface CreateFeedbackResponse {
  data: FeedbackFields | null;
  error: { name: string; message: string } | null;
}
