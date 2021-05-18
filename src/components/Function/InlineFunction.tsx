import React, { useState } from "react"
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

interface InlineFunctionProps {
  name: string;
  isReturn: boolean;
  parameters: ABIParameter[];
  onOpen: () => void;
  submit: (value: string) => void;
}

const InlineFunction = ({name, isReturn, parameters, submit, onOpen} : InlineFunctionProps) => {
  const [value, setValue] = useState("");
  const placeholder = parameters
    .reduce((acc, inp) => (`${acc}${inp.type} ${inp.name}, `), "");

  return (
    <>
      <div className="d-flex flex-row align-items-center">
        <div className="flex-fill input-group">
          <div className="input-group-prepend" style={{ width: "33%" }}>
            <a className={"btn w-100 " + (isReturn ? "btn-warning" : "btn-info")} onClick={() => submit(value)}>
              { name }
            </a>
          </div>
          {parameters.length > 0 &&
            <input 
              value={value}
              placeholder={placeholder.slice(0, placeholder.length-2)}
              className="form-control text"
              onChange={(event) => setValue(event.target.value)}
            />
          }
        </div>
        <svg onClick={onOpen} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-down text-color cursor ml-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>
    </>
  );
}

export default InlineFunction;