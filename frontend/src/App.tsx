import { AuthProvider, ProtectedRoutes } from "../providers/AuthProvider";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from "../components/Header";
import NoPage from "../pages/NoPage";
import Receive from "../pages/Receive";
import Pay from "../pages/Pay";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Close from "../pages/Close";

function App() {
  return (
    <div className="min-h-screen bg-global p-4">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/receive" element={<Receive />} />
              <Route path="/pay" element={<Pay />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/close" element={<Close />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
