import axios from 'axios';
import api from './axios';
import { API_ENDPOINTS } from './endpoints';




export const newArrivalService = {
  getAll:    ()         => api.get(API_ENDPOINTS.newArrivals),
  getById:   (id)       => axios.get(`${API_ENDPOINTS.newArrivals}/${id}`),
 
};