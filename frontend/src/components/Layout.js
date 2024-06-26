import React from 'react'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

const Layout = ({ children }) => (
  <div className='layout-body'>
    <Header />
    <main className='content'>{children}</main>
    <Footer />
  </div>
)

export default Layout
