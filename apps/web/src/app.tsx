import { useEffect, useState } from "react";
import { Button } from "@growfuse/ui/components/button";
import { Route, Routes } from "react-router-dom";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import LandingPage from "./pages/LandingPage";

function App() {
  const [count, setCount] = useState(2);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
    </Routes>
  );
}

export default App;
