import { useEffect } from 'react';
import './App.css';
import Chat from './Components/Chat';
import Detail from './Components/Detail';
import List from './Components/List';
import Login from './Components/Login';
import Notification from './Components/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Library/Firebase';
import { useUserstore } from './Library/Userstore';
import { useChatStore } from './Library/ChatStore';

function App() {

  const {currentUser,isLoading,fetchUserInfo}= useUserstore()
  const {chatId}= useChatStore()

  // const user = false
useEffect(()=>{

  const unSub = onAuthStateChanged(auth,(user)=>{
fetchUserInfo(user?.uid);
  })
return () =>{
  unSub()
};

},[fetchUserInfo])
// console.log(currentUser);

if (isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className="container">
      {
        currentUser ? (
          <>
          <List></List>
          {chatId && <Chat></Chat>}
          {chatId && <Detail></Detail>}
    </>

        ) : (<Login></Login>)
      }
      <Notification></Notification>
    </div>
  );
}

export default App;
