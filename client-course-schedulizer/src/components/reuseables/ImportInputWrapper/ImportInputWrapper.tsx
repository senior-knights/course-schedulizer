import React, { PropsWithChildren } from "react";
import { useImportFile } from "utilities";

interface ImportInputWrapperProps {
  /**
   * If true, will add schedules together.
   *   false will override the current schedule.
   *
   * @type {boolean}
   * @memberof ImportInputWrapperProps
   * @optional
   */
  isAdditiveImport?: boolean;
}

/**
 * Wraps whatever children in a label that will capture the click
 *   on the children and open the file explorer to upload a file.
 */
export const ImportInputWrapper = ({
  children,
  isAdditiveImport = false,
}: PropsWithChildren<ImportInputWrapperProps>) => {
  const onInputChange = useImportFile(isAdditiveImport);

  const id = `${isAdditiveImport ? "additive-" : ""}import-button`;

  return (
    <label htmlFor={id}>
      <input accept=".csv, .xlsx, .json" className="hidden" id={id} onChange={onInputChange} type="file" />
      {children}
    </label>
  );
};
