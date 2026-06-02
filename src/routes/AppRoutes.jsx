import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";

import DashboardPage from "../pages/student/DashboardPage";
import QuizzesPage from "../pages/student/QuizzesPage";
import QuizLibraryPage from "../pages/student/QuizLibraryPage";
import QuizPlayPage from "../pages/student/QuizPlayPage";
import QuizResultPage from "../pages/student/QuizResultPage";
import ProgressPage from "../pages/student/ProgressPage";
import RewardsPage from "../pages/student/RewardsPage";
import ProfilePage from "../pages/student/ProfilePage";
import SettingPage from "../pages/student/SettingPage";

import TeacherDashboardPage from "../pages/teacher/TeacherDashboardPage";
import TeacherClassesPage from "../pages/teacher/TeacherClassesPage";
import TeacherClassDetailPage from "../pages/teacher/TeacherClassDetailPage";
import TeacherStudentDetailPage from "../pages/teacher/TeacherStudentDetailPage";
import TeacherStudentsPage from "../pages/teacher/TeacherStudentsPage";
import TeacherProfilePage from "../pages/teacher/TeacherProfilePage";
import TeacherSettingPage from "../pages/teacher/TeacherSettingPage";

import NotificationPage from "../pages/NotificationPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<DashboardPage />} />
        <Route path="/student/notifications" element={<NotificationPage />} />
        <Route path="/student/quizzes" element={<QuizzesPage />} />
        <Route path="/student/quizzes/library" element={<QuizLibraryPage />} />
        <Route path="/student/quiz/play" element={<QuizPlayPage />} />
        <Route path="/student/quiz/result" element={<QuizResultPage />} />
        <Route path="/student/progress" element={<ProgressPage />} />
        <Route path="/student/rewards" element={<RewardsPage />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/settings" element={<SettingPage />} />
      </Route>

      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/teacher/notifications" element={<NotificationPage />} />
        <Route path="/teacher/classes" element={<TeacherClassesPage />} />
        <Route
          path="/teacher/classes/:classId"
          element={<TeacherClassDetailPage />}
        />
        <Route path="/teacher/students" element={<TeacherStudentsPage />} />
        <Route
          path="/teacher/students/:studentId"
          element={<TeacherStudentDetailPage />}
        />
        <Route path="/teacher/profile" element={<TeacherProfilePage />} />
        <Route path="/teacher/settings" element={<TeacherSettingPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;