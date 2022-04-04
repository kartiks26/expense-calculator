import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Expense from "./components/expense/Expense";
function App() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/expense" element={<Expense />} />
    </Routes>
  );
}

export default App;
