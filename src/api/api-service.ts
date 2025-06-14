import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError
} from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '../config/api_uri';

/**
 * Request timeout in milliseconds
 */
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Create Axios instance with default configuration
 */
const apiInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request interceptor
 */
apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 */
apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Generic API response interface
 */
interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
}

/**
 * API service class with POST method only
 */
class ApiService {
    /**
     * POST request
     */
    static async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        try {
            const response = await apiInstance.post<T>(url, data, config);
            return response;
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    /**
     * Handle and format errors
     */
    private static handleError(error: AxiosError): Error {
        if (error.response) {
            // Server error response
            const status = error.response.status;
            const message =
                (error.response.data && (error.response.data as { message?: string }).message)
                || error.message;

            switch (status) {
                case 400:
                    return new Error(`Bad Request: ${message}`);
                case 401:
                    return new Error(`Unauthorized: ${message}`);
                case 403:
                    return new Error(`Forbidden: ${message}`);
                case 404:
                    return new Error(`Not Found: ${message}`);
                case 500:
                    return new Error(`Server Error: ${message}`);
                default:
                    return new Error(`HTTP ${status}: ${message}`);
            }
        } else if (error.request) {
            // Network error
            return new Error('Network Error: Please check your connection');
        } else {
            // Other error
            return new Error(error.message || 'An unexpected error occurred');
        }
    }
}

/**
 * Export the API service and instance
 */
export default ApiService;
export { apiInstance };