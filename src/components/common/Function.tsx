import React, { useState } from "react";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";
import CollapsedFunction from "./CollapsedFunction";
import InlineFunction from "./InlineFunction";

interface FunctionProps {
  name: string;
  text: string;
  error: boolean;
  parameters: ABIParameter[];
  submitInline: (value: string) => Promise<void>;
  submitCollapse: (values: string[]) => Promise<void>;
}

const Function = ({name, text, error, parameters, submitInline, submitCollapse} : FunctionProps) => {
  const [open, setOpen] = useState(false);
  return (open ?
    <CollapsedFunction
      name={name}
      parameters={parameters}
      onClose={() => setOpen(false)}
      submit={submitCollapse}
      errorMessage={text}
    /> :
    <InlineFunction
      name={name}
      parameters={parameters}
      errorMessage={text}
      submit={submitInline}
      onOpen={() => setOpen(true)}
    />
  );
}

export default Function;