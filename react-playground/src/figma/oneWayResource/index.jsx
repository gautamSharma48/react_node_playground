import React from 'react'
import Banner from './banner'
import TouchableScrollBar from './touchableScrollBar'
import "./index.css";

const Index = () => {
  return (
    <div className='flex flex-col overflow-hidden'>
        <Banner />
        <TouchableScrollBar />
    </div>
  )
}

export default Index