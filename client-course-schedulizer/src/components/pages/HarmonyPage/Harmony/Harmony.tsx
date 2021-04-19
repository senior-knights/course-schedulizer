import { Harmony as HarmonyBase, Result } from "@harmoniously/react";
import React, { useEffect, useState } from "react";
import {
  HarmonyAssignmentsState,
  HarmonyResultState,
  useHarmonyAssignmentsStore,
  useHarmonyResultStore,
} from "utilities";

/** Harmony returns a component to automatically create schedules. */
export const Harmony = () => {
  const assignments = useHarmonyAssignmentsStore(selector);
  const setResult = useHarmonyResultStore(resultSelector);
  const [res, setRes] = useState<Result>();

  // Save state in the store.
  useEffect(() => {
    setResult(res);
  }, [res, setResult]);

  return (
    <>
      <HarmonyBase assignments={assignments} setResult={setRes} />
    </>
  );
};

const selector = ({ assignments }: HarmonyAssignmentsState) => {
  return assignments;
};

const resultSelector = ({ setResult }: HarmonyResultState) => {
  return setResult;
};
