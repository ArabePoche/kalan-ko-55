
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FormationPage from "./components/FormationPage";
import OrderPage from "./components/OrderPage";
import Cart from "./components/Cart";
import CheckoutPage from "./components/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import { AuthProvider } from "./contexts/AuthProvider";
import AuthPage from "./pages/AuthPage";
import HomePage from "./components/HomePage";
import ShopPage from "./components/ShopPage";
import CoursesPage from "./components/CoursesPage";
import NotificationsFeed from "./components/NotificationsFeed";
import ProfilePage from "./components/ProfilePage";
import GlobalNavigation from "./components/GlobalNavigation";

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
            
            {/* Page admin */}
            <Route path="/admin" element={
              <div className="min-h-screen bg-background">
                <AdminPage />
              </div>
            } />
            
            {/* Pages avec navigation globale */}
            <Route path="/formation/:id" element={
              <div className="min-h-screen bg-background">
                <GlobalNavigation />
                <div className="pt-12">
                  <FormationPage />
                </div>
              </div>
            } />
            
            <Route path="/order/:videoId" element={
              <div className="min-h-screen bg-background">
                <GlobalNavigation />
                <div className="pt-12">
                  <OrderPage />
                </div>
              </div>
            } />
            
            <Route path="/cart" element={
              <div className="min-h-screen bg-background">
                <GlobalNavigation />
                <div className="pt-12">
                  <Cart />
                </div>
              </div>
            } />
            
            <Route path="/checkout" element={
              <div className="min-h-screen bg-background">
                <GlobalNavigation />
                <div className="pt-12">
                  <CheckoutPage />
                </div>
              </div>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
