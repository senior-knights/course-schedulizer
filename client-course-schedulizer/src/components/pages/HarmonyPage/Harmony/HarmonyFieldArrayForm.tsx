import { FieldArrayForm, FieldArrayFormProps } from "components";
import React from "react";
import { HarmonyState, useHarmonyStore } from "utilities/hooks/useHarmonyStore";

interface HarmonyFieldArrayFormProps extends FieldArrayFormProps {
  onSubmit?: () => void;
}

const selector = (state: HarmonyState) => {
  return state.update;
};

/** Custom field array form for Harmony which injects the specific add function
 *   with the correct fieldsName using a closure.
 */
export const HarmonyFieldArrayForm = (props: HarmonyFieldArrayFormProps) => {
  const { onSubmit, fieldsName } = props;
  const update = useHarmonyStore(selector);

  const onSubmitCallback = React.useCallback(
    (data) => {
      update(fieldsName, data);
      onSubmit && onSubmit();
    },
    [update, onSubmit, fieldsName],
  );

  return <FieldArrayForm {...props} onSubmit={onSubmitCallback} />;
};

HarmonyFieldArrayForm.defaultProps = {
  onSubmit: undefined,
};
