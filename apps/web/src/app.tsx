import { Route, Routes } from "react-router-dom";
import LandingPage from "~/pages/landing-page";
import Page1 from "~/pages/page-1";
import Page2 from "~/pages/page-2";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/page1" element={<Page1 />} />
      <Route path="/page2" element={<Page2 />} />
    </Routes>
  );
}

export default App;
