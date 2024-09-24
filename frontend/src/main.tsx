import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import './index.css'
import Login from "./components/authentication/Login.tsx";
import Profile from "./components/authentication/Profile.tsx";

import { UserProvider } from './components/UserContext.tsx';

// import setupInterceptors from './utils/axiosInterceptors';

// setupInterceptors();




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </Router>
    </UserProvider>
      
      {/* <App /> */}
    {/* </Provider> */}
  </StrictMode>
);
