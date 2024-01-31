import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import LiveQuiz from "./pages/LiveQuiz/LiveQuiz";
import Result from "./pages/Result/Result";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz/:quizId" element={<LiveQuiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/not-found"
          element={
            <div>
              {" "}
              <h1>
                404 <br />
                Not Found
              </h1>{" "}
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;