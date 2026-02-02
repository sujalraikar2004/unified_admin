const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

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

export const eventApi = {
    getEvents: () => apiFetch('/api/events'),
    createEvent: async (eventData) => {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: eventData, // FormData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to create event');
        }
        return data;
    },
    updateEvent: async (id, eventData) => {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: eventData, // FormData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to update event');
        }
        return data;
    },
    deleteEvent: (id) => apiFetch(`/api/events/${id}`, {
        method: 'DELETE',
    }),
};

export const galleryApi = {
    getGalleryItems: (params) => {
        const query = new URLSearchParams(params).toString();
        return apiFetch(`/api/gallery${query ? `?${query}` : ''}`);
    },
    uploadGalleryItem: async (formData) => {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/gallery`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || data.error || 'Failed to upload');
        }
        return data;
    },
    updateGalleryItem: (id, itemData) => apiFetch(`/api/gallery/${id}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
    }),
    deleteGalleryItem: (id) => apiFetch(`/api/gallery/${id}`, {
        method: 'DELETE',
    }),
};

export default apiFetch;
