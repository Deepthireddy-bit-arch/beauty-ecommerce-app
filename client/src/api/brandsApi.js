import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";

export const fetchBrandsApi = () => {
  return api.get(API_ENDPOINTS.collectionbrands);
};