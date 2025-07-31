import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { Camera, X, Save, Edit3, ShieldCheck, School } from 'lucide-react';
import { useCheckSchool } from '../../hooks/useCheckSchool';

export const AccountSettings = () => {
  const { authData } = useAuth();
  const { data: schoolData, isLoading: schoolLoading } = useCheckSchool();
  const { updateProfile, updateProfileLoading, changePassword, changePasswordLoading } = useProfile();

  // User fields
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [name, setName] = useState(authData.username || '');
  const [phone, setPhone] = useState(authData.phoneNumber || '');

  // School fields
  const [schoolLogo, setSchoolLogo] = useState(schoolData?.schoolLogo || '');
  const [schoolLogoFile, setSchoolLogoFile] = useState(null);
  const [schoolName, setSchoolName] = useState(schoolData?.schoolName || '');
  const [schoolCode, setSchoolCode] = useState(schoolData?.schoolCode || '');
  const [address, setAddress] = useState(schoolData?.address || '');
  const [status, setStatus] = useState(schoolData?.status || 'active');
  const [subscriptionPlan, setSubscriptionPlan] = useState(schoolData?.subscriptionPlan || '');
  const [subscriptionStart, setSubscriptionStart] = useState(schoolData?.subscriptionStart ? schoolData.subscriptionStart.slice(0,10) : '');
  const [subscriptionEnd, setSubscriptionEnd] = useState(schoolData?.subscriptionEnd ? schoolData.subscriptionEnd.slice(0,10) : '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync school fields when schoolData changes
  useEffect(() => {
    setSchoolLogo(schoolData?.schoolLogo || '');
    setSchoolName(schoolData?.schoolName || '');
    setSchoolCode(schoolData?.schoolCode || '');
    setAddress(schoolData?.address || '');
    setStatus(schoolData?.status || 'active');
    setSubscriptionPlan(schoolData?.subscriptionPlan || '');
    setSubscriptionStart(schoolData?.subscriptionStart ? schoolData.subscriptionStart.slice(0,10) : '');
    setSubscriptionEnd(schoolData?.subscriptionEnd ? schoolData.subscriptionEnd.slice(0,10) : '');
  }, [schoolData]);

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

  // School logo handlers
  const handleSchoolLogoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSchoolLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setSchoolLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveSchoolLogo = () => {
    setSchoolLogo('');
    setSchoolLogoFile(null);
  };

  // Save handler (user + school fields)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Here you would call the backend to upload the image and update info
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(authData.username || '');
    setPhone(authData.phoneNumber || '');
    setSchoolLogo(schoolData?.schoolLogo || '');
    setSchoolLogoFile(null);
    setSchoolName(schoolData?.schoolName || '');
    setSchoolCode(schoolData?.schoolCode || '');
    setAddress(schoolData?.address || '');
    setStatus(schoolData?.status || 'active');
    setSubscriptionPlan(schoolData?.subscriptionPlan || '');
    setSubscriptionStart(schoolData?.subscriptionStart ? schoolData.subscriptionStart.slice(0,10) : '');
    setSubscriptionEnd(schoolData?.subscriptionEnd ? schoolData.subscriptionEnd.slice(0,10) : '');
    handleRemoveImage();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy-800">Account Settings</h1>
              <p className="text-blue-700 text-lg">Manage your account, school, and password</p>
            </div>
            <form className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 animate-fade-in-up" onSubmit={handleSave}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Card */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    {previewUrl || authData.profilePicture ? (
                      <img
                        src={previewUrl || authData.profilePicture}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
                      />
                    ) : (
                      <span className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-100 text-4xl text-blue-600 font-bold border-4 border-blue-400 shadow">
                        {authData.username ? authData.username.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                      </span>
                    )}
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
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-navy-800 mb-1 flex items-center gap-2 justify-center">
                      {authData.username}
                      <ShieldCheck size={18} className="text-blue-400" />
                    </h2>
                    <p className="text-blue-600 capitalize mb-2">{authData.role}</p>
                    <p className="font-medium text-blue-800 break-all">{authData.email}</p>
                    {authData.phoneNumber && (
                      <p className="font-medium text-blue-800">{authData.phoneNumber}</p>
                    )}
                  </div>
                </div>
                {/* School Card */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4">
                    {schoolLogo ? (
                      <img src={schoolLogo} alt="School Logo" className="w-24 h-24 object-contain rounded-full border border-blue-200 bg-white" />
                    ) : (
                      <span className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-600 font-bold border-4 border-blue-400">No logo</span>
                    )}
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          onClick={() => document.getElementById('schoolLogoInput').click()}
                          className="absolute bottom-[-1.5rem] right-[-1.5rem] bg-navy-800 text-white p-2 rounded-full hover:bg-blue-700 shadow"
                          title="Change School Logo"
                        >
                          <Camera size={20} />
                        </button>
                        {schoolLogo && (
                          <button
                            type="button"
                            onClick={handleRemoveSchoolLogo}
                            className="absolute bottom-2 left-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow"
                            title="Remove School Logo"
                          >
                            <X size={20} />
                          </button>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="schoolLogoInput"
                          onChange={handleSchoolLogoSelect}
                        />
                      </>
                    )}
                  </div>
                  <div className="text-center mt-8">
                    <h2 className="text-xl font-bold text-navy-800 mb-1 flex items-center gap-2 justify-center">
                      <School size={20} className="text-blue-400" />
                      {schoolName || '-'}
                    </h2>
                    <p className="font-medium text-blue-800">{schoolCode || '-'}</p>
                    <p className="font-medium text-blue-800">{address || '-'}</p>
                  </div>
                </div>
              </div>
              {/* Editable Fields */}
              {isEditing && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Code</label>
                    <input
                      type="text"
                      value={schoolCode}
                      onChange={e => setSchoolCode(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      required
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    >
                      <option value="active">Active</option>
                      <option value="disactive">Disactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                    <input
                      type="text"
                      value={subscriptionPlan}
                      onChange={e => setSubscriptionPlan(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Start</label>
                    <input
                      type="date"
                      value={subscriptionStart}
                      onChange={e => setSubscriptionStart(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription End</label>
                    <input
                      type="date"
                      value={subscriptionEnd}
                      onChange={e => setSubscriptionEnd(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    />
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex gap-2 justify-end mt-8">
                {isEditing ? (
                  <>
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
                    >
                      <Save size={20} />
                    </button>
                  </>
                ) : (
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
            </form>
            {/* Password section */}
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mt-12 animate-fade-in-up delay-200">
              <h2 className="text-xl font-bold text-navy-800 mb-4">Change Password</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    aria-label="Current Password"
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    aria-label="New Password"
                    className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    setSaving(true);
                    if (currentPassword && newPassword) {
                      await new Promise((resolve) => changePassword({ currentPassword, newPassword }, resolve));
                      setCurrentPassword('');
                      setNewPassword('');
                    }
                    setSaving(false);
                  }}
                  className="px-6 py-2 bg-navy-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                  disabled={saving || changePasswordLoading}
                  title="Save Password"
                >
                  {saving || changePasswordLoading ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};