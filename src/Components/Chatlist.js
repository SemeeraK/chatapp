import React, { useEffect, useState } from 'react'
import "./Chatlist.css"
import Adduser from './Adduser'
import { useUserstore } from '../Library/Userstore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../Library/Firebase'
import { useChatStore } from '../Library/ChatStore'
// import Chat from './Chat'

function Chatlist() {
  const [chats,setChats]=useState([])
    const [addMode,setAddmode]=useState(false)
    const [input,setInput]= useState("")
const {currentUser}=useUserstore()
const {chatId,changeChat}=useChatStore()
// console.log(chatId);

useEffect(()=>{

  const unSub = onSnapshot(doc(db, "userchats", currentUser.id),async(res) => {
    // console.log("Current data: ", doc.data());
    // setChats(doc.data())
    const items = res.data().chats;

const promises = items.map(async(item)=>{
  const userDocRef = doc(db, "users", item.receiverId);
const userDocSnap = await getDoc(userDocRef);

const user = userDocSnap.data()

return {...item, user}
})
const chatData = await Promise.all(promises)
setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
}
);

return () => {
unSub()
}

},[currentUser.id])

const handleSelect = async(chat)=>{
  
  const userChats = chats.map((item) =>{
    const {user, ...rest} = item
    return rest
  })

  const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)
  userChats[chatIndex].isSeen = true

  const userChatsRef = doc(db,"userchats", currentUser.id)

  try{

    await updateDoc(userChatsRef, {
      chats: userChats,
    })
    changeChat(chat.chatId,chat.user)

  }catch(err){
    console.log(err);

  }
}

const filteredChats = chats.filter((c) => 
c.user.username.toLowerCase().includes(input.toLowerCase()))

  return (
    <div className='chatList'>
      <div className='search'>
        <div className="searchBar">
            <img src="/Pics/search.png" alt="" />
            <input type="text" placeholder='Search' onChange={(e)=>setInput(e.target.value)} />
        </div>
        <img src={addMode ?  "/pics/minus.png" :"/Pics/plus.png" }alt="" className='add'
        onClick={()=>setAddmode((prev) => ! prev)}
        />
      </div>
      {filteredChats?.map((chat)=>(
      <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{
        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
      }}>
      <img src={ 
        chat.user.blocked.includes(currentUser.id)
         ? "/Pics/avatar.png" 
         : chat.user.avatar || "/Pics/avatar.png"} alt="" />
      <div className="texts">
          <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
          <p>{chat.lastMessage}</p>
        </div>
      </div>

      ))}
{addMode && <Adduser></Adduser>}
    </div>
  )
}

export default Chatlist
