
import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export const fetchHomeDataApi = () => {
  return api.get(API_ENDPOINTS.home);
};  
export const fetchCategoryBannersApi = () => {
  return api.get(API_ENDPOINTS.categoryBanners);
};