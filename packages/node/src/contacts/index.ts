import { Remark } from "../remark";
import {
  ContactFields,
  ContactResponse,
  CreateContactOptions,
  DeleteContactOptions,
  UpdateContactOptions,
} from "./interfaces";

export class Contacts {
  constructor(private readonly remark: Remark) {}

  /**
   * Creates a new contact.
   * @throws {Error} If the API request fails
   * @example
   * ```ts
   * const { data: contact } = await remark.contacts.create({
   *   email: "alan@turing.com",
   *   name: "Alan Turing"
   * });
   * ```
   */
  async create(options: CreateContactOptions): Promise<ContactResponse> {
    const response = await this.remark.post<ContactFields>(`/contacts`, {
      name: options.name,
      email: options.email,
      metadata: options.metadata,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      data: response.data,
      error: null,
    };
  }

  /**
   * Updates an existing contact.
   * @throws {Error} If the API request fails
   * @example
   * ```ts
   * const { data: contact } = await remark.contacts.update({
   *   email: "alan@turing.com",
   *   name: "Alan Turing",
   *   metadata: {
   *     tier: "premium"
   *   }
   * });
   * ```
   */
  async update(options: UpdateContactOptions): Promise<ContactResponse> {
    const response = await this.remark.patch<ContactFields>(`/contacts`, {
      email: options.email,
      name: options.name,
      metadata: options.metadata,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      data: response.data,
      error: null,
    };
  }

  /**
   * Deletes a contact.
   * @throws {Error} If the API request fails
   * @example
   * ```ts
   * const { data: contact } = await remark.contacts.delete({
   *   email: "alan@turing.com"
   * });
   * ```
   */
  async delete(options: DeleteContactOptions): Promise<ContactResponse> {
    const response = await this.remark.delete<ContactFields>(`/contacts`, {
      email: options.email,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return {
      data: response.data,
      error: null,
    };
  }
}
