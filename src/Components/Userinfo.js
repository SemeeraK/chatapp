import React from 'react'
import "./Userinfo.css"
import { useUserstore } from '../Library/Userstore'

function Userinfo() {
  const {currentUser}= useUserstore()

  return (
    <div className='userInfo'>
        <div className='user'> 
        <img src={currentUser.avatar ||'/Pics/avatar.png'} alt="" />
        <h4>{currentUser.username}</h4>
 </div>
        <div className='icons'>
            <img src='/Pics/more.png' alt="" />
            <img src='/Pics/video.png' alt="" />
            <img src='/Pics/edit.png' alt="" />

        </div>
      
    </div>
  )
}

export default Userinfo
