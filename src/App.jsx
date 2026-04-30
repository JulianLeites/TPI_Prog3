import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/pages/Login.jsx"
import Register from "./components/pages/Register.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Tiers from "./Components/pages/Tiers.jsx"

function App() {

  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/tiers" element={<Tiers/>} />
      </Routes>
  )
}

export default App
