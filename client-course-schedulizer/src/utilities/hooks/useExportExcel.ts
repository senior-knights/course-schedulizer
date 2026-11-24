/* eslint-disable sort-keys-fix/sort-keys-fix */
import * as XLSX from "xlsx";
import download from "js-file-download";
import moment from "moment";
import { useContext } from "react";
import { AppContext } from "utilities/contexts";
import { buildExportWorkbook } from "./buildExportWorkbook";

export const useExportExcel = () => {
  const {
    appState: { schedule },
  } = useContext(AppContext);

  const onExportExcelClick = () => {
    
    const workbook = buildExportWorkbook(schedule);

    // Generate Excel buffer and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    download(excelBuffer, `schedule_${moment().format("YYYY-MM-DD_HH-mm-ss")}.xlsx`);
  };

  return onExportExcelClick;
};
