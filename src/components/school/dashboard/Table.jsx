import React, { useState } from "react";
import { useClasses } from "../../../hooks/useClasses";

const Timetable = ({ timetableData, classId }) => {
  const [timetable, setTimetable] = useState(timetableData);
  const { updateClass } = useClasses();
  const [removedSchedules, setRemovedSchedules] = useState([]);
  const [removedDays, setRemovedDays] = useState([]);
  const [isDeleteSchedule, setIsDeleteSchedule] = useState(false);

  const handleDeleteSchedule = (dayIndex, scheduleIndex) => {
    setIsDeleteSchedule(true);
    const newTimetable = [...timetable];
    const removed = newTimetable[dayIndex].schedule[scheduleIndex];

    setRemovedSchedules((prev) => [
      ...prev,
      {
        day: newTimetable[dayIndex].day,
        subject: removed.subject,
        teacherId: removed.teacher._id,
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
    const removedDay = newTimetable[dayIndex].day;

    setRemovedDays((prev) => [...prev, removedDay]);
    newTimetable.splice(dayIndex, 1);

    setTimetable(newTimetable);
  };

  const handleEdit = (dayIndex, scheduleIndex) => {
    const subject = prompt("Enter new subject:");
    const startTime = prompt("Enter new start time:");
    const endTime = prompt("Enter new end time:");
    const teacherFirst = prompt("Enter teacher first name:");
    const teacherLast = prompt("Enter teacher last name:");

    if (subject && startTime && endTime && teacherFirst && teacherLast) {
      const newTimetable = [...timetable];
      newTimetable[dayIndex].schedule[scheduleIndex] = {
        subject,
        startTime,
        endTime,
        teacher: {
          firstName: teacherFirst,
          lastName: teacherLast,
        },
      };
      setTimetable(newTimetable);
    }
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
      <table className="min-w-full border border-black text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black px-4 py-2">Day</th>
            <th className="border border-black px-4 py-2">Subject</th>
            <th className="border border-black px-4 py-2">Teacher</th>
            <th className="border border-black px-4 py-2">Time</th>
            <th className="border border-black px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((dayBlock, dayIndex) =>
            dayBlock.schedule.map((item, i) => (
              <tr key={`${dayBlock.day}-${i}`}>
                {i === 0 && (
                  <td
                    rowSpan={dayBlock.schedule.length}
                    className="border border-black px-4 py-2 font-medium"
                  >
                    {dayBlock.day}
                    <br />
                    <button
                      onClick={() => handleDeleteDay(dayIndex)}
                      className="mt-1 text-red-600 text-xs underline hover:font-bold"
                    >
                      Delete Day
                    </button>
                  </td>
                )}
                <td className="border border-black px-4 py-2">
                  {item.subject}
                </td>
                <td className="border border-black px-4 py-2">
                  {item.teacher.firstName} {item.teacher.lastName}
                </td>
                <td className="border border-black px-4 py-2">
                  {item.startTime} - {item.endTime}
                </td>
                <td className="border border-black px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(dayIndex, i)}
                    className="bg-yellow-400 px-2 py-1 text-xs rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(dayIndex, i)}
                    className="bg-red-500 px-2 py-1 text-xs text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isDeleteSchedule && (
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default Timetable;
