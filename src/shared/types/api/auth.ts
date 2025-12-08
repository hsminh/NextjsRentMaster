export interface LoginResponse {
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

export interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  userType: 'admin' | 'landlord' | 'consumer' | null;
  userUid: string | null;
  isVerified: boolean;
    userData: {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string | null;
  } | null;
}
