import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BoxIcon,
  MenuIcon,
  TicketPlus,
  XIcon,
} from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className='fixed top-0 left-0 z-[9999] w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to='/' className='max-md:flex-1 flex items-center gap-2'>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
            </svg>
          </div>
          <span className="text-xl max-md:hidden font-medium ">CareerAI</span>
        </div>
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? 'max-md:w-full' : 'max-md:w-0'
        }`}
      >
        <XIcon
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden text-primary hover:text-primary-dull transition-[color] duration-300 absolute top-6 right-6 w-6 h-6 cursor-pointer'
        />

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/'>Home</Link>

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/pathways'>Pathways</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/resources'>Resources</Link>

        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/comparison-tool-page'>Career Tool</Link>


        
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false); }} to='/roadmap'>Roadmap AI</Link>

      </div>

      <div className='flex items-center gap-8'>

        {!user ? (
          <button
            onClick={openSignIn}
            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label='Dashboard'
                labelIcon={<TicketPlus width={15} />}
                onClick={() => {navigate('/my-dashboard'); scrollTo(0, 0)}}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      <MenuIcon onClick={() => setIsOpen(!isOpen)} className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'/>
    </div>
  );
};

export default Navbar;
