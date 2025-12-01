export interface AuthResponse {
  token: string;
  user: {
    uid: string;
    firstName: string;
    lastName: string;
    gmail: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string | null;
  };
}

export interface ErrorResponse {
  message: string
  statusCode?: number
  error?: string
}
