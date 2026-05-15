import api from "./axios";
import { API_ENDPOINTS } from "./endpoints";


export const loginApi = (data) => {
  return api.post(API_ENDPOINTS.login, data);
};

export const registerApi = (data) => {
  return api.post(API_ENDPOINTS.register, data);
};