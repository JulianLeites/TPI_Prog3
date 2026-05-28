import React from 'react'
import NavBar from '../UI/NavBar.jsx'
import { Container } from 'react-bootstrap'
import Footer from '../UI/Footer.jsx'

const Dashboard = ({isLoggedIn}) => {
  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn}/>
       <Container fluid >
        <img src='https://etenonfitness.com/wp-content/uploads/2019/10/Low-cost-1024x683.jpg' alt='...'></img>
       </Container>
       <Footer />
    </div>
  )
}

export default Dashboard
