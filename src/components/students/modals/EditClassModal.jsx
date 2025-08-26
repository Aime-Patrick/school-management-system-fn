import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Loader, Users } from 'lucide-react';
import { useClasses } from '../../../hooks/useClasses';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const EditClassModal = ({ classData = {}, onClose, isOpen }) => {
  // This conditional return must be the very first statement in the component, before any hooks.
  if (!isOpen) {
    return null;
  }

  const [formData, setFormData] = useState({ name: '' });
  const [selectedCombId, setSelectedCombId] = useState(null);
  const { updateClass: updateClassMutation, updateClassLoading } = useClasses();
  const overlayRef = useRef(null);

  const combinations = useMemo(() => {
    return Array.isArray(classData.combinations) ? classData.combinations : [];
  }, [classData]);

  useEffect(() => {
    if (isOpen && classData) {
      setFormData({ name: classData.name || '' });
      // Default to first combination
      setSelectedCombId(combinations[0]?._id ?? null);
    }
  }, [isOpen, classData, combinations]);

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!classData?._id) return;
    updateClassMutation(
      { id: classData._id, data: { name: formData.name?.trim() } },
      { onSettled: () => onClose() }
    );
  };

  const selectedComb = useMemo(
    () => combinations.find((c) => c._id === selectedCombId) || null,
    [combinations, selectedCombId]
  );

  const formatDate = (v) => {
    if (!v) return '—';
    const d = new Date(v);
    return isNaN(d) ? '—' : d.toLocaleDateString();
  };

  const studentRows = useMemo(() => {
    const list = Array.isArray(selectedComb?.students) ? selectedComb.students : [];
    return list.map((st, idx) => {
      const fullName =
        st?.fullName || [st?.firstName, st?.lastName].filter(Boolean).join(' ') || `Student ${idx + 1}`;
      return {
        _id: st?._id || st?.id || `s-${idx}`,
        registrationNumber: st?.registrationNumber ?? '—',
        fullName,
        gender: st?.gender ?? '—',
        dateOfBirth: st?.dateOfBirth ?? null,
        phoneNumber: st?.phoneNumber ?? '—',
        address: st?.address ?? '—',
        city: st?.city ?? '—',
        enrollmentDate: st?.enrollmentDate ?? null,
      };
    });
  }, [selectedComb]);

  const combOptions = combinations.map((c) => ({
    label: `${c.name} (${Array.isArray(c.students) ? c.students.length : 0})`,
    value: c._id,
  }));

  const totalStudents =
    combinations.reduce((acc, c) => acc + (Array.isArray(c.students) ? c.students.length : 0), 0) || 0;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl w-full max-w-7xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Edit Class{classData?.name ? ` — ${classData.name}` : ''}
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              {combinations.length} combinations • {totalStudents} students total
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Left column: Class info */}
            <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
              <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  id="className"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Year 1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-navy-800 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={updateClassLoading || formData.name?.trim() === (classData?.name || '').trim()}
              >
                {updateClassLoading && <Loader size={16} className="animate-spin" />}
                Save Changes
              </button>

              <div className="hidden md:block border-t pt-4">
                <p className="text-sm text-gray-600">
                  Tip: You can also manage combinations and preview students on the right.
                </p>
              </div>
            </form>

            {/* Right column: Comb + Students */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 min-w-[120px]">Combination</label>
                <Dropdown
                  value={selectedCombId}
                  options={combOptions}
                  onChange={(e) => setSelectedCombId(e.value)}
                  placeholder="Select combination"
                  className="w-full md:w-80"
                  showClear
                />
              </div>

              {!selectedCombId && (
                <div className="text-sm text-gray-500 flex items-center gap-2 p-3 bg-gray-50 rounded">
                  <Users size={16} className="text-gray-400" />
                  Select a combination to view its students.
                </div>
              )}

              {selectedCombId && (
                <div className="bg-white rounded-md border">
                  <DataTable
                    value={studentRows}
                    dataKey="_id"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    stripedRows
                    className="text-sm"
                    responsiveLayout="scroll"
                    emptyMessage="No students found."
                  >
                    <Column header="#" body={(_, o) => (o?.rowIndex ?? 0) + 1} style={{ width: '3rem' }} />
                    <Column field="registrationNumber" header="Reg. No" />
                    <Column field="fullName" header="Full Name" />
                    <Column field="gender" header="Gender" style={{ width: '7rem' }} />
                    <Column header="DOB" body={(r) => formatDate(r.dateOfBirth)} style={{ width: '8rem' }} />
                    <Column field="phoneNumber" header="Phone" style={{ width: '10rem' }} />
                    <Column field="address" header="Address" />
                    <Column field="city" header="City" style={{ width: '8rem' }} />
                    <Column header="Enrolled" body={(r) => formatDate(r.enrollmentDate)} style={{ width: '8rem' }} />
                  </DataTable>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
