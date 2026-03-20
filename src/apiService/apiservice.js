import axiosInstance from "./axiosInstance";

export const getData = async (urlEndpoint) => {
  const response = await axiosInstance.get(`/${urlEndpoint}`);
  return response.data;
};
export const getDataByQuery = async (urlEndpoint, query) => {
  const response = await axiosInstance.get(`/${urlEndpoint}?${query}`);
  return response.data;
};

export const getDatabyparams = async (urlEndpoint, paramId) => {
  const response = await axiosInstance.get(`/${urlEndpoint}/${paramId}`);
  return response.data;
};

export const postData = async (urlEndpoint, data) => {
  const response = await axiosInstance.post(`/${urlEndpoint}`, data);
  return response.data;
};

export const postDatabyparams = async (urlEndpoint, paramId) => {
  const response = await axiosInstance.post(`/${urlEndpoint}/${paramId}`, data);
  return response.data;
};
