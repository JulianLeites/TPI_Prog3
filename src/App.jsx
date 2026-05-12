import {Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login.jsx"
import Register from "./components/auth/Register.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Clases from "./components/pages/Clases.jsx"
import Tiers from "./Components/pages/Tiers.jsx"
import { useState } from "react"


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
      <Routes>
        <Route path="/" element={<Login onLogin={setIsLoggedIn}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn}/>}/>
        <Route path="/clases" element={<Clases isLoggedIn={isLoggedIn}/>} />
        <Route path="/tiers" element={<Tiers isLoggedIn={isLoggedIn}/>} />
      </Routes>
  )
}

export default App
