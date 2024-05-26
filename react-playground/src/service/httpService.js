import axios from "axios";

export default class HTTPService {
  constructor(baseURL, config = {}) {
    this.instance = axios.create({ baseURL, ...config });

    // Response Interceptor (https://axios-http.com/docs/interceptors)
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  get = async (endpoint, params = {}, config = {}) => {
    try {
      const response = await this.instance.get(endpoint, { ...config, params });
      return response;
    } catch (error) {
      console.error("Error making GET request:", error);
      throw error;
    }
  };

  post = async (endpoint, data = {}, config = {}) => {
    try {
      const response = await this.instance.post(endpoint, data, config);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
      throw error;
    }
  };

  put = async (endpoint, data = {}, config = {}) => {
    try {
      const response = await this.instance.put(endpoint, data, config);
      return response;
    } catch (error) {
      console.error("Error making PUT request:", error);
      throw error;
    }
  };

  patch = async (endpoint, data = {}, config = {}) => {
    try {
      const response = await this.instance.patch(endpoint, data, config);
      return response;
    } catch (error) {
      console.error("Error making PATCH request:", error);
      throw error;
    }
  };

  delete = async (endpoint, data = {}, config = {}) => {
    try {
      const response = await this.instance.delete(endpoint, {
        data,
        ...config,
      });
      return response;
    } catch (error) {
      console.error("Error making DELETE request:", error);
      throw error;
    }
  };
}
