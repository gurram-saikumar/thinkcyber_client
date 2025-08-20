// API Service for handling all API calls
import axios from 'axios';
import API_ENDPOINTS from '../constants/urlConstants.js';

// Create axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Homepage API Services
export const homepageService = {
  // Get homepage content by language
  getHomepageByLanguage: async (language = 'en') => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HOMEPAGE_BY_LANGUAGE(language));
      return response;
    } catch (error) {
      console.error('Error fetching homepage by language:', error);
      throw error;
    }
  },

  // Create or update homepage content
  createOrUpdateHomepageContent: async (data) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.HOMEPAGE_CONTENT, data);
      return response;
    } catch (error) {
      console.error('Error creating/updating homepage content:', error);
      throw error;
    }
  },

  // Get homepage FAQs
  getHomepageFAQs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HOMEPAGE_FAQS);
      return response;
    } catch (error) {
      console.error('Error fetching homepage FAQs:', error);
      throw error;
    }
  },

  // Create a new FAQ
  createFAQ: async (faqData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.HOMEPAGE_FAQS, faqData);
      return response;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  },

  // Update FAQ by ID
  updateFAQ: async (id, faqData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.HOMEPAGE_FAQ_BY_ID(id), faqData);
      return response;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  },

  // Delete FAQ by ID
  deleteFAQ: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.HOMEPAGE_FAQ_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  },
};

// Categories API Services
export const categoriesService = {
  // Get all categories with pagination and sorting
  getAllCategories: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, { params });
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Add a new category
  addCategory: async (categoryData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, categoryData);
      return response;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Update category by ID
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category by ID
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

// Subcategories API Services
export const subcategoriesService = {
  // Get all subcategories with pagination and sorting
  getAllSubcategories: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUBCATEGORIES, { params });
      return response;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  },

  // Add a new subcategory
  addSubcategory: async (subcategoryData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SUBCATEGORIES, subcategoryData);
      return response;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  },

  // Get subcategory by ID
  getSubcategoryById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SUBCATEGORY_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error fetching subcategory by ID:', error);
      throw error;
    }
  },

  // Update subcategory by ID
  updateSubcategory: async (id, subcategoryData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.SUBCATEGORY_BY_ID(id), subcategoryData);
      return response;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  },

  // Delete subcategory by ID
  deleteSubcategory: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SUBCATEGORY_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  },
};


// Privacy Policy API Services
export const privacyService = {
  // Get all privacy policies with pagination and sorting
  getAllPrivacyPolicies: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRIVACY, { params });
      return response;
    } catch (error) {
      console.error('Error fetching privacy policies:', error);
      throw error;
    }
  },

  // Create new privacy policy
  createPrivacyPolicy: async (policyData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRIVACY, policyData);
      return response;
    } catch (error) {
      console.error('Error creating privacy policy:', error);
      throw error;
    }
  },

  // Get privacy policy by ID
  getPrivacyPolicyById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRIVACY_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error fetching privacy policy by ID:', error);
      throw error;
    }
  },

  // Update privacy policy by ID
  updatePrivacyPolicy: async (id, policyData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.PRIVACY_BY_ID(id), policyData);
      return response;
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      throw error;
    }
  },

  // Delete privacy policy by ID
  deletePrivacyPolicy: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.PRIVACY_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error deleting privacy policy:', error);
      throw error;
    }
  },

  // Publish privacy policy by ID
  publishPrivacyPolicy: async (id) => {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PRIVACY_BY_ID(id)}/publish`);
      return response;
    } catch (error) {
      console.error('Error publishing privacy policy:', error);
      throw error;
    }
  },
};


// Topic API Services
export const topicService = {
  // Get all topics
  getAllTopics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TOPICS, { params });
      return response;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },

  // Get topic by ID
  getTopicById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TOPIC_BY_ID(id));
      return response;
    } catch (error) {
      console.error('Error fetching topic by ID:', error);
      throw error;
    }
  },

  // Get modules for a topic
  getTopicModules: async (topicId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TOPIC_MODULES(topicId));
      return response;
    } catch (error) {
      console.error('Error fetching topic modules:', error);
      throw error;
    }
  },

  // Get videos for a topic
  getTopicVideos: async (topicId) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TOPIC_VIDEOS(topicId));
      return response;
    } catch (error) {
      console.error('Error fetching topic videos:', error);
      throw error;
    }
  },
};

// Export the configured axios instance for custom use
// Auth API Services
export const authService = {
  // Login user
  loginUser: async (email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VERIFY_OTP, { email, otp });
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },
  //signup user
  signupUser: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  } 
};
export default apiClient;
