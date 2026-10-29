import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, type NavTab } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

const pathByTab: Record<NavTab, string> = {
  overview: "/",
  courses: "/courses",
  instructors: "/instructors",
  students: "/students",
  enrollments: "/enrollments",
};

const tabByPath: Record<string, NavTab> = {
  "/": "overview",
  "/courses": "courses",
  "/instructors": "instructors",
  "/students": "students",
  "/enrollments": "enrollments",
};

const tabMetadata: Record<NavTab, { title: string; subtitle: string }> = {
  overview: {
    title: "Academy Command Center",
    subtitle: "Institutional Management & Academic Operations",
  },
  courses: {
    title: "Course Catalog & Curriculum",
    subtitle: "Curriculum Offerings, Syllabi & Department Distribution",
  },
  instructors: {
    title: "Faculty & Staff Directory",
    subtitle: "Instructor Rosters, Compensation & Leadership",
  },
  students: {
    title: "Student Admissions & Registry",
    subtitle: "Admitted Students, Demographics & Academic Profiles",
  },
  enrollments: {
    title: "Enrollments & Academic Progress",
    subtitle: "Cohort Registrations, Milestone Tracking & Final Grades",
  },
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeTab =
    tabByPath[location.pathname.toLowerCase()] ?? "overview";

  const handleTabChange = (tab: NavTab) => {
    navigate(pathByTab[tab]);
    setIsMobileOpen(false);
  };

  const currentMeta = tabMetadata[activeTab] || tabMetadata.overview;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar
          onMobileMenuToggle={() => setIsMobileOpen(true)}
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
