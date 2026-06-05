import {Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Clases from "./components/pages/Clases.jsx"
import Membership from "./Components/pages/Membership.jsx"
import Profile from "./components/pages/Profile.jsx"
import Contacto from "./components/pages/Contacto.jsx"
import UserManagement from "./Components/pages/UserManagement.jsx"

import { useState } from "react"


function App() {

  const [user, setUser] = useState({ loggedIn: true, role: 'admin' });

  return (
      <Routes>
        {/* Se pasa setUser para que el Login pueda cambiar el estado luego */}
        <Route path="/" element={<Login onLogin={setUser}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard user={user}/>}/>
        <Route path="/clases" element={<Clases user={user}/>} />
        <Route path="/memberships" element={<Membership user={user}/>} />
        <Route path="/contacto" element={<Contacto user={user}/>} />
        <Route path="/profile" element={<Profile user={user}/>} />
        <Route path="/user-management" element={<UserManagement user={user}/>} />
      </Routes>
  )
}

export default App
