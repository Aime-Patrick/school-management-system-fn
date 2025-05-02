import axiosInstance from "../axios";

export const getCourses = async () => {
  try {
    const response = await axiosInstance.get("/courses");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getCourseById = async (id) => {
  try {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post("/courses/add-course", courseData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateCourse = async (courseData) => {
  try {
    const response = await axiosInstance.put(`/courses/${courseData.id}`, courseData.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const assignTeacherToCourse = async (courseData) => {
  try {
    const response = await axiosInstance.put(`/courses/assign-teacher/${courseData.id}`, courseData.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteCourse = async ({id}) => {
  try {
    const response = await axiosInstance.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}