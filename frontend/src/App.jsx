import {Route, Routes } from "react-router-dom"
import Login from "./components/auth/Login.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Clases from "./components/pages/Clases.jsx"
import Membership from "./Components/pages/Membership.jsx"
import Profile from "./components/pages/Profile.jsx"
import Contacto from "./components/pages/Contacto.jsx"
import UserManagement from "./Components/pages/UserManagement.jsx"

import { useState } from "react"
import ProtectedRoutes from "./routes/protectedRoutes.jsx"


function App() {

  const [user, setUser] = useState({ loggedIn: true, role: 'admin' });

  return (
      <Routes>
        {/* Se pasa setUser para que el Login pueda cambiar el estado luego */}
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/contacto" element={<Contacto/>} />

        <Route element={<ProtectedRoutes/>}>
          <Route path="/clases" element={<Clases/>} />
          <Route path="/memberships" element={<Membership/>} />
          <Route path="/profile" element={<Profile/>} />
          
          <Route path="/user-management" element={<UserManagement/>} />
        </Route>
      </Routes>
  )
}

export default App
