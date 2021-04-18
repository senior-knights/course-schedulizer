import { FieldArrayForm, FieldArrayFormProps } from "components";
import React from "react";
import { HarmonyFormsState, useHarmonyFormsStore } from "utilities/hooks/useHarmonyFormsStore";

interface HarmonyFieldArrayFormProps extends FieldArrayFormProps {
  onSubmit?: () => void;
}

/** Custom field array form for Harmony which injects the specific add function
 *   with the correct fieldsName using a closure.
 */
export const HarmonyFieldArrayForm = (props: HarmonyFieldArrayFormProps) => {
  const { onSubmit, fieldsName } = props;
  const update = useHarmonyFormsStore(selector);

  const onSubmitCallback = React.useCallback(
    (data: object[]) => {
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

const selector = (state: HarmonyFormsState) => {
  return state.update;
};
