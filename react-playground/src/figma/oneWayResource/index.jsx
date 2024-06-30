import React, { useState } from "react";
import Banner from "./banner";
import TouchableScrollBar from "./touchableScrollBar";
import "./index.css";
import SharedAndAssigned from "./sharedAndAssigned";

const CheckMarkAnimation = ({ color = "#000000" }) => {
  return (
    <svg id="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="25" fill={color} />
      <path fill="none" stroke="#fff" strokeWidth="5" d="M14 27l8 8 16-16" />
    </svg>
  );
};


const Index = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <CheckMarkAnimation color={"#5cb85c"} />
      <SharedAndAssigned />
      <Banner />
      <TouchableScrollBar />
    </div>
  );
};

export default Index;
