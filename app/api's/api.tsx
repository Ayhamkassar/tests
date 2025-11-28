import axios from 'axios';

const API_URL = 'https://localhost:7084/api/Stores';  
export const getStoreByUser = async (userId: number) => {
  return await axios.get(`${API_URL}/user/${userId}`);
};

export const updateStore = async (userId: number, store: any) => {
  return await axios.put(`${API_URL}/update/${userId}`, store);
};

export const deleteStore = async (userId: number) => {
  return await axios.delete(`${API_URL}/delete/${userId}`);
};

export const getAllStores = async () => {
  return await axios.get(`${API_URL}/all`);
};