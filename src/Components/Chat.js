import React, { useEffect, useRef, useState } from 'react'
import "./Chat.css"
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db, storage } from '../Library/Firebase'
import { useChatStore } from '../Library/ChatStore'
import { useUserstore } from '../Library/Userstore'
import Upload from '../Library/Upload'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

function Chat() {
  const [chat, setChat] = useState()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [img, setImg] = useState({
    file: null,
    url: "",
  })


  const { currentUser } = useUserstore()
  const { chatId, user,isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

  const endRef = useRef(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [])

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId),
      (res) => {
        setChat(res.data())
      })

    return () => {
      unSub();
    }

  }, [chatId])
  // console.log(chat);

  const handleEmoji = (e) => {
    // console.log(e);
    setText((prev) => prev + e.emoji)
    setOpen(false)
  }



  // const handleImg = (e) => {
  //   if (e.target.files[0]) {
  //     setImg({
  //       file: e.target.files[0],
  //       url: URL.createObjectURL(e.target.files[0]),
  //     })
  //   }

  // }

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImg({
        file: file,
        url: url
      });
    }
  };

  const upload = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `Uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);

    return url;
  };




  const handleSend = async () => {
    if (text === "") return

    let imgUrl = null

    try {

      if (img.file) {
        imgUrl = await Upload(img.file)
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        })
      })

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async (id) => {


        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
          userChatsData.chats[chatIndex].updatedAt = Date.now()

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })

setText("");
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: "",
    })
    setText("")
  }

  // console.log(text);
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || '/Pics/avatar.png'} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p className='p'>Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src='/Pics/phone.png' alt="" />
          <img src='/Pics/video.png' alt="" />
          <img src='/Pics/info.png' alt="" />

        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (

          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createAt}>
            <div className="texts">
              {message.img && <img
                src={message.img}
              />}

              <p>
                {message.text}
              </p>
              {/* <span>  </span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message.own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}>

        </div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src='/Pics/img.png' alt="" />

          </label>
          <input type="file" id='file' style={{ display: 'none' }} onChange={handleImg} />
          <img src='/Pics/camera.png' alt="" />
          <img src='/Pics/mic.png' alt="" />

        </div>

        <input className='input'
          type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send message "
          :'Type a message...'}
          value={text}
          onChange={(e) => setText(e.target.value)} 
          disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <img src='/Pics/emoji.png' alt=""
            onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji}></EmojiPicker>

          </div>


        </div>
        <button className='send' onClick={handleSend}
        disabled={isCurrentUserBlocked || isReceiverBlocked}>
          Send</button>
      </div>

    </div>
  )
}

export default Chat
