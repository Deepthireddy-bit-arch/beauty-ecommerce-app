import api from './axios';
import { API_ENDPOINTS } from './endpoints';

export const fetchProductsApi = () => {
  return api.get(API_ENDPOINTS.products);
};