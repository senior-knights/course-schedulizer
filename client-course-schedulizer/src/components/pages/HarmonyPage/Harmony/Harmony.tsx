import { CustomButtonProps, Harmony as HarmonyBase, Result } from "@harmoniously/react";
import { Button } from "@material-ui/core";
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
      <HarmonyBase
        assignments={assignments}
        autoRun
        button={CustomButton}
        footer={<Footer />}
        header={<></>}
        setResult={setRes}
      />
    </>
  );
};

const selector = ({ assignments }: HarmonyAssignmentsState) => {
  return assignments;
};

const resultSelector = ({ setResult }: HarmonyResultState) => {
  return setResult;
};

const CustomButton = (props: CustomButtonProps) => {
  return (
    <Button variant="outlined" {...props}>
      Find Another Schedule
    </Button>
  );
};
const Footer: React.FC = () => {
  return (
    <small>
      powered by{" "}
      <a href="https://github.com/charkour/harmoniously">
        <code>harmoniously</code>
      </a>
    </small>
  );
};
