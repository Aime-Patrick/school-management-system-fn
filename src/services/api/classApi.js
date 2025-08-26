import axiosInstance from '../axios'

export const createClass = async(name) =>{
    try {
        const response = await axiosInstance.post('/classes',name);
        return response.data;
    } catch (error) {
        throw error
    }
}

export const getClass = async ()=>{
    try {
        const response = await axiosInstance.get(`/classes`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getClassById = async (id) => {
    try {
        const response = await axiosInstance.get(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updateClass = async ({id, classData}) => {
    try {
        const response = await axiosInstance.put(`/classes/${id}`, classData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deleteClass = async (id) => {
    try {
        const response = await axiosInstance.delete(`/classes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getClassBySchoolId = async (schoolId) => {
    try {
        const response = await axiosInstance.get(`/classes/school/${schoolId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addCombinationIntoClass = async ({classId, combination}) => {
    console.log("Adding combination into class:", classId, combination);
    try {
        const response = await axiosInstance.post(`/classes/${classId}/combinations`, combination);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const assignTimetableToCombination = async ({combinationId, timetable}) => {
    console.log("Assigning timetable to combination:", combinationId, timetable);
    try {
        const response = await axiosInstance.put(`/classes/combinations/${combinationId}/timetable`, { timetable });
        return response.data;
    } catch (error) {
        throw error;    
    }
} 

export const updateTimetableForCombination = async ({combinationId, timetable}) => {
    console.log("Updating timetable for combination:", combinationId, timetable);
    try {
        const response = await axiosInstance.put(`/classes/combinations/${combinationId}/update-timetable`, { timetable });
        return response.data;
    } catch (error) {
        throw error;    
    }
}

export const updateScheduleItem = async ({combinationId, day, scheduleIndex, updateData}) => {
    console.log("Updating schedule item:", { combinationId, day, scheduleIndex, updateData });
    try {
        const response = await axiosInstance.put(`/classes/combinations/${combinationId}/schedule/${day}/${scheduleIndex}`, updateData);
        return response.data;
    } catch (error) {
        throw error;    
    }
}

export const deleteScheduleItem = async ({combinationId, day, scheduleIndex}) => {
    try {
        const response = await axiosInstance.delete(`/classes/combinations/${combinationId}/schedule/${day}/${scheduleIndex}`);
        return response.data;
    } catch (error) {
        throw error;    
    }
}

export const deleteDayFromTimetable = async ({combinationId, day}) => {
    console.log("Deleting day from timetable:", { combinationId, day });
    try {
        const response = await axiosInstance.delete(`/classes/combinations/${combinationId}/delete-day-timetable`, {
            data: { day }
        });
        return response.data;
    } catch (error) {
        throw error;    
    }
}