export type RestAPIMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type UrlQueryType = Record<string, any> | undefined

export default class AbstractRestApiClient {
    protected baseURL: string
    protected defaultHeaders: Record<string, string>

    constructor(baseURL?: string) {
        this.baseURL = baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5279'
        this.defaultHeaders = { 'Content-Type': 'application/json' }

        const token = this.getAccessToken()
        if (token) this.defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    protected getAccessToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem('access_token')
    }

    protected async request<T>(
        method: RestAPIMethod,
        path: string,
        query?: UrlQueryType,
        body?: any,
        headers?: HeadersInit
    ): Promise<T> {
        const url = this.buildRequestURL(path, query)

        // ⚙️ Ưu tiên headers được truyền vào (từ API con)
        const mergedHeaders = {...this.defaultHeaders, ...headers}

        const config: RequestInit = {
            method,
            headers: mergedHeaders,
            credentials: 'include',
        }

        if (body && method !== 'GET') {
            const isFormData =
                typeof body === 'object' && body instanceof FormData

            config.body = isFormData ? body : JSON.stringify(body)

            if (isFormData && (mergedHeaders as any)['Content-Type'] === 'multipart/form-data') {
                delete (mergedHeaders as any)['Content-Type']
            }
        }

        try {
            const response = await fetch(url, config)
            const contentType = response.headers.get('Content-Type')

            const data = contentType?.includes('application/json')
                ? await response.json()
                : await response.text()

            if (!response.ok) throw data
            return data
        } catch (error) {
            console.error(`[API Error] ${method} ${url}`, error)
            throw error
        }
    }

        protected buildRequestURL(path: string, query?: UrlQueryType): string {
        const queryString = query
            ? Object.entries(query)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&')
            : ''
        return `${this.baseURL.replace(/\/$/, '')}/${path}${queryString ? '?' + queryString : ''}`
    }

    // --- Generic REST methods ---
    public get<T>(path: string, query?: UrlQueryType, headers?: HeadersInit): Promise<T> {
        return this.request('GET', path, query, undefined, headers)
    }

    public post<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('POST', path, query, body, headers)
    }

    public put<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('PUT', path, query, body, headers)
    }




    public patch<T>(path: string, query?: UrlQueryType, body?: any, headers?: HeadersInit): Promise<T> {
        return this.request('PATCH', path, query, body, headers)
    }

    public delete(path: string, query?: UrlQueryType, headers?: HeadersInit): Promise<void> {
        return this.request('DELETE', path, query, undefined, headers)
    }

// base-api-client.ts
    postForm<T>(path: string, formData: FormData): Promise<T> {
        return this.request<T>(
            "POST",      // method
            path,        // path
            undefined,   // query
            formData,    // body
            {}           // headers (để trống cho multipart tự handle)
        );
    }

}
