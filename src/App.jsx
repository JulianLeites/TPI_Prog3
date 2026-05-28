import {Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login.jsx"
import Register from "./components/auth/Register.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Clases from "./components/pages/Clases.jsx"
import Tiers from "./Components/pages/Tiers.jsx"
import Profile from "./components/pages/Profile.jsx"
import { useState } from "react"


function App() {

  const [user, setUser] = useState({ loggedIn: true, role: 'admin' });

  return (
      <Routes>
        {/* Se pasa setUser para que el Login pueda cambiar el estado luego */}
        <Route path="/" element={<Login onLogin={setUser}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard isLoggedIn={user.loggedIn}/>}/>
        <Route path="/clases" element={<Clases user={user}/>} />
        <Route path="/tiers" element={<Tiers isLoggedIn={user.loggedIn}/>} />
        <Route path="/profile" element={<Profile isLoggedIn={user.loggedIn}/>} />
      </Routes>
  )
}

export default App
