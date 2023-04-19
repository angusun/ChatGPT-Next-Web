import { useEffect } from "react";
import vconsole from "vconsole";

const VConsole = () => {
  useEffect(() => {
    new vconsole();
  }, []);
  return <></>;
};

export default VConsole;
