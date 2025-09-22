import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Jobs from "./Jobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
    </Routes>
  );
}

export default App;