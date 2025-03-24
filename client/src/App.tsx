import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components";
import { Home, FinderRegister } from "./pages";
import { RecruiterRegister } from "./pages/auth/register/RecruiterRegister.tsx";
import { NotFound } from "./NotFound.tsx";

function App() {
  const location = useLocation();

  const noHeaderRoutes = [
    "/auth/finder/register",
    "/auth/recruiter/register",
    "/auth/finder/login",
    "/auth/recruiter/login"
  ];
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/finder/register" element={<FinderRegister />} />
        <Route
          path="/auth/recruiter/register"
          element={<RecruiterRegister />}
        />
        <Route path="/auth/finder/login" />
        <Route path="/auth/recruiter/login" />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
