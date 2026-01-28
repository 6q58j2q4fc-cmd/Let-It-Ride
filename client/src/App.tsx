import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Affiliate from "./pages/Affiliate";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import Admin from "./pages/Admin";
import Rentals from "./pages/Rentals";
import Service from "./pages/Service";
import Gallery from "./pages/Gallery";
import Urtopia from "./pages/Urtopia";
import BookingSuccess from "./pages/BookingSuccess";
import OrderSuccess from "./pages/OrderSuccess";
import { EmailPopup } from "./components/EmailPopup";
import { CustomerServiceChat } from "./components/CustomerServiceChat";
import { CartProvider } from "./contexts/CartContext";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/tours/:slug" component={TourDetail} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:slug" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/rentals" component={Rentals} />
      <Route path="/service" component={Service} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/urtopia" component={Urtopia} />
      <Route path="/booking-success" component={BookingSuccess} />
      <Route path="/order-success" component={OrderSuccess} />
      
      {/* Affiliate pages */}
      <Route path="/affiliate" component={Affiliate} />
      <Route path="/affiliate/dashboard" component={AffiliateDashboard} />
      
      {/* Admin panel */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/:section" component={Admin} />
      
      {/* Custom Admin Login (separate from Manus OAuth) */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin-panel" component={AdminPanel} />
      
      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <EmailPopup />
            <CustomerServiceChat />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
