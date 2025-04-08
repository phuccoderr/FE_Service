export type LoginUserRequestType = {
  username: string;
  password: string;
};

export type RegisterUserRequestType = {
  username: string;
  password: string;
  email: string;
};

export type LoginResponseType = {
  access_token: string;
  role: string;
};

export type UpdateUserRequestType = {
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
};

export type UserType = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  role: string;
};
