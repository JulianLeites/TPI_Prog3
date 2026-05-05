import React from 'react'
import NavBar from '../UI/NavBar.jsx'
import { Container } from 'react-bootstrap'

const Dashboard = () => {
  return (
    <div>
      <NavBar/>
       <Container fluid >
        <img src='https://etenonfitness.com/wp-content/uploads/2019/10/Low-cost-1024x683.jpg' alt='...'></img>
       </Container>
    </div>
  )
}

export default Dashboard
