import React, { useState } from "react"
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

interface InlineFunctionProps {
  name: string;
  text: string;
  error: boolean;
  parameters: ABIParameter[];
  onOpen: () => void;
  submit: (value: string) => void;
}

const InlineFunction = ({name, parameters, text, error, submit, onOpen} : InlineFunctionProps) => {
  const [value, setValue] = useState("");
  console.log("Error: ", error)
  const placeholder = parameters
    .reduce((acc, inp) => (`${acc}${inp.type} ${inp.name}, `), "");

  return (
    <div>
      <div className="d-flex flex-row align-items-center">
        <div className="row flex-fill m-0">
          <div className="col-4 p-0">
            <a className="btn btn-outline-light btn-text w-100" onClick={() => submit(value)}>
              { name }
            </a>
          </div>
          <div className="col-8 p-0">
            {parameters.length > 0 &&
              <input 
                value={value}
                placeholder={placeholder.slice(0, placeholder.length-2)}
                className="form-control"
                onChange={(event) => setValue(event.target.value)}
              />
            }
          </div>
        </div>
        <svg onClick={onOpen} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-down text-light ml-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>
      <div className={"mt-1 " + (error ? "text-danger" : "text-light")}>
        {text && text}
      </div>
    </div>
  );
}

export default InlineFunction;