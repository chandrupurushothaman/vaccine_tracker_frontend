import axios from 'axios';
import { showAlert, showLoading } from '../utils/common';

const REACT_APP_BASE_URL = "http://localhost:8083";

const apiClient = axios.create({
  baseURL: REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

export const _get = async (url, config) => {
  try {
    showLoading(true);
    const resp = await apiClient.get(url, config);
    return resp;
  } catch (error) {
    showAlert({open: true, severity: "error", message: error})
    throw error;
  } finally {
    showLoading(false);
  }
};

export const _post = async (url, data, config) => {
  try {
    showLoading(true);
    const resp = await apiClient.post(url, data, config);
    return resp;
  } catch (error) {
    showAlert({open: true, severity: "error", message: error})
    throw error;
  } finally {
    showLoading(false);
  }
};

export const _patch = async (url, data, config) => {
  try {
    showLoading(true);
    const resp = await apiClient.patch(url, data, config);
    return resp;
  } catch (error) {
    showAlert({open: true, severity: "error", message: error})
    throw error;
  } finally {
    showLoading(false);
  }
};

export const _put = async (url, data, config) => {
  try {
    showLoading(true);
    const resp = await apiClient.put(url, data, config);
    return resp;
  } catch (error) {
    showAlert({open: true, severity: "error", message: error})
    throw error;
  } finally {
    showLoading(false);
  }
};

export const _delete = async (url, config) => {
  try {
    showLoading(true);
    const resp = await apiClient.delete(url, config);
    return resp;
  } catch (error) {
    showAlert({open: true, severity: "error", message: error})
    throw error;
  } finally {
    showLoading(false);
  }
};

export default apiClient;