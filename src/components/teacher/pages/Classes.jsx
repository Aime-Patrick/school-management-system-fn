import React, { useState } from "react";
import { Download, Upload } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useClassBySchoolId } from "../../../hooks/useClassesBySchoolId";


const students = [
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
  {
    id: 1,
    name: "Burigo Jabes",
    email: "peaceamizero@gmail.com",
    marks: { term1: 30, term2: 30, term3: 30 },
  },
];

export const Classes = () => {
  const { authData } = useAuth();
  const { classes, isLoading } = useClassBySchoolId(authData?.schoolId);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("A");
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const DeductMarksModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-900">Edit Deducted Marks</h3>
          <button
            onClick={() => setShowDeductModal(false)}
            className="text-gray-400 hover:text-blue-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Student's Name
            </label>
            <input
              type="text"
              value={selectedStudent?.name || ""}
              disabled
              className="w-full p-2 bg-gray-100 rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Deducted Marks
            </label>
            <input
              type="number"
              defaultValue={4}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Reason</label>
            <textarea className="w-full p-2 border rounded h-24" />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            onClick={() => setShowDeductModal(false)}
          >
            Save
          </button>
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
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Classes</h2>
      {(!classes || classes.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow">
          <img src="/no-data-animate.svg" alt="No Classes" className="w-32 h-32 mb-4 opacity-80" />
          <p className="text-blue-700 font-semibold text-lg mb-2">No classes found</p>
          <p className="text-gray-500 text-sm">You have not been assigned to any classes yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`p-6 rounded-xl text-center shadow border transition-all duration-150
                  ${selectedClass === cls.id
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : "bg-white text-blue-900 hover:bg-blue-50"
                  }`}
              >
                <span className="block text-lg font-semibold">{cls.name}</span>
                <span className="block text-xs text-blue-400 mt-1">{cls.section || "Section"}</span>
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="bg-white rounded-xl shadow p-6 animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex space-x-2">
                  {["A", "B", "C", "D"].map((section) => (
                    <button
                      key={section}
                      onClick={() => setSelectedSection(section)}
                      className={`px-4 py-2 rounded-lg font-medium transition
                        ${selectedSection === section
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-blue-900 hover:bg-blue-50"
                        }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                    <Download className="h-5 w-5" />
                    <span>Download Excel</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                    <Upload className="h-5 w-5" />
                    <span>Upload Excel</span>
                  </button>
                </div>
              </div>

              {(!students || students.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <img src="/empty-students.svg" alt="No Students" className="w-20 h-20 mb-2 opacity-80" />
                  <p className="text-blue-700 font-semibold mb-1">No students found</p>
                  <p className="text-gray-500 text-sm">No students are enrolled in this class yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">#</th>
                        <th className="text-left py-2">Student Name</th>
                        <th className="text-left py-2">Email</th>
                        <th className="text-left py-2">Term 1</th>
                        <th className="text-left py-2">Term 2</th>
                        <th className="text-left py-2">Term 3</th>
                        <th className="text-left py-2">Deduct</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, idx) => (
                        <tr key={student.id} className="border-b">
                          <td className="py-2">{idx + 1}</td>
                          <td className="py-2">{student.name}</td>
                          <td className="py-2">{student.email}</td>
                          <td className="py-2">{student.marks.term1}/40</td>
                          <td className="py-2">{student.marks.term2}/40</td>
                          <td className="py-2">{student.marks.term3}/40</td>
                          <td className="py-2">
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowDeductModal(true);
                              }}
                              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition"
                            >
                              -
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showDeductModal && <DeductMarksModal />}
    </div>
  );
};
