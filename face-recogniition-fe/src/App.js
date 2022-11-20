import { React } from "react";
import { Route, Routes } from "react-router-dom";

import { Header, Footer } from "./components";
import { Landing, SignUp, SignIn } from "./pages";

import "./App.scss";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} index />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
