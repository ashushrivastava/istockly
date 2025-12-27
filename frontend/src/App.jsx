// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import AddCoursePage from './pages/AddCoursePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import OfflinePage from './pages/OfflinePage';
import OfflineCentersPage from './pages/OfflineCentersPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import CancellationRefundPage from './pages/CancellationRefundPage';
import ComingSoon from './components/ComingSoon';
import ProtectedRoute from './components/ProtectedRoute';

// Live Program imports
import AdminLiveProgramsPage from './pages/AdminLiveProgramsPage';
import AddLiveProgramPage from './pages/AddLiveProgramPage';
import LiveWebinarsPage from './pages/LiveWebinarsPage';
import LiveMentorshipPage from './pages/LiveMentorshipPage';
import LiveWorkshopsPage from './pages/LiveWorkshopsPage';
import LiveGuidancePage from './pages/LiveGuidancePage';
import LiveProgramDetailPage from './pages/LiveProgramDetailPage';
import LiveProgramCheckoutPage from './pages/LiveProgramCheckoutPage';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <div className="min-h-screen bg-black text-white flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/checkout/:slug" element={<CheckoutPage />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              
              {/* Live Program Routes - Public */}
              <Route path="/live/webinars" element={<LiveWebinarsPage />} />
              <Route path="/live/mentorship" element={<LiveMentorshipPage />} />
              <Route path="/live/workshops" element={<LiveWorkshopsPage />} />
              <Route path="/live/guidance" element={<LiveGuidancePage />} />
              <Route path="/live/:type/:slug" element={<LiveProgramDetailPage />} />
              <Route path="/live-checkout/:type/:slug" element={<LiveProgramCheckoutPage />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/courses/add" 
                element={
                  <ProtectedRoute adminOnly>
                    <AddCoursePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/courses/edit/:id" 
                element={
                  <ProtectedRoute adminOnly>
                    <AddCoursePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Live Program Routes */}
              <Route 
                path="/admin/live-programs" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLiveProgramsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/live-programs/add" 
                element={
                  <ProtectedRoute adminOnly>
                    <AddLiveProgramPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/live-programs/edit/:id" 
                element={
                  <ProtectedRoute adminOnly>
                    <AddLiveProgramPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Payment Routes */}
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              <Route path="/payment/callback" element={<PaymentSuccess />} />
              
              {/* Offline Program Routes */}
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="/offline/centers" element={<OfflineCentersPage />} />
              
              {/* Support Routes */}
              <Route path="/cancellation-refund" element={<CancellationRefundPage />} />
              
              {/* Coming Soon Routes */}
              <Route path="/classroom" element={<ComingSoon pageName="Classroom Program" />} />
              <Route path="/webinars" element={<ComingSoon pageName="Webinars" />} />
              <Route path="/mentorship" element={<ComingSoon pageName="Mentorship" />} />
              <Route path="/investment/*" element={<ComingSoon pageName="Investment" />} />
              <Route path="/investment/mutual-funds" element={<ComingSoon pageName="Mutual Funds" />} />
              <Route path="/investment/digital-gold" element={<ComingSoon pageName="Digital Gold" />} />
              <Route path="/investment/fixed-deposits" element={<ComingSoon pageName="Fixed Deposits" />} />
              <Route path="/investment/insurance" element={<ComingSoon pageName="Insurance" />} />
              <Route path="/investment/ai-calculator" element={<ComingSoon pageName="AI Calculator" />} />
              <Route path="/blog" element={<ComingSoon pageName="Blog" />} />
              <Route path="/about" element={<ComingSoon pageName="About Us" />} />
              <Route path="/contact" element={<ComingSoon pageName="Contact Us" />} />
              <Route path="/faq" element={<ComingSoon pageName="FAQ" />} />
              <Route path="/privacy" element={<ComingSoon pageName="Privacy Policy" />} />
              <Route path="/terms" element={<ComingSoon pageName="Terms & Conditions" />} />
              
              {/* 404 */}
              <Route path="*" element={<ComingSoon pageName="Page Not Found" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;