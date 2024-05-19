import React from 'react'

const Header = () => {
  return (
    <header className='w-full h-16  bg-slate-900   text-orange-600  shadow-lg flex items-center justify-between px-4'>
      <div className="text-5xl font-bold">GovAssist</div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#home" className="hover:text-blue-300">Home</a></li>
          <li><a href="#about" className="hover:text-blue-300">About</a></li>
          <li><a href="#services" className="hover:text-blue-300">Services</a></li>
          <li><a href="#contact" className="hover:text-blue-300">Contact</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
