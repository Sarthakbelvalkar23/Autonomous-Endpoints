import React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-green-100 flex flex-col justify-center items-center px-4">
      {/* Project Title */}
      <div className="text-center mb-16 relative">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg text-center">
          <span className="inline-block  text-black-600">A</span>
          <span
            className=" bg-clip-text bg-gradient-to-r from-black-400 via-black-500 to-black-500 
              bg-[length:300%_100%] "
          >
            utonomous endpoint
          </span>
          <span className="inline-block  text-black-600">S</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg text-gray-700 font-medium">
          Choose your system to get started
        </p>
      </div>

      {/* Main Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Household Automation */}
        <a
          href="http://localhost:5173"
          className="bg-white border-2 border-blue-500 hover:border-blue-700 hover:shadow-xl rounded-2xl p-8 flex flex-col items-center transition-all duration-300"
        >
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Household Automation
          </h2>
          <p className="text-gray-600 text-center">
            Manage grocery reordering, budget tracking, and consumption smartly.
          </p>
        </a>

        {/* Retail Inventory */}
        <a
          href="http://localhost:5174"
          className="bg-white border-2 border-green-500 hover:border-green-700 hover:shadow-xl rounded-2xl p-8 flex flex-col items-center transition-all duration-300"
        >
          <div className="text-6xl mb-4">🏬</div>
          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Retail Inventory
          </h2>
          <p className="text-gray-600 text-center">
            Forecast demand, optimize inventory and pricing using AI.
          </p>
        </a>
      </div>
    </div>
  );
};

export default App;
