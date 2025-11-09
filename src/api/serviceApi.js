// src/api/serviceApi.js
import http from "./index";

// ✅ 1. Get all services for provider
export function getProviderServices(providerId) {
  return http.get(`/services/provider/${providerId}`);
}

// ✅ 2. Create service
export function createService(data) {
  const config = data instanceof FormData 
    ? { headers: { "Content-Type": "multipart/form-data" } } 
    : {};
  return http.post("/services", data, config);
}

// ✅ 3. Update service
export function updateService(serviceId, data) {
  const config = data instanceof FormData 
    ? { headers: { "Content-Type": "multipart/form-data" } } 
    : {};
  return http.put(`/services/${serviceId}`, data, config);
}

// ✅ 4. Delete service
export function deleteServiceById(serviceId) {
  return http.delete(`/services/${serviceId}`);
}