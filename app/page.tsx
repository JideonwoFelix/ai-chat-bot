import Image from 'next/image'

export default function Home() {
  return (
    <main className="bg-[#f4f5f7] min-h-[100vh]">
      <div className='landing'>
        <div className="heading bg-gradient-to-tl to-[#cfad1f] from-[#93a877] rounded-b-[50px]">
          <div className='absolute top-10 left-10'><Image src={'/nsuk-logo.png'} height={20} width={70} alt='nsuk-logo'/></div>
          <div className="bg-white rounded-2xl shadow-lg md:w-2/3 mx-5 md:mx-auto translate-y-1/2">
            <h2 className='border-b p-7 font-bold text-[#535353]'>Chat with NSUK team</h2>
            <div className='flex p-7 items-center gap-10 pb-[50px]'>
              <div className="image"><Image src={'/chat-bot-img.png'} height={20} width={70} alt='chat-bot-image'/></div>
              <div>
                <h3 className='font-bold text-[#535353]'>Chat Support</h3>
                <p>Hi My name is Peace. How can I help you? </p>
              </div>
            </div>
          </div>
        </div>

        <div className="faq bg-white bg-[url('/nsuk-logo.png')] bg-cover bg-blend-overlay bg-center bg-opacity-80 rounded-2xl md:w-2/3 mx-5 md:mx-auto mt-[150px] text-[#717171] text-2xl md:text-3xl font-bold">
          <div className="border-b p-10 text-[#535353] text-3xl flex justify-between items-center">
            FAQs
            <Image src={'/search-icon.png'} height={20} width={50} alt='search-icon'/>
          </div>
          <div className="border-b p-10 flex items-center gap-5">
            <div className="bg-[#b4ba3a] text-white w-[60px] h-[60px] rounded-lg text-4xl flex items-center justify-center">A</div>
            Admissions and Records
          </div>
          <div className="border-b p-10 flex items-center gap-5">
            <div className="bg-[#b4ba3a] text-white w-[60px] h-[60px] rounded-lg text-4xl flex items-center justify-center">R</div>
            Registration and Enrollment
          </div>
          <div className="border-b p-10 flex items-center gap-5">
            <div className="bg-[#b4ba3a] text-white w-[60px] h-[60px] rounded-lg text-4xl flex items-center justify-center">C</div>
            Chat with Human Agent
          </div>
          <div className="border-b p-10 pt-20 text-sm text-center gap-5 bg-gradient-to-b from-[10%] to-[80%] to-[#f4f5f7] from-[#fff]">
            &copy;2023
          </div>


        </div>
      </div>

    </main>
  )
}
