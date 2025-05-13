// import React from 'react'
import Hero from './components/Hero'
import Demo from './components/Demo'
import './index.css'
import ThemeSwitcher from './components/ThemeSwitcher'

const App = () => {
  return (
    <div className='bg'>
      <div className='app'>
      <Hero />
      <Demo />
      <ThemeSwitcher />
      </div>
    </div>
       
  )
}

export default App
