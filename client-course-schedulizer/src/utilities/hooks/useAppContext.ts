import { useContext } from "react";
import { AppContext } from "utilities/contexts";

export const useAppContext = () => {
  return useContext(AppContext);
};
