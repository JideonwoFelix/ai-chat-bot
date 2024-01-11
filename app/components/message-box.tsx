import React, {useState, useRef, useEffect} from 'react';
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
            content: "You are a helpful assistant designed to output JSON.",
        }
    ]);
    const [isTyping, setIsTyping] = useState<Boolean>(false);
    const chatBoxRef_ = useRef(null);
    const [botReply, setBotReply] = useState<string>('');
    const messageThread:ChatMessage[] = []

    // openai initialization
    const configuration = {
        apiKey: process.env.NEXT_PUBLIC__MOCK_GPT_API_KEY,
        baseURL: process.env.NEXT_PUBLIC_MOCK_GPT_API_ENDPOINT as string, 
        dangerouslyAllowBrowser: true
    };
    const openai = new OpenAI(configuration);

    useEffect(() => {
        let chatBoxRef = document.getElementById('chat_box')
        chatBoxRef?.scrollTo({
            top: chatBoxRef?.scrollHeight as number,  
            left: 0, 
            behavior: "smooth",
        });
        // console.log( chatBoxRef?.scrollHeight)
    }, [chatMessages, isTyping]);

    const send_chat = async () => {
        // stop another call if one is still pending
        if(isTyping){
            return
        }
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
        AddToChatBox(newMessage)

        setIsTyping(true);
        try {
            const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: chatMessages,
            });
          
            console.log(completion.choices[0].message.content);
            const botReply:ChatMessage = {
                role: "assistant",
                content: completion.choices[0].message.content as string
            }
            setIsTyping(false);
            AddToChatBox(botReply)
            console.log(botReply)
            // AddToChatBox(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error making OpenAI API request:', error);
            setIsTyping(false);
        }
    };

    let AddToChatBox = (message:ChatMessage)=>{
        setChatMessages((prevMessages) => [...prevMessages, message]);
        const newAppendage = document.createElement('div');
        newAppendage.className = `text-2xl rounded-[30px] p-3 px-6 text-white font-bold  w-fit ${message.role === 'user'?'rounded-br-none bg-[#b4ba3a] self-end':'rounded-bl-none bg-[#696d1e]'}` 
        console.log('new message role--->',message.role === 'user')
        newAppendage.textContent = message.content;
        document.getElementById('chat_box')?.append(newAppendage);
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
                <div className='text-2xl rounded-[30px] rounded-br-none p-3 px-6 text-white font-bold bg-[#b4ba3a] w-fit self-end'>
                    Hello
                </div>
                <div className='text-2xl rounded-[30px] rounded-bl-none p-3 px-6 text-white font-bold bg-[#696d1e] w-fit'>
                    Hi there
                </div>
            </div>
            {
                isTyping?
                <div className="text-2xl is_typing_container fixed bottom-20 " id='typing_indicator'>
                    typing 
                    <span className="typing-dot dot1">.</span>
                    <span className="typing-dot dot2">.</span>
                    <span className="typing-dot dot3">.</span>
                </div>
                :''
            }
            
        </div>
        <div className="xabsolute row-span-1 bottom-0 w-full bg-gradient-to-tl to-[#cfad1f] from-[#93a877] flex p-7 items-center justify-center text-white gap-10 xh-[130px] align-start">
            <input id='chat_input' type="text" className='p-4 w-3/5 rounded-[30px] text-black' placeholder={isTyping? 'please Hold on, waiting for response': `Write a message...`}  disabled={isTyping?true:false}/>
            <div className='font-bold text-2xl' onClick={send_chat}>Send</div>
        </div>
    </div>
  );
};

export default MessageBox;
