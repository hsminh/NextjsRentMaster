export type RestAPIMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type UrlQueryType = Record<string, any> | undefined

export default class AbstractRestApiClient {
    protected baseURL: string
    protected defaultHeaders: Record<string, string>
    protected protectedResource: boolean = false

    constructor(baseURL?: string) {
        // bạn có thể đổi URL này sang env riêng
        this.baseURL = baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5279'
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        }

        const token = this.getAccessToken()
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`
        }
    }

    /**
     * 🧩 Lấy token (từ localStorage)
     */
    protected getAccessToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('access_token')
    }

    /**
     * 🧩 Gửi request
     */
    protected async request<T>(
        method: RestAPIMethod,
        path: string,
        query?: UrlQueryType,
        body?: any,
        headers?: HeadersInit,
    ): Promise<T> {
        const url = this.buildRequestURL(path, query)
        const mergedHeaders = { ...this.defaultHeaders, ...headers }

        const config: RequestInit = {
            method,
            headers: mergedHeaders,
            credentials: 'include',
        }

        if (body && method !== 'GET') {
            config.body = JSON.stringify(body)
        }

        try {
            const response = await fetch(url, config)
            const contentType = response.headers.get('Content-Type')

            const data = contentType?.includes('application/json')
                ? await response.json()
                : await response.text()

            if (!response.ok) {
                throw new Error(data?.message || `Request failed: ${response.status}`)
            }

            return data
        } catch (error) {
            console.error(`[API Error] ${method} ${url}`, error)
            throw error
        }
    }

    /**
     * 🧩 Tạo URL có query
     */
    protected buildRequestURL(path: string, query?: UrlQueryType): string {
        const queryString = query
            ? Object.entries(query)
                .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
                .join('&')
            : ''
        return `${this.baseURL.replace(/\/$/, '')}/${path}${queryString ? '?' + queryString : ''}`
    }

    /**
     * 🧩 Các method REST
     */
    public get<T>(path: string, query?: UrlQueryType, headers?: HeadersInit): Promise<T> {
        return this.request('GET', path, query, undefined, headers)
    }

    public post<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('POST', path, query, body, headers)
    }

    public patch<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('PATCH', path, query, body, headers)
    }

    public put<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('PUT', path, query, body, headers)
    }

    public delete<T>(path: string, query?: UrlQueryType, headers?: HeadersInit): Promise<T> {
        return this.request('DELETE', path, query, undefined, headers)
    }
}
