import React from 'react';

export const LessonTableHeader = () => (
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">#</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Lesson code</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Lesson Name</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Department</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Credits</th>
      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">status</th>
      <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Action</th>
    </tr>
  </thead>
);