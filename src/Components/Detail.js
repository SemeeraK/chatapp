import React from 'react'
import "./Detail.css"
import { auth, db } from '../Library/Firebase'
import { useChatStore } from '../Library/ChatStore'
import { useUserstore } from '../Library/Userstore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

function Detail() {
const { chatId,  user, isCurrentUserBlocked, isReceiverBlocked ,ChangeBlock}=useChatStore()
const {currentUser}= useUserstore()

const handleBlock = async() => {
if(!user) return;

const userDocRef = doc(db,"users", currentUser.id)

try{
await updateDoc(userDocRef,{
  blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
})
ChangeBlock()

}catch(err){
console.log(err);
}

}

  return (
    <div className='detail'>
      <div className="user">
      <img src={user?.avatar || '/Pics/avatar.png'} alt="" />
<h2>{user?.username}</h2>
<p>loreum ipsum dcghfbksj</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src='/Pics/arrowUp.png' alt="" />

          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src='/Pics/arrowUp.png' alt="" />

          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src='/Pics/arrowDown.png' alt="" />

          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
              <img src='https://i.postimg.cc/fbRVrWM6/pizza-seamless-pattern-on-blue-background-vector.jpg'  />
<span>photo 2024</span>

              </div>
            <img src='/Pics/download.png' alt="" className='icon' />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
              <img src='https://i.postimg.cc/fbRVrWM6/pizza-seamless-pattern-on-blue-background-vector.jpg'  />
<span>photo 2024</span>

              </div>
            <img src='/Pics/download.png' alt="" className='icon' />
            </div>

          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src='/Pics/arrowUp.png' alt="" />

          </div>
        </div>
<button onClick={handleBlock}>{
  isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked 
  ? "UserBlocked" : "Block User"
}</button>
<button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail
