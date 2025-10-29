import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "../src/pages/publisher/Welcompage/WelcomePage"; // from previous step
// (optional) a placeholder login page


import "./App.css";
import SiteLayout from "./layouts/SiteLayout";

function App() {
  return (
    <Routes>
<Route element={<SiteLayout />}>
      <Route path="/"element={<WelcomePage />}/>


</Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
