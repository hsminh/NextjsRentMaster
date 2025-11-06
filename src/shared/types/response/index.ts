export interface AuthResponse {
  token: string
}

export interface ErrorResponse {
  message: string
  statusCode?: number
  error?: string
}
