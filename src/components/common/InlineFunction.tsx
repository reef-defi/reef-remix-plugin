import React, { useState } from "react"
import { useSelector } from "react-redux";
import { StateType } from "../../store/reducers";
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

interface InlineFunctionProps {
  name: string;
  errorMessage: string;
  parameters: ABIParameter[];
  onOpen: () => void;
  submit: (value: string) => void;
}

const InlineFunction = ({name, parameters, errorMessage, submit, onOpen} : InlineFunctionProps) => {
  const [value, setValue] = useState("");

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
        <svg onClick={onOpen} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-down text-light border rounded-circle ml-1" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
        </svg>
      </div>
      { errorMessage && 
        <div className="text-danger mt-2">
          {errorMessage}
        </div>
      }
    </div>
  );
}

export default InlineFunction;