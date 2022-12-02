import { React } from "react";
import { Route, Routes } from "react-router-dom";

import { Header, Footer } from "./components";
import { Landing, SignUp, SignIn, UserProfile } from "./pages";

import Interceptor from "./services/Interceptor"

import "./App.scss";

function App() {
  Interceptor();
  
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} index />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
