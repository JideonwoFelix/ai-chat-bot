import React from 'react';
import Image from 'next/image';

const MessageBox: React.FC = () => {
  return (
    <div className='h-screen'>
        <div className="heading bg-gradient-to-tl to-[#cfad1f] from-[#93a877] flex p-7 items-center justify-center text-white gap-10">
            <div className="image"><Image src={'/chat-bot-img.png'} height={20} width={70} alt='chat-bot-image'/></div>
            <div>
                <h3 className='font-bold text-3xl'>Chat Support</h3>
                <p>Hi My name is Peace. How can I help you? </p>
            </div>
        </div>
        <div>
            typing area
        </div>
        <div className="typing absolute bottom-0 w-full bg-gradient-to-tl to-[#cfad1f] from-[#93a877] flex p-7 items-center justify-center text-white gap-10">
            <input type="text" className='p-4 w-3/5 rounded-[30px]' placeholder='Write a message...' />
            <div className='font-bold text-2xl'>Send</div>
        </div>
    </div>
  );
};

export default MessageBox;
