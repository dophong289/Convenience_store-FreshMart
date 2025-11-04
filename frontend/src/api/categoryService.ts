import apiClient from './apiClient';
import { API_ENDPOINTS } from './config';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  productCount: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<CategoriesResponse> => {
    return apiClient.get(API_ENDPOINTS.CATEGORIES);
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    return apiClient.get(API_ENDPOINTS.CATEGORY_BY_SLUG(slug));
  },
};

