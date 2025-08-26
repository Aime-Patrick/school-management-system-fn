import React, { useState, useEffect } from "react";
import { Edit3, Trash2, Save } from "lucide-react";
import { useClasses } from "../../../hooks/useClasses";
import { useTimeTable } from "../../../hooks/useClassesBySchoolId";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const Timetable = ({ timetableData, combinationId }) => {
  const [timetable, setTimetable] = useState([]);
  const { updateClass, updateClassLoading } = useClasses();
  const { updateScheduleItemMutation, deleteScheduleItemMutation, deleteDayFromTimetableMutation } = useTimeTable();
  // Removed removedSchedules, removedDays, and isDeleteSchedule states since we're using individual API calls

  // Sync timetable with prop
  useEffect(() => {
    setTimetable(timetableData);
  }, [timetableData]);

  const handleDeleteSchedule = (dayIndex, scheduleIndex) => {
    console.log("Deleting schedule at dayIndex:", dayIndex, "scheduleIndex:", scheduleIndex);
    
    const newTimetable = [...timetable];
    if (!newTimetable[dayIndex] || !newTimetable[dayIndex].schedule) return;

    const removed = newTimetable[dayIndex].schedule[scheduleIndex];
    if (!removed) return;

    // Get the day name
    const dayName = newTimetable[dayIndex].day;

    // Call the API to delete the schedule item
    deleteScheduleItemMutation.mutate({
      combinationId: combinationId,
      day: dayName,
      scheduleIndex: scheduleIndex,
    });

    // Update local state optimistically
    newTimetable[dayIndex].schedule.splice(scheduleIndex, 1);

    if (newTimetable[dayIndex].schedule.length === 0) {
      const removedDay = newTimetable[dayIndex].day;
      newTimetable.splice(dayIndex, 1);

    }

    setTimetable(newTimetable);
  };

  const handleDeleteDay = (dayIndex) => {
    const newTimetable = [...timetable];
    if (!newTimetable[dayIndex]) return;
    
    const removedDay = newTimetable[dayIndex].day;
    
    // Call the API to delete the entire day
    deleteDayFromTimetableMutation.mutate({
      combinationId: combinationId,
      day: removedDay,
    });
    
    // Update local state optimistically
    newTimetable.splice(dayIndex, 1);
    setTimetable(newTimetable);
  };

  // Advanced: Use a modal for editing instead of prompt
  const [editModal, setEditModal] = useState({ open: false, dayIndex: null, scheduleIndex: null, data: null });

  const openEditModal = (dayIndex, scheduleIndex) => {
    const item = timetable[dayIndex].schedule[scheduleIndex];
    setEditModal({
      open: true,
      dayIndex,
      scheduleIndex,
      data: {
        subject: item.subject,
        startTime: item.startTime,
        endTime: item.endTime,
        teacherId: item.teacher._id,
        teacherFirst: item.teacher.firstName,
        teacherLast: item.teacher.lastName,
      },
    });
  };

  const handleEditChange = (e) => {
    setEditModal((prev) => ({
      ...prev,
      data: { ...prev.data, [e.target.name]: e.target.value },
    }));
  };

  const handleEditSave = () => {
    const { dayIndex, scheduleIndex, data } = editModal;
    if (!data.subject || !data.startTime || !data.endTime || !data.teacherFirst || !data.teacherLast) return;
    
    // Get the day name from the timetable
    const dayName = timetable[dayIndex].day;
    
    // Prepare update data for the API
    const updateData = {
      subject: data.subject,
      startTime: data.startTime,
      endTime: data.endTime,
      teacher: {
        _id: data.teacherId,
        firstName: data.teacherFirst,
        lastName: data.teacherLast,
      },
    };

    // Call the API to update the schedule item
    updateScheduleItemMutation.mutate({
      combinationId: combinationId,
      day: dayName,
      scheduleIndex: scheduleIndex,
      updateData: updateData,
    });

    // Update local state optimistically
    const newTimetable = [...timetable];
    newTimetable[dayIndex].schedule[scheduleIndex] = {
      subject: data.subject,
      startTime: data.startTime,
      endTime: data.endTime,
      teacher: {
        _id: data.teacherId,
        firstName: data.teacherFirst,
        lastName: data.teacherLast,
      },
    };
    setTimetable(newTimetable);
    setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null });
  };

  // Removed handleSave function since we're using individual API calls now

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Class Schedule</h3>
            <p className="text-sm text-gray-500">{timetable?.length || 0} days scheduled</p>
          </div>
        </div>
      </div>

      {/* Timetable Cards */}
      {timetable?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-semibold mb-2">No Schedule Set</h3>
          <p className="text-gray-500 text-sm">This combination doesn't have any lessons scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timetable?.map((dayBlock, dayIndex) => (
            <div key={dayBlock.day} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {dayBlock.day.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{dayBlock.day}</h4>
                      <p className="text-sm text-gray-600">{dayBlock.schedule?.length || 0} lessons</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDay(dayIndex)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Day
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="divide-y divide-gray-100">
                {dayBlock?.schedule?.map((item, i) => (
                  <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Subject */}
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{item.subject}</h5>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {item.teacher.firstName} {item.teacher.lastName}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(dayIndex, i)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Edit lesson"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(dayIndex, i)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Delete lesson"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edit Lesson</h3>
                  <p className="text-gray-500 text-sm mt-1">Update schedule details</p>
                </div>
              </div>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null })}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Subject */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Subject
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={editModal.data.subject}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter subject name"
                  disabled={true}
                />
              </div>

              {/* Time Selection */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Time Schedule
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                    <TimePicker
                      value={editModal.data.startTime ? dayjs(editModal.data.startTime, 'h:mm A') : null}
                      onChange={(time) => {
                        setEditModal((prev) => ({
                          ...prev,
                          data: { 
                            ...prev.data, 
                            startTime: time ? time.format('h:mm A') : '' 
                          },
                        }));
                      }}
                      format="h:mm A"
                      placeholder="Select start time"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                    <TimePicker
                      value={editModal.data.endTime ? dayjs(editModal.data.endTime, 'h:mm A') : null}
                      onChange={(time) => {
                        setEditModal((prev) => ({
                          ...prev,
                          data: { 
                            ...prev.data, 
                            endTime: time ? time.format('h:mm A') : '' 
                          },
                        }));
                      }}
                      format="h:mm A"
                      placeholder="Select end time"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Teacher Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Teacher Information
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">First Name</label>
                    <input
                      type="text"
                      name="teacherFirst"
                      value={editModal.data.teacherFirst}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="First name"
                      disabled={true}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="teacherLast"
                      value={editModal.data.teacherLast}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                      placeholder="Last name"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null })}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200 flex items-center gap-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={updateScheduleItemMutation.isPending}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  type="button"
                >
                  {updateScheduleItemMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <style>{`
            .animate-fade-in-up {
              animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
            }
            @keyframes fadeInUp {
              from { 
                opacity: 0; 
                transform: translateY(20px) scale(0.95);
              }
              to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Timetable;
