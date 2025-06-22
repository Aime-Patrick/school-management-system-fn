import React from "react";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const transformTimetable = (timetable) => {
  const timeMap = {};

  timetable.forEach(({ day, schedule }) => {
    schedule.forEach(({ subject, startTime, endTime, teacher }) => {
      const time = `${startTime} - ${endTime}`;
      if (!timeMap[time]) {
        timeMap[time] = {
          time,
          subjects: Array(5).fill(null), // Mon to Fri
        };
      }

      const dayIndex = weekdays.indexOf(day);
      if (dayIndex !== -1) {
        timeMap[time].subjects[dayIndex] = {
          subject,
          teacher: `${teacher.firstName} ${teacher.lastName}`,
        };
      }
    });
  });

  // Return sorted by time (optional enhancement: sort by time)
  return Object.values(timeMap);
};

const TimetableTable = ({ timetableData }) => {
  const transformed = transformTimetable(timetableData);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse border border-gray-200">
        <thead>
          <tr className="bg-blue-100 text-gray-700">
            <th className="px-4 py-3 text-left border border-gray-200">
              Time
            </th>
            {weekdays.map((day) => (
              <th
                key={day}
                className="px-4 py-3 text-left border border-gray-200"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformed.map((slot, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
              } hover:bg-blue-50`}
            >
              <td className="px-4 py-3 font-medium border border-gray-200">
                {slot.time}
              </td>
              {slot.subjects.map((subject, idx) => (
                <td
                  key={idx}
                  className="px-4 py-3 text-sm border border-gray-200"
                >
                  {subject ? (
                    <div className="space-y-1">
                      <div className="font-semibold text-blue-700">
                        {subject.subject}
                      </div>
                      <div className="text-gray-500">{subject.teacher}</div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">—</div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableTable;
