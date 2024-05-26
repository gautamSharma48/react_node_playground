import React, { useEffect, useRef, useState } from "react";

const ClickOutside = () => {
  const ref = useRef(null);
  const [open, setIsOpen] = useState(false);

  return (
    <OutsideClickRef inputRefName={ref} setShowErrorName={setIsOpen}>
      <button ref={ref} onClick={() => setIsOpen(!open)}>
        Open
      </button>
      {open && (
        <div className="bg-[grey] fixed inset-0 h-screen w-full flex items-center justify-center">
          <div className="w-[50px] h-[50px] bg-[white] "></div>
        </div>
      )}
    </OutsideClickRef>
  );
};

const OutsideClickRef = ({
  inputRefName,
  setShowErrorName,
  children,
  className,
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRefName.current &&
        !inputRefName.current.contains(event.target)
      ) {
        setShowErrorName(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className={className} ref={inputRefName}>
      {children}
    </div>
  );
};

export default ClickOutside;
