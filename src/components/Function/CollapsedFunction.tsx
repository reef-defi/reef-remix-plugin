import React, { useState } from "react"
import { ABIParameter } from "@remixproject/plugin-api/lib/compiler/type";

interface CollapsedFunctionProps {
  name: string;
  text: string;
  error: boolean;
  parameters: ABIParameter[];
  onClose: () => void;
  submit: (value: string[]) => Promise<void>;
}

const CollapsedFunction = ({name, parameters, text, error, onClose, submit} : CollapsedFunctionProps) => {
  const [values, setValues] = useState<string[]>(Array(parameters.length).fill(""));

  const onChange = (value: string, index: number) => setValues([
    ...values.slice(0, index),
    value,
    ...values.slice(index+1, values.length)
  ]);

  const attributesView = values
    .map((value, index) => (
      <div className="form-group row" key={index}>
        <label className="col-3 lead m-auto">{parameters[index].name}</label>
        <div className="col-9">
          <input 
            value={value}
            placeholder={parameters[index].type}
            className="form-control"
            onChange={(event) => onChange(event.target.value, index)}
          /> 
        </div>
      </div>
    ));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="text-light">{name}</span>
        <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-up text-light ml-1" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
        </svg>
      </div>

      <div className="mt-1">
        { attributesView }
      </div>
      
      <div className="d-flex justify-content-end mt-1">
        <a className="btn btn-outline-light btn-text" onClick={() => submit(values)}>
          Transact
        </a>
      </div>
        <div className={"mt-2 " + (error ? "text-danger" : "text-light")}>
          {text && text}
        </div>
    </div>
  )
}

export default CollapsedFunction;