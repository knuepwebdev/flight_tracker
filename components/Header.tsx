import React from 'react';

function Header() {
  return (
    <div>
      {/* Large screen navbar */}
      <nav className="hidden h-[52px]  max-w-8xl bg-gray-800 lg:flex items-center  px-[20px] py-[6px] relative z-30">
        
        <img src='logo.jpg' alt="Logo" className='flex-none max-h-full' />
        <p className="grow text-center text-gray-200 text-[32px] px-[20px]">
          Look at the Wings on That
        </p>




      </nav>

      {/* Small screen navbar */}

      {/* Top navbar */}
      <nav className="lg:hidden flex items-center w-[100vw] absolute top-0 z-[30] bg-gray-800 overflow-hidden">
      	<img src='logo.jpg' alt="Logo" className='flex-none max-w-[10%] max-h-full' />
        <p className="grow text-center text-[24px] text-center text-gray-200 font-serif]">
          Look at the Wings on That
        </p>
      </nav>

    </div>
  );
}

export default Header;