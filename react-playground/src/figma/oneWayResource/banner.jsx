import React from 'react'

const Banner = () => {
    return (
     
        <div className="min-h-[550px] h-[400px] relative self-stretch flex-shrink-0 w-full">
          <img className="w-full h-full image-select-none " alt='' src="./rectangle@2x.png"></img>
          <div className="bg-custom-black-image absolute inset-0 w-full h-full"></div>
          <div className="absolute  bottom-6 w-full z-10">
            <div className="flex items-center justify-center gap-5 ">
              <div className="w-[50px] cursor-pointer  h-[10px] bg-[skyBlue]"></div>
              <div className="w-[50px] cursor-pointer h-[10px] bg-[skyBlue]"></div>
              <div className="w-[50px] cursor-pointer h-[10px] bg-[skyBlue]"></div>
            </div>
          </div>
  
          <div className="absolute inset-0 w-full h-full left-[100px] top-[90px]  ">
            <div className="flex items-start gap-4">
              <img
                src="./clip-path.png"
                className="image mt-auto image-select-none w-[200px] h-[200px]"
                alt=""
              />
              <div className="image-select-none">
                <p className="font-extrabold text-[25px]  mt-10 text-[white]">
                  Lorem ipsum
                </p>
                <button className="bg-[skyBlue] text-[white] rounded-3xl mt-5 w-[200px] h-[40px]">
                  Vue
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };
export default Banner