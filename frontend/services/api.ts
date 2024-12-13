import axios from 'axios';
import { ButtonProps } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create base API instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 300000, // 5 minutes timeout
});

// Helper function to handle network errors
const handleNetworkError = (error: any) => {
    if (error.message === 'Network Error') {
        console.error('Network error - server may be down:', error);
        throw new Error('Server ist nicht erreichbar. Bitte starten Sie den Server neu.');
    }
    if (axios.isAxiosError(error) && !error.response) {
        console.error('Connection error:', error);
        throw new Error('Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie Ihre Internetverbindung.');
    }
    throw error;
};

// Helper function to convert relative image URLs to absolute URLs
const getFullImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Remove any leading /api from the imageUrl and clean the path
    const cleanPath = imageUrl.replace(/^\/api/, '').replace(/\/+/g, '/');
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    return `${baseUrl}${cleanPath}`;
};

// Request Interceptor
api.interceptors.request.use((config) => {
    console.log('Making API request:', {
        url: config.url,
        method: config.method,
        data: config.data
    });
    return config;
}, handleNetworkError);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        console.log('API response received:', {
            status: response.status,
            data: response.data
        });
        
        // Convert image URLs in the response
        if (response.data && response.data.result) {
            if (typeof response.data.result === 'string' && response.data.result.includes('/images')) {
                response.data.result = getFullImageUrl(response.data.result);
            } else if (Array.isArray(response.data.result)) {
                response.data.result = response.data.result.map((url: string) => 
                    url.includes('/images') ? getFullImageUrl(url) : url
                );
            }
        }
        
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        // Handle network errors
        if (!error.response) {
            return handleNetworkError(error);
        }
        
        // Handle specific error status codes
        switch (error.response.status) {
            case 404:
                throw new Error('Ressource nicht gefunden');
            case 500:
                throw new Error('Server-Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
            default:
                throw error;
        }
    }
);

interface ReplicateMassGenerateParams {
    model: string;
    outputFolder: string;
    prompts: string[];
    numImages: number;
    onProgress?: (current: number) => void;
    signal?: AbortSignal;
    loraScale?: number;
    aspectRatio?: string;
    outputFormat?: string;
    guidanceScale?: number;
    outputQuality?: number;
}

export async function runReplicateMassgenerate(params: ReplicateMassGenerateParams) {
    try {
        console.log('Starting API call with data:', params);

        const controller = new AbortController();
        if (params.signal) {
            params.signal.addEventListener('abort', () => {
                controller.abort();
            });
        }

        const response = await api.post('/replicate_massgenerate', {
            model: params.model,
            prompts: params.prompts,
            outputFolder: params.outputFolder,
            numImages: params.numImages,
            loraScale: params.loraScale ?? 0.75,
            aspectRatio: params.aspectRatio ?? '1:1',
            outputFormat: params.outputFormat ?? 'png',
            guidanceScale: params.guidanceScale ?? 7.5,
            outputQuality: params.outputQuality ?? 100
        }, {
            signal: controller.signal
        });

        if (!response.data) {
            throw new Error('No data received from server');
        }

        console.log('API call successful, response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API call failed:', error);
        if (axios.isAxiosError(error)) {
            if (!error.response) {
                throw new Error('Lost connection to server. Please check your server connection.');
            }
            if (error.response.status === 401) {
                throw new Error('Replicate API Token not found or invalid. Please check your configuration.');
            }
        }
        throw error;
    }
}

export const generateLeonardoImage = async (prompt: string): Promise<any> => {
    try {
        const response = await api.post('/leonardo', { prompt });
        return response.data;
    } catch (error) {
        console.error('Fehler bei generateLeonardoImage:', error);
        throw error;
    }
};

export default api;