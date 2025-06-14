
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormationPage from "./components/FormationPage";
import AdminDashboard from "./components/AdminDashboard";
import FeedbackSystem from "./components/FeedbackSystem";
import OrderPage from "./components/OrderPage";
import Cart from "./components/Cart";
import CheckoutPage from "./components/CheckoutPage";
import { AuthProvider } from "./contexts/AuthProvider";
import AuthPage from "./pages/AuthPage";
import HomePage from "./components/HomePage";
import ShopPage from "./components/ShopPage";
import CoursesPage from "./components/CoursesPage";
import NotificationsFeed from "./components/NotificationsFeed";
import ProfilePage from "./components/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Index />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/notifications" element={<NotificationsFeed />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/formation/:id" element={<FormationPage />} />
            <Route path="/order/:videoId" element={<OrderPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/feedback" element={<FeedbackSystem />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
