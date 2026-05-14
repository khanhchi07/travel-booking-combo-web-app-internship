import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ComboDetailPage from '../pages/ComboDetailPage';
import BookingPage from '../pages/BookingPage';
import AdminBookingsPage from '../pages/AdminBookingsPage';
import AdminCombosPage from '../pages/AdminCombosPage';
import AdminPromotionsPage from '../pages/AdminPromotionsPage';
import BookingSuccessPage from '../pages/bookingSuccessPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/combos/:id" element={<ComboDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />

        <Route
          path="/booking-success"
          element={<BookingSuccessPage />}
        />

        <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/combos" element={<AdminCombosPage />} />
        <Route path="/admin/promotions" element={<AdminPromotionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}