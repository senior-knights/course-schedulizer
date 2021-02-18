import React, { PropsWithChildren } from "react";
import { useImportFile } from "utilities";

/* Wraps whatever children in a label that will capture the click
on the children and open the file explorer to upload a file.
*/
export const ImportInputWrapper = ({ children }: PropsWithChildren<{}>) => {
  const onInputChange = useImportFile();

  return (
    <label htmlFor="import-button">
      <input
        accept=".csv, .xlsx"
        className="hidden"
        id="import-button"
        onChange={onInputChange}
        type="file"
      />
      {children}
    </label>
  );
};
