import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/token/:pairAddress"
        element={<TokenPage />}
      />
    </Routes>
  );
}