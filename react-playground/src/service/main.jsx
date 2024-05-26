import React from "react";
import { Sample } from "./service";

const Main = () => {
  const fetchContent = async () => {
    const getPosts = await new Sample().getData();
    console.log(getPosts)
  };
  return <button onClick={fetchContent}>fetch content</button>;
};

export default Main;
