import axiosInstance from "../../axios";

export const getBooks = async () => {
  try {
    const response = await axiosInstance.get('/library/books');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axiosInstance.get(`/library/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await axiosInstance.post('/library/books', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBook = async (bookData) => {
  try {
    console.log(bookData);
    const { id, ...data } = bookData;
    const response = await axiosInstance.put(`/library/books/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    await axiosInstance.delete(`/library/books/${id}`);
  } catch (error) {
    throw error;
  }
};

export const searchBooks = async (query) => {
  try {
    const response = await axiosInstance.get(`/library/books/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
