import { Input, InputLabel } from "@material-ui/core";
import React from "react";
import { useImportFile } from "../../../utilities/hooks/useImportFile";

interface ImportButton {
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

export const ImportButton = ({ className }: ImportButton) => {
  const onInputChange = useImportFile();

  return (
    <div className={className}>
      <InputLabel className="import-label" htmlFor="import-button">
        <Input
          className="hidden"
          id="import-button"
          inputProps={{
            accept: ".csv",
          }}
          onChange={onInputChange}
          type="file"
        />
        Import CSV
      </InputLabel>
    </div>
  );
};
