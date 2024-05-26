import { useDispatch } from "react-redux";
import { add, remove } from "./slice";
import { useEffect } from "react";

const Main = () => {
  const dispatch = useDispatch();

  const updateComponentHeight = () => {
    console.log(window.innerHeight);
  };

  useEffect(() => {
    updateComponentHeight();
    window.addEventListener("resize", updateComponentHeight);
    return () => {
      window.removeEventListener("resize", updateComponentHeight);
    };
  }, []);



  return (
    <div className="App">
      <button onClick={() => dispatch(add({ message: "sample" }))}>Add</button>
      <button onClick={() => dispatch(remove())}>Remove</button>
    </div>
  );
};

export default Main;
