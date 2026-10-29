import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  AcademyOverviewPage,
  CoursesPage,
  EnrollmentsPage,
  StudentsPage,
  InstructorsPage,
} from "../pages";

import AppLayout from "../components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<AcademyOverviewPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="instructors" element={<InstructorsPage />} />
          <Route path="enrollments" element={<EnrollmentsPage />} />
        </Route>

        <Route
          path="*"
          element={<h1 className="p-6">Page Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}