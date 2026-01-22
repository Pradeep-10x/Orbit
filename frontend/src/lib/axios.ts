import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Track if refresh is in progress to prevent infinite loops
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't intercept auth endpoints (login, register, refresh-token)
        const authEndpoints = ['/user/login', '/user/register', '/user/refresh-token'];
        const isAuthEndpoint = authEndpoints.some(endpoint => 
            originalRequest.url?.includes(endpoint)
        );

        if (isAuthEndpoint) {
            return Promise.reject(error);
        }

        // Handle 401 errors for protected routes only
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post("/user/refresh-token");
                const { accessToken } = response.data.data || {};
                
                if (accessToken) {
                    processQueue(null, accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    isRefreshing = false;
                    return api(originalRequest);
                } else {
                    throw new Error('No access token received');
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                // Clear auth state on refresh failure
                localStorage.removeItem('token');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

