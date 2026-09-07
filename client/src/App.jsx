import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import RouterConfig from "./config/RouterConfig";
import { Toaster } from "react-hot-toast";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <RouterConfig />
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
