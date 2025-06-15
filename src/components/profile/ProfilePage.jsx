import React, { useRef, useState } from 'react';
import Sidebar from '../school/layout/Sidebar';
import { Header } from '../school/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { Camera, X, Save } from 'lucide-react';

export const ProfilePage = () => {
  const { authData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleSave = () => {
    // Here you would call the backend to upload the image
    setIsEditing(false);
    // Optionally reset selectedImage and previewUrl after upload
  };

  const getProfileImage = () => {
    if (previewUrl) return previewUrl;
    if (authData.profilePicture) return authData.profilePicture;
    return '';
  };

  const getInitials = () => {
    if (!authData.username) return '';
    return authData.username.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="text-gray-600">View and manage your profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block w-32 h-32 mx-auto mb-4">
                    {getProfileImage() ? (
                      <img
                        src={getProfileImage()}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <span className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 text-4xl text-gray-500 font-bold border-4 border-gray-200">
                        {getInitials()}
                      </span>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                      title="Change profile picture"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold">{authData.username}</h2>
                  <p className="text-gray-600 capitalize">{authData.role}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{authData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="font-medium capitalize">{authData.role}</p>
                  </div>
                  {authData.phoneNumber && (
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium">{authData.phoneNumber}</p>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Choose Image
                      </button>
                      {selectedImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          <X size={16} /> Remove
                        </button>
                      )}
                      {selectedImage && (
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Save size={16} /> Save
                        </button>
                      )}
                      <button
                        onClick={() => { setIsEditing(false); handleRemoveImage(); }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                <p className="text-gray-600">Profile editing functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 