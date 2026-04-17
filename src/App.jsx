import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import ResumeUpload from "./pages/ResumeUpload";
import { AuthProvider } from "./context/AuthContext";
import AuthModal from "./components/Auth/AuthModal";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
          <Navbar />
          <AuthModal />
          <div className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              {/* Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/job/:id" element={<JobDetails />} />
              </Route>

              {/* Seeker Only Protected Route */}
              <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
                <Route path="/resume-upload" element={<ResumeUpload />} />
              </Route>

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
