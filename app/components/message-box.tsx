import React, {useState, useRef, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import OpenAI from "openai";

interface ChatMessage {
    role: "user"|"assistant"|"system",
    content: string
}

const MessageBox: React.FC = () => {
    
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            role: "system",
            content: "You are a helpful assistant for students of Nasarawa state University Nigeria",
        }
    ]);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const chatBoxRef_ = useRef(null);
    const messagesEndRef = useRef(null); 
    

    // openai initialization
    const configuration = {
        // apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY_BAD,
        // apiKey: process.env.NEXT_PUBLIC__MOCK_GPT_API_KEY,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        baseURL: 'http://localhost:5000/api', 
        dangerouslyAllowBrowser: true
    };
    const openai = new OpenAI(configuration);

    // force scrolling to the bottom ----not workin yet
    // useEffect(() => {
    //     chatBox?.scrollTo({
    //         top: chatBox?.scrollHeight as number,  
    //         left: 0, 
    //         behavior: "smooth",
    //     });
    //     // console.log( chatBoxRef?.scrollHeight)
    //     // typing_indicator?.scrollIntoView({ behavior: "smooth" })
    // }, [chatMessages, isTyping]);

    const scroll_to_bottom_of_chat = ()=>{
        // chatBoxRef_.current?.scrollIntoView({
        //     top: chatBox?.scrollHeight as number,  
        //     left: 0, 
        //     behavior: "smooth",
        // });
        const chatBox:HTMLDivElement = document.getElementById('chat_box') as HTMLDivElement;
        let messagesEndRef_ = messagesEndRef.current as unknown;
        (messagesEndRef_ as Element).scrollIntoView({ behavior: "smooth" })
        // console.log("schoul've scrolled", chatBox)
    }
    const send_chat = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      // stop another call if one is still pending
      if(isTyping){
        return
      }
      const chatBox:HTMLDivElement = document.getElementById('chat_box') as HTMLDivElement;
      // create typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'text-2xl rounded-[30px] rounded-bl-none p-3 px-6 text-white font-bold bg-[#696d1e] w-fit';
      typingIndicator.innerHTML =`
          <div className="text-2xl is_typing_container" id='typing_indicator'>
              typing 
              <span className="typing-dot dot1">.</span>
              <span className="typing-dot dot2">.</span>
              <span className="typing-dot dot3">.</span>
          </div>`
      const newMessage_ = document.getElementById('chat_input') as HTMLInputElement;
      const newMessage:ChatMessage = {
          role: "user",
          content: newMessage_.value
      }
  
      // Add the new message to the chatMessages array
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Clear the input field  
      newMessage_.value = '';

      // append new element to chatbox
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      AddToChatBox(newMessage)

      setIsTyping(true);
      
      chatBox?.appendChild(typingIndicator);

      try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chatMessages,
          });
        
        //   console.log(completion.choices[0].message.content);
          const botReply:ChatMessage = {
              role: "assistant",
              content: completion.choices[0].message.content as string
          }
          setIsTyping(false);
          chatBox?.removeChild(typingIndicator);
          AddToChatBox(botReply)
        //   console.log(botReply)
          // AddToChatBox(completion.choices[0].message.content);
      } catch (error) {
          console.error('Error making OpenAI API request:', error);
          setIsTyping(false);
          chatBox?.removeChild(typingIndicator);
          let isQuota_exceed :boolean = false
          let error_:string = String(error)
          if(error_.indexOf('You exceeded your current quota') !==1){
            isQuota_exceed = true
          }
          const errorReply:ChatMessage = {
            role: "system",
            content: 'Oops! internet Error, please retype your question.'
          }
          if(isQuota_exceed){errorReply.content = 'Quota exceed, please contact support.'}
          AddToChatBox(errorReply, true)
      }
    };

    // adds message to array of messages to maintain thread and appends message to chatbBox UI
    let AddToChatBox = (message:ChatMessage, isError_msg?:boolean)=>{
        const newAppendage = document.createElement('div');
        newAppendage.className = `text-2xl rounded-[30px] p-3 px-6 ${isError_msg?'text-red-700':'text-white'} font-bold  w-fit ${message.role === 'user'?'rounded-br-none bg-[#b4ba3a] self-end':'rounded-bl-none bg-[#696d1e]'}` 
        // console.log('new message role--->',message.role === 'user')
        newAppendage.textContent = message.content;
        document.getElementById('chat_box')?.append(newAppendage);
        scroll_to_bottom_of_chat()
    }

  return (
    <div className='h-screen grid grid-cols-1 grid-rows-10'>
        <div className="heading bg-gradient-to-tl to-[#cfad1f] from-[#93a877] flex p-7 items-center justify-center text-white gap-10">
            <div className="image"><Image src={'/chat-bot-img.png'} height={20} width={70} alt='chat-bot-image'/></div>
            <div>
                <h3 className='font-bold text-3xl'>Chat Support</h3>
                <p>Hi My name is Peace. How can I help you? </p>
            </div>
        </div>
        <div className="relative bg-[url('/nsuk-logo.png')] bg-center bg-cover bg-blend-overlay bg-opacity-60 bg-white xh-5/6 row-span-8 overflow-y-scroll md:pb-10 md:px-40  p-3 flex flex-col gap-4 justify-end">
            <div className="flex flex-col gap-4 h-full pb-20" id='chat_box' ref={chatBoxRef_}>
                {/* chats will be added here */}
            </div>  
            <div ref={messagesEndRef} />          
        </div>
        <form className="xabsolute row-span-1 bottom-0 w-full bg-gradient-to-tl to-[#cfad1f] from-[#93a877] flex p-7 items-center justify-center text-white gap-10 xh-[130px] align-start" onSubmit={(e)=>send_chat(e)}>
            <input id='chat_input' type="text" className='p-4 w-3/5 rounded-[30px] text-black' placeholder={isTyping? 'Waiting for response, please hold on...': `Write a message...`}  disabled={isTyping ? true : false} required/>
            <button className={'font-bold text-2xl cursor-pointer ' + (isTyping? 'cursor-not-allowed':'') }>Send</button>
        </form>
    </div>
  );
};

export default MessageBox;
