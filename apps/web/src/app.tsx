import { useEffect, useState } from "react";
import { Button } from "@growfuse/ui/components/button";
import { Route, Routes } from "react-router-dom";
import Page1 from "./pages/page-1";
import Page2 from "./pages/page-2";
import LandingPage from "./pages/landing-page";

function App() {
  const [count, setCount] = useState(2);

  useEffect(() => {}, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
    </Routes>
  );
}

export default App;
