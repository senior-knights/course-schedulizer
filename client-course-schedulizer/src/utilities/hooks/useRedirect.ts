import { useHistory } from "react-router-dom";

/** Hook that uses history to programmatically
 *   route to a new page. Returns a function
 *   routeTo: (path: string) => void
 */
export const useRedirect = () => {
  const history = useHistory();

  return (path: string) => {
    history.push(path);
  };
};
