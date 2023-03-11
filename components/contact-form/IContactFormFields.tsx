export interface IContactFormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type IContactFormValidationErrors = {
  [key in keyof IContactFormFields]?: string;
};
