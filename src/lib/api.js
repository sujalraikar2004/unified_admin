const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('admin_token'); // Assumes you store the token here

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'An API error occurred.');
    }

    return data;
}

export const authApi = {
    login: (credentials) => {
        return apiFetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
};

export const registrationApi = {
    getRegistrations: () => apiFetch('/api/admin/registrations'),
    getDownloadUrl: () => `${API_BASE_URL}/api/admin/registrations/download`,
};
