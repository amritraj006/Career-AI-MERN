import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MenuIcon,
  TicketPlus,
  XIcon,
} from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-0 z-[9999] w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
      <Link to='/' className='max-md:flex-1 flex items-center gap-2'>
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center mr-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
            </svg>
          </div>
          <span className="text-xl max-md:hidden font-bold text-gray-900 tracking-tight">CareerAI</span>
        </div>
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-2 max-md:h-screen min-md:rounded-full bg-white max-md:shadow-2xl md:bg-transparent overflow-hidden transition-[width] duration-300 ${
          isOpen ? 'max-md:w-full max-md:border-r border-gray-200' : 'max-md:w-0'
        }`}
      >
        <XIcon
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden text-gray-500 hover:text-primary transition-[color] duration-300 absolute top-6 right-6 w-6 h-6 cursor-pointer'
        />

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/' className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/pathways' className="text-gray-600 hover:text-primary font-medium transition-colors">Pathways</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/comparison-tool-page' className="text-gray-600 hover:text-primary font-medium transition-colors">Career Tool</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/roadmap' className="text-gray-600 hover:text-primary font-medium transition-colors">Roadmap AI</Link>
      </div>

      <div className='flex items-center gap-6'>
        {!user ? (
          <button
            onClick={openSignIn}
            className='px-5 py-2 bg-primary hover:bg-primary-dull text-white transition-colors shadow-sm rounded-full font-medium cursor-pointer'
          >
            Login
          </button>
        ) : (
          <UserButton
            appearance={{
              elements: { userButtonAvatarBox: "w-9 h-9 border border-gray-200 shadow-sm" }
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label='Dashboard'
                labelIcon={<TicketPlus width={15} />}
                onClick={() => {navigate('/my-dashboard'); scrollTo(0, 0)}}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
        <MenuIcon onClick={() => setIsOpen(!isOpen)} className='max-md:ml-2 md:hidden w-7 h-7 text-gray-700 cursor-pointer'/>
      </div>
    </div>
  );
};

export default Navbar;
