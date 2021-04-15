import { Button, Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import {
  HarmonyStepperAssignments,
  HarmonyStepperImportData,
  HarmonyStepperResult,
  HarmonyStepperUpdateData,
  HarmonyStepperWelcome,
} from "components";
import React, { useEffect } from "react";

const getSteps = () => {
  return ["Welcome", "Import Data", "Update Data", "Create Assignments", "Find Schedule"];
};

// TODO: somehow this should be linked to the values in getSteps
const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return <HarmonyStepperWelcome />;
    case 1:
      return <HarmonyStepperImportData />;
    case 2:
      return <HarmonyStepperUpdateData />;
    case 3:
      return <HarmonyStepperAssignments />;
    case 4:
      return <HarmonyStepperResult />;
    default:
      return <>Unknown step</>;
  }
};

// TODO: remove inline styles
// https://material-ui.com/components/steppers/
export const HarmonyStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => {
      return prevActiveStep + 1;
    });
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      return prevActiveStep - 1;
    });
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => {
      return prevActiveStep + 1;
    });
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // Scroll to top when step changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  return (
    <div className="harmony-stepper-root">
      <div style={{ flex: "1 0 auto" }}>
        {activeStep === steps.length ? (
          <div>
            <Typography className="harmony-stepper-content">
              All steps completed - you&apos;re finished
            </Typography>
            <Button className="harmony-stepper-button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="harmony-stepper-content" style={{ flex: "1 0 auto" }}>
              {getStepContent(activeStep)}
            </div>
            <div style={{ flex: "0 1 auto", textAlign: "end" }}>
              <Button
                className="harmony-stepper-button"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  className="harmony-stepper-button"
                  color="secondary"
                  onClick={handleSkip}
                  variant="contained"
                >
                  Skip
                </Button>
              )}
              <Button color="primary" onClick={handleNext} variant="contained">
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{ flex: "0 1 auto", paddingTop: "5em", textAlign: "center" }}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};
