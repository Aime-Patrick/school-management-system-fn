import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useUsers } from '../../../hooks/useUsers';
export const CreateUser = ({visible, onClose}) => {
    const { createUsers, createUserLoading, createUserIsSuccess } = useUsers()
    const [isPassword, setIsPassword] = useState(true)
    const [isConPassword, setIsConPassword] = useState(true)
  const createUserFormik = useFormik({
          initialValues: {
              name: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
          },
          validationSchema: Yup.object({
              name: Yup.string().required('School name is required'),
              email: Yup.string().email('Invalid email address').required('Email is required'),
              phoneNumber: Yup.string().required('Phone number is required'),
              password: Yup.string().required('Password is required'),
              confirmPassword: Yup.string()
                 .required('Confirm Password is required')
                 .oneOf([Yup.ref('password'), null], 'Passwords must match'),
          }),
          onSubmit: (values) => {
              createUsers({email: values.email, password: values.password, phoneNumber:String(values.phoneNumber), username: values.name})
          },
      })

      useEffect(()=>{
        if(createUserIsSuccess){
            onClose();
            createUserFormik.resetForm()
        }
      },[createUserIsSuccess])
  
      const headerElement = (
          <div className="inline-flex align-items-center justify-content-center gap-2">
              <span className="font-bold white-space-nowrap">Create School Admin</span>
          </div>
      );
  
      return (
          <div className="card flex justify-content-center">
              <Dialog visible={visible} header={headerElement} style={{ width: '50vw' }} onHide={() => {if (!visible) return; onClose(); }}>
              <form onSubmit={createUserFormik.handleSubmit}>
                  <div className="py-2 my-2">
                    <FloatLabel>
                      <InputText
                        id="name"
                        name="name"
                        type="text"
                        className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100 "
                        onChange={createUserFormik.handleChange}
                        onBlur={createUserFormik.handleBlur}
                        value={createUserFormik.values.name}
                      />
                      <label htmlFor="name" className="text-sm">
                        Username
                      </label>
                    </FloatLabel>
                    {createUserFormik.touched.name && createUserFormik.errors.name && (
                      <div className="text-[#BA1500] text-sm" aria-live="polite">
                        {createUserFormik.errors.name}
                      </div>
                    )}
                  </div>
                  <div className="py-2 my-2">
                    <FloatLabel>
                      <InputText
                        id="email"
                        name="email"
                        type="email"
                        className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                        onChange={createUserFormik.handleChange}
                        onBlur={createUserFormik.handleBlur}
                        value={createUserFormik.values.email}
                      />
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                    </FloatLabel>
                    {createUserFormik.touched.email &&
                      createUserFormik.errors.email && (
                        <div
                          className="text-[#BA1500] text-sm"
                          aria-live="polite"
                        >
                          {createUserFormik.errors.email}
                        </div>
                      )}
                  </div>
                  <div className="py-2 my-2">
                    <FloatLabel>
                      <InputText
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                        onChange={createUserFormik.handleChange}
                        onBlur={createUserFormik.handleBlur}
                        value={createUserFormik.values.phoneNumber}
                      />
                      <label htmlFor="phoneNumber" className="text-sm">
                        phone Number
                      </label>
                    </FloatLabel>
                    {createUserFormik.touched.phoneNumber && createUserFormik.errors.phoneNumber && (
                      <div className="text-[#BA1500] text-sm" aria-live="polite">
                        {createUserFormik.errors.phoneNumber}
                      </div>
                    )}
                  </div>
                  <div className="py-2 my-2">
                    <FloatLabel>
                    <div className='relative'>
                      <InputText
                        id="password"
                        name="password"
                        type={`${isPassword ? "password" : "text"}`}
                        className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                        onChange={createUserFormik.handleChange}
                        onBlur={createUserFormik.handleBlur}
                        value={createUserFormik.values.password}
                      />
                      <i onClick={()=>setIsPassword((prev)=> !prev)} className={`absolute top-3 right-5 ${isPassword ? "pi pi-eye" : "pi pi-eye-slash"}`}></i>
                      </div>
                      <label htmlFor="password" className="text-sm">
                        Password
                      </label>
                    </FloatLabel>
                    {createUserFormik.touched.password && createUserFormik.errors.password && (
                      <div className="text-[#BA1500] text-sm" aria-live="polite">
                        {createUserFormik.errors.password}
                      </div>
                    )}
                  </div>
  
                  <div className="py-2 my-2">
                    <FloatLabel>
                    <div className='relative'>
                      <InputText
                        id="confirmPassword"
                        name="confirmPassword"
                        type={`${isConPassword ? "password" : "text"}`}
                        className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                        onChange={createUserFormik.handleChange}
                        onBlur={createUserFormik.handleBlur}
                        value={createUserFormik.values.confirmPassword}
                      />
                      <i onClick={()=>setIsConPassword((prev)=> !prev)} className={`absolute top-3 right-5 ${isConPassword? "pi pi-eye" : "pi pi-eye-slash"}`}></i>
                      </div>
                      <label htmlFor="confirmPassword" className="text-sm">
                      Confirm Password
                      </label>
                    </FloatLabel>
                    {createUserFormik.touched.confirmPassword &&
                      createUserFormik.errors.confirmPassword && (
                        <div
                          className="text-[#BA1500] text-sm"
                          aria-live="polite"
                        >
                          {createUserFormik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                  <div>
              <Button label={createUserLoading ? (
                     "saving..."
                    ) : (
                      "Save"
                    )}
                    type="submit"
                    disabled={createUserLoading}
                    className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0" icon={createUserLoading ? (
                        "pi pi-spin pi-spinner"
                      ) : (
                        "pi pi-save"
                      )} autoFocus />
          </div>
                </form>
              </Dialog>
          </div>
      )
}
