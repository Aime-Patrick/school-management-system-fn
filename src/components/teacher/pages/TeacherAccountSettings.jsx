import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Save, Edit3 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useTeacherById } from '../../../hooks/useTeacherById';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'Math', label: 'Math' },
  { value: 'Science', label: 'Science' },
  { value: 'English', label: 'English' },
  { value: 'History', label: 'History' },
  { value: 'Other', label: 'Other' },
];

const TeacherAccountSettings = () => {
  const { authData } = useAuth();
  const { teacher, isLoading } = useTeacherById(authData?.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFirstName(teacher.firstName || '');
      setLastName(teacher.lastName || '');
      setGender(teacher.gender || '');
      setDateOfBirth(teacher.dateOfBirth ? teacher.dateOfBirth.slice(0,10) : '');
      setDepartment(teacher.department || '');
      setPhone(teacher.accountCredentails?.phoneNumber || '');
      setEmail(teacher.accountCredentails?.email || '');
      setAddress(teacher.address || '');
      setCity(teacher.city || '');
      setAbout(teacher.about || '');
    }
  }, [teacher]);

  // Profile image handlers
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Call backend to update teacher info and upload image
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (teacher) {
      setFirstName(teacher.firstName || '');
      setLastName(teacher.lastName || '');
      setGender(teacher.gender || '');
      setDateOfBirth(teacher.dateOfBirth ? teacher.dateOfBirth.slice(0,10) : '');
      setDepartment(teacher.department || '');
      setPhone(teacher.accountCredentails?.phoneNumber || '');
      setEmail(teacher.accountCredentails?.email || '');
      setAddress(teacher.address || '');
      setCity(teacher.city || '');
      setAbout(teacher.about || '');
    }
    handleRemoveImage();
  };

  if (isLoading || !teacher) {
    return <div className="text-center text-blue-700 font-semibold py-12">Loading...</div>;
  }

  const fullName = `${firstName} ${lastName}`;
  const avatar = previewUrl || teacher.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow border border-blue-100 p-6 mt-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Account Settings</h1>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2 bg-navy-800 text-white rounded-full hover:bg-blue-700 shadow"
            title="Edit"
          >
            <Edit3 size={20} />
          </button>
        )}
      </div>
      <form onSubmit={handleSave}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative inline-block w-32 h-32 mb-2">
            <img
              src={avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
            />
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-navy-800 text-white p-2 rounded-full hover:bg-blue-700 shadow"
                  title="Change Image"
                >
                  <Camera size={20} />
                </button>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute bottom-2 left-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow"
                    title="Remove"
                  >
                    <X size={20} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            >
              <option value="">Select Department</option>
              {DEPARTMENT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              required
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">About/Bio</label>
          <textarea
            value={about}
            onChange={e => setAbout(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            rows={3}
            disabled={!isEditing}
          />
        </div>
        {isEditing && (
          <div className="flex gap-2 justify-end mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow"
              title="Cancel"
            >
              <X size={20} />
            </button>
            <button
              type="submit"
              className="p-2 bg-navy-800 text-white rounded-full hover:bg-blue-700 shadow"
              title="Save"
              disabled={saving}
            >
              <Save size={20} />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TeacherAccountSettings; 