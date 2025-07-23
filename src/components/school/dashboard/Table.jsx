import React, { useState, useEffect } from "react";
import { Edit3, Trash2, Save } from "lucide-react";
import { useClasses } from "../../../hooks/useClasses";

const Timetable = ({ timetableData, classId }) => {
  const [timetable, setTimetable] = useState([]);
  const { updateClass, updateClassLoading } = useClasses();
  const [removedSchedules, setRemovedSchedules] = useState([]);
  const [removedDays, setRemovedDays] = useState([]);
  const [isDeleteSchedule, setIsDeleteSchedule] = useState(false);

  // Sync timetable with prop
  useEffect(() => {
    setTimetable(timetableData);
  }, [timetableData]);

  const handleDeleteSchedule = (dayIndex, scheduleIndex) => {
    console.log("Deleting schedule at dayIndex:", dayIndex, "scheduleIndex:", scheduleIndex);
    setIsDeleteSchedule(true);
    const newTimetable = [...timetable];
    if (!newTimetable[dayIndex] || !newTimetable[dayIndex].schedule) return;

    const removed = newTimetable[dayIndex].schedule[scheduleIndex];
    if (!removed) return;

    setRemovedSchedules((prev) => [
      ...prev,
      {
        day: newTimetable[dayIndex].day,
        subject: removed.subject,
        teacherId: removed.teacher?._id,
        startTime: removed.startTime,
        endTime: removed.endTime,
      },
    ]);

    newTimetable[dayIndex].schedule.splice(scheduleIndex, 1);

    if (newTimetable[dayIndex].schedule.length === 0) {
      const removedDay = newTimetable[dayIndex].day;
      newTimetable.splice(dayIndex, 1);
      setRemovedDays((prev) => [...prev, removedDay]);
    }

    setTimetable(newTimetable);
  };

  const handleDeleteDay = (dayIndex) => {
    setIsDeleteSchedule(true);
    const newTimetable = [...timetable];
    if (!newTimetable[dayIndex]) return;
    const removedDay = newTimetable[dayIndex].day;
    setRemovedDays((prev) => [...prev, removedDay]);
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
    const newTimetable = [...timetable];
    newTimetable[dayIndex].schedule[scheduleIndex] = {
      subject: data.subject,
      startTime: data.startTime,
      endTime: data.endTime,
      teacher: {
        firstName: data.teacherFirst,
        lastName: data.teacherLast,
      },
    };
    setTimetable(newTimetable);
    setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null });
  };

  const handleSave = () => {
    const payload = {
      timetable,
      removeSchedules: removedSchedules,
      removeDays: removedDays,
    };
    updateClass({ id: classId, classData: payload });
    setIsDeleteSchedule(false);
  };

  return (
    <div className="overflow-x-auto space-y-4">
      <div className="rounded-xl shadow border border-blue-100 bg-white overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-blue-50 text-navy-800">
              <th className="px-4 py-3 font-semibold">Day</th>
              <th className="px-4 py-3 font-semibold">Subject</th>
              <th className="px-4 py-3 font-semibold">Teacher</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetable?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  No timetable set for this class/combination.
                </td>
              </tr>
            )}
            {timetable?.map((dayBlock, dayIndex) =>
              dayBlock?.schedule?.map((item, i) => (
                <tr key={`${dayBlock.day}-${i}`} className="border-b last:border-b-0">
                  {i === 0 && (
                    <td
                      rowSpan={dayBlock?.schedule.length}
                      className="px-4 py-3 font-medium align-top bg-blue-50"
                    >
                      <div className="flex flex-col gap-1">
                        <span>{dayBlock.day}</span>
                        <button
                          onClick={() => handleDeleteDay(dayIndex)}
                          className="mt-2 text-xs text-red-600 hover:underline"
                        >
                          Delete Day
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3">{item.subject}</td>
                  <td className="px-4 py-3">{item.teacher.firstName} {item.teacher.lastName}</td>
                  <td className="px-4 py-3">{item.startTime} - {item.endTime}</td>
                  <td className="px-4 py-3 text-center flex gap-2 items-center">
                    <button
                      onClick={() => openEditModal(dayIndex, i)}
                      className="inline-flex items-center justify-center bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full p-2 mr-2 transition"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(dayIndex, i)}
                      className="inline-flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-2 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isDeleteSchedule && (
        <button
          onClick={handleSave}
          disabled={updateClassLoading}
          className="flex items-center gap-2 bg-navy-800 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          {updateClassLoading && (
            <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          <Save size={18} />
          Save Changes
        </button>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-blue-600"
              onClick={() => setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null })}
              aria-label="Close"
            >
              <span className="text-xl">&times;</span>
            </button>
            <h3 className="text-lg font-bold text-navy-800 mb-4">Edit Schedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={editModal.data.subject}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    name="startTime"
                    value={editModal.data.startTime}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="text"
                    name="endTime"
                    value={editModal.data.endTime}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher First Name</label>
                  <input
                    type="text"
                    name="teacherFirst"
                    value={editModal.data.teacherFirst}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Last Name</label>
                  <input
                    type="text"
                    name="teacherLast"
                    value={editModal.data.teacherLast}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditModal({ open: false, dayIndex: null, scheduleIndex: null, data: null })}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 rounded-lg bg-navy-800 text-white hover:bg-blue-700 transition font-semibold"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <style>{`
            .animate-fade-in-up {
              animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1) both;
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Timetable;
