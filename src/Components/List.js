import React from 'react'
import "./List.css"
import Userinfo from './Userinfo'
import Chatlist from './Chatlist'
function List() {
  return (
    <div className='list'>
    
      <Userinfo></Userinfo>
      <Chatlist></Chatlist>
    </div>
  )
}

export default List
