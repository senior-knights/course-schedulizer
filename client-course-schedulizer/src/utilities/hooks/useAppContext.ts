import { useContext } from "react";
import { AppContext } from "utilities/contexts";

/** Get a handle on the app context.
 *  Uses one import in files rather than two.
 */
export const useAppContext = () => {
  return useContext(AppContext);
};
