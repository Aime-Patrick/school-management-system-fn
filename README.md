# School Management Portal

A modern, professional, and responsive School Management System built with **React** and **Vite**.

## Description

The School Management Portal is an all-in-one platform designed to streamline and digitize school operations. It provides role-based dashboards and tools for school administrators, teachers, and students, enabling efficient management of classes, combinations, students, teachers, and academic records. The portal features a clean, intuitive UI and supports advanced functionalities such as real-time search, profile management, secure authentication, and more.

## Key Features

- **Role-Based Dashboards:** Separate interfaces for School Admin, Teacher, and Student.
- **Class & Combination Management:** Easily create, edit, and assign combinations to classes.
- **Student & Teacher Management:** Add, edit, and view detailed profiles.
- **Secure Authentication:** Modern login with password visibility toggle and validation.
- **Responsive Design:** Fully mobile-friendly and desktop-ready.
- **Advanced UI:** Uses Tailwind CSS, PrimeReact, Ant Design, and Lucide icons for a polished look.
- **File Uploads:** Profile pictures and school logos.
- **Real-Time Search & Filtering:** Quickly find classes, students, and more.
- **Data Tables & Modals:** For efficient data management and editing.
- **Academic Year & Term Management:** Organize and manage academic years and terms.
- **Timetable Management:** Assign and view class timetables.
- **Performance Tracking:** Monitor student performance and generate report cards.
- **Messaging & Notifications:** Communicate important updates to teachers, students, and parents.
- **Payment & Subscription:** Manage school payments and subscription plans.
- **Customizable Settings:** Update account, school, and system settings from dedicated panels.
- **Audit & Security:** Role-based access control and secure data handling.

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PrimeReact](https://primereact.org/)
- [Ant Design](https://ant.design/)
- [Lucide React](https://lucide.dev/)
- [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- [date-fns](https://date-fns.org/)

## Project Structure

```
src/
  components/
    school/
    teacher/
    student/
    profile/
    settings/
  hooks/
  utils/
  App.jsx
  main.jsx
public/
  logo.jpg
  favicon.ico
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173)

## Customization

- Update branding in `/public/logo.jpg` and `/public/favicon.ico`
- Configure API endpoints in your hooks or environment files

## License

MIT
