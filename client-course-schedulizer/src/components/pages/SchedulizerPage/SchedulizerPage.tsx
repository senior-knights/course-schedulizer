import { Tabs } from "components";
import React, { useEffect } from "react";
import { useImportRemoteFile } from "utilities/hooks/importRemoteFileHook";

export const SchedulizerPage = () => {
  // Load a remote file from the GET parameters
  const { importRemoteFile } = useImportRemoteFile();
  useEffect(importRemoteFile);

  return (
    <>
      <Tabs />
    </>
  );
};
