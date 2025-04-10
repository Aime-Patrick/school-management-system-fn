import React, { useState } from 'react';
import { Button } from 'primereact/button';
import AddSchool from '../../school/dashboard/AddSchool';
import { useSchools } from '../../../hooks/useSchool';
const SchoolsList = () => {
  const { schools, isLoading } = useSchools();
  const [visible, setVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const handleDeleteClick = (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
   
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSchool(null);
  };

  const handleLockClick = (school) => {
    console.log(`Locking school: ${school.name}`);
    // Implement lock functionality here
  };

  const convertDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  }
  if (isLoading) {
    return <div>loading</div>
  }

  return (
    <div className="p-6">
      <div className='flex justify-between mb-4'>
      <h2 className="text-2xl font-bold">Schools Lists</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 divide-y divide-slate-100">
          <thead>
            <tr>
              <th className="py-2 px-4 ">Logo</th>
              <th className="py-2 px-4 ">School Code</th>
              <th className="py-2 px-4 ">School Admin</th>
              <th className="py-2 px-4 ">School Name</th>
              <th className="py-2 px-4 ">School Email</th>
              <th className="py-2 px-4 ">Status</th>
              <th className="py-2 px-4 ">Create Date</th>
              <th className="py-2 px-4 ">Action</th>
            </tr>
          </thead>
          <tbody>
            {schools.length > 0 ? schools.map((school) => (
              <tr key={school._id}>
                <td className="py-2 px-4 ">
                  <img src={school.schoolLogo} alt={`${school.schoolName} Logo`} className="w-12 h-12 rounded" />
                </td>
                <td className="py-2 px-4 ">{school.schoolCode}</td>
                <td className="py-2 px-4 ">{school.schoolAdmin.username}</td>
                <td className="py-2 px-4 ">{school.schoolName}</td>
                <td className="py-2 px-4 ">{school.email || school?.schoolAdmin?.email}</td>
                <td className="py-2 px-4 ">{school.status}</td>
                <td className="py-2 px-4 ">{convertDate(school.createdAt)}</td>
                <td className="py-2 px-4  flex lg:flex-row flex-col items-center justify-center">
                  <button className="text-blue-500" onClick={() => console.log('Edit', school._id)}><i className='pi pi-pencil'></i></button>
                  <button className="text-red-500 ml-4" onClick={() => handleDeleteClick(school)}><i className='pi pi-trash'></i></button>
                  <button className="text-yellow-500 ml-4" onClick={() => handleLockClick(school)}><i className='pi pi-lock'></i></button>
                </td>
              </tr>
            )) : <p>NO SCHOOL FOUND</p>
            }
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Are you sure you want to delete this School?</h3>
            <div className="mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={confirmDelete}>Delete</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {visible && <AddSchool onClose={()=> setVisible(false)} visible={visible}/>}
    </div>
  );
};

export default SchoolsList;