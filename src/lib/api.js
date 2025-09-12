// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative URL to Vercel functions
  : 'http://localhost:3001/api';  // In development, use local server

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') 
    ? endpoint  // If endpoint already has /api prefix, use as-is
    : `${API_BASE_URL}${endpoint}`;  // Otherwise, prepend base URL

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { success: false, message: 'Invalid response format' };
    }
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, message: 'Network error' };
  }
};

// Specific API functions
export const contactAPI = {
  getAll: () => apiCall('/contact'),
  create: (data) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const prayerAPI = {
  getAll: () => apiCall('/prayers'),
  create: (data) => apiCall('/prayers', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

export const adminAPI = {
  login: (credentials) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (data) => apiCall('/admin/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  createRegistrationToken: (email) => apiCall('/admin/create-registration-token', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  verifyToken: (token) => apiCall(`/admin/verify-token?token=${token}`)
};

export const healthAPI = {
  check: () => apiCall('/health')
};
