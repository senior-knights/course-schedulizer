import { CustomButtonProps, Harmony as HarmonyBase, Result } from "@harmoniously/react";
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
        button={HideButton}
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

// TODO: update harmoniously API to hide buttons. https://github.com/charkour/harmoniously/issues/43
const HideButton = (props: CustomButtonProps) => {
  return <></>;
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
