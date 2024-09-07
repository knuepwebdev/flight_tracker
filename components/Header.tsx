import React from "react";

function Header() {
  return (
    <div>
      {/* Large screen navbar */}
      <nav className="hidden h-[52px]  max-w-8xl bg-black lg:flex items-center  px-[20px] py-[6px] mx-[30px] relative z-30">
        <p className="text-gray-200 text-[32px]">
          Flight Tracker
        </p>

        <div className="flex items-center space-x-12 ml-[40px]">
          <p className="text-[14px] text-gray-400">Apps</p>
          <p className="text-[14px] text-gray-400">Add coverage</p>
          <p className="text-[14px] text-gray-400">Data/History</p>
          <p className="text-[14px] text-gray-400">Subscription Plans</p>
          <p className="text-[14px] text-gray-400">Login</p>
        </div>

        <div className="flex  px-5  space-x-3 items-center ml-[40px] border border-gray-400 rounded-[8px]">
          <div className="">
            <input
              className="py-2 rounded-[8px] bg-transparent focus:outline-none text-gray-200"
              type="text"
              placeholder="Enter a Flight number/callsign here"
            />
          </div>
        </div>
      </nav>

      {/* Small screen navbar */}

      {/* Top navbar */}
      <div className="flex lg:hidden justify-center w-[100vw] absolute top-0 z-[30] bg-black overflow-hidden">
        <p className="text-[40px] text-center text-gray-200 font-serif]">
          Flight Tracker
        </p>
      </div>

    </div>
  );
}

export default Header;