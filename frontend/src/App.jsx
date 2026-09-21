import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ToursPage from './pages/public/ToursPage';
import TourDetailsPage from './pages/public/TourDetailsPage';
import TourComparisonPage from './pages/public/TourComparisonPage';
import DestinationsPage from './pages/public/DestinationsPage';
import DestinationDetailsPage from './pages/public/DestinationDetailsPage';
import CustomTripPlannerPage from './pages/public/CustomTripPlannerPage';
import BookingWizard from './components/booking/BookingWizard';
import {
  UpcomingDeparturesPage,
  OffersPage,
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  CancellationPolicyPage
} from './pages/public/OtherPublicPages';

// Customer Pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/customer/AuthPages';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import { MyBookingsPage, BookingDetailsPage } from './pages/customer/MyBookingsPage';
import {
  CustomerProfilePage,
  CustomerFavouritesPage,
  CustomerEnquiriesPage
} from './pages/customer/CustomerExtraPages';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminToursPage from './pages/admin/AdminToursPage';
import {
  AdminBookingsPage,
  AdminCustomersPage,
  AdminPaymentsPage,
  AdminEnquiriesPage,
  AdminReviewsPage,
  AdminCouponsPage
} from './pages/admin/AdminOperationsPages';

// Protected Route Helpers
function ProtectedCustomerRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'STAFF')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <CompareProvider>
                  <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/tours" element={<ToursPage />} />
                      <Route path="/tours/:slug" element={<TourDetailsPage />} />
                      <Route path="/compare" element={<TourComparisonPage />} />
                      <Route path="/destinations" element={<DestinationsPage />} />
                      <Route path="/destinations/:slug" element={<DestinationDetailsPage />} />
                      <Route path="/custom-trip-planner" element={<CustomTripPlannerPage />} />
                      <Route path="/upcoming-departures" element={<UpcomingDeparturesPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/why-choose-us" element={<AboutPage />} />
                      <Route path="/faqs" element={<HomePage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
                      <Route path="/booking" element={<BookingWizard />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    </Route>

                    {/* Customer Portal (Protected) */}
                    <Route
                      path="/customer"
                      element={
                        <ProtectedCustomerRoute>
                          <CustomerLayout />
                        </ProtectedCustomerRoute>
                      }
                    >
                      <Route index element={<Navigate to="/customer/dashboard" replace />} />
                      <Route path="dashboard" element={<CustomerDashboardPage />} />
                      <Route path="bookings" element={<MyBookingsPage />} />
                      <Route path="bookings/:id" element={<BookingDetailsPage />} />
                      <Route path="favourites" element={<CustomerFavouritesPage />} />
                      <Route path="enquiries" element={<CustomerEnquiriesPage />} />
                      <Route path="profile" element={<CustomerProfilePage />} />
                    </Route>

                    {/* Admin Console (Protected) */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedAdminRoute>
                          <AdminLayout />
                        </ProtectedAdminRoute>
                      }
                    >
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboardPage />} />
                      <Route path="tours" element={<AdminToursPage />} />
                      <Route path="bookings" element={<AdminBookingsPage />} />
                      <Route path="customers" element={<AdminCustomersPage />} />
                      <Route path="payments" element={<AdminPaymentsPage />} />
                      <Route path="enquiries" element={<AdminEnquiriesPage />} />
                      <Route path="reviews" element={<AdminReviewsPage />} />
                      <Route path="coupons" element={<AdminCouponsPage />} />
                      <Route path="faqs" element={<AdminOperationsPagesFaqs />} />
                    </Route>

                    {/* Catch-all Redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </CompareProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

function AdminOperationsPagesFaqs() {
  return (
    <div className="text-white space-y-4">
      <h1 className="text-2xl font-bold">Frequently Asked Questions Management</h1>
      <p className="text-xs text-slate-400">Manage FAQ questions and answers displayed on the public portal.</p>
    </div>
  );
}

