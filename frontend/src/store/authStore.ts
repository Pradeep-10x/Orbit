import { create } from 'zustand';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';

export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    bio?: string;
    avatar?: string;
    followersCount: number;
    followingCount: number;
    isVerified: boolean;
    VerificationBadge?: "Gold" | "Silver" | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isCheckingAuth: boolean;
    isAuthChecked: boolean;
    login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>;
    register: (data: { username: string; email: string; password: string; fullName?: string }) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

// Track if checkAuth is currently running to prevent duplicate calls
let isCheckingAuthInProgress = false;

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: false,
    isAuthChecked: false,

    login: async (credentials) => {
        try {
            set({ isLoading: true });
            const { data } = await api.post('/user/login', credentials);
            localStorage.setItem('token', data.data?.token || '');
            set({ user: data.data.user || data.data, isAuthenticated: true, isLoading: false });
            toast.success('Logged in successfully');
        } catch (error: any) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    register: async (data) => {
        try {
            set({ isLoading: true });
            const response = await api.post('/user/register', data);
            localStorage.setItem('token', response.data.data?.token || '');
            set({ user: response.data.data.user || response.data.data, isAuthenticated: true, isLoading: false });
            toast.success('Registration successful');
        } catch (error: any) {
            set({ isLoading: false });
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            await api.post('/user/logout');
            localStorage.removeItem('token');
            toast.success('Logged out');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            set({ user: null, isAuthenticated: false });
        }
    },

    checkAuth: async () => {
        // Prevent duplicate simultaneous calls
        if (isCheckingAuthInProgress) {
            return;
        }

        try {
            isCheckingAuthInProgress = true;
            set({ isCheckingAuth: true });
            const { data } = await api.get('/user/me');
            set({ user: data.data, isAuthenticated: true, isCheckingAuth: false, isAuthChecked: true });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isCheckingAuth: false, isAuthChecked: true });
        } finally {
            isCheckingAuthInProgress = false;
        }
    },
}));

