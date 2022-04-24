import "./App.css";
import { Routes, Route } from "react-router-dom";
import Expense from "./components/expense/Expense";
import Login from "./components/Login/Login";
function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/expense" element={<Expense />} />
      </Routes>
    </>
  );
}

export default App;
