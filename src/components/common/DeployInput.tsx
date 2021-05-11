import React, { useState } from "react"

interface DeployInputProps {

}

const DeployInput = ({} : DeployInputProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="mt-3">
      { open 
        ? <CollapsedDeploy
            onClose={() => setOpen(false)}
            submit={() => {}}
          />
        : <InlineInputDeploy
            placeholder="uint8, uint256,..."
            onOpen={() => setOpen(true)}
            submit={() => {}}
          />
      }
    </div>
  );
}

export default DeployInput;


interface InlineInputDeployProps {
  placeholder: string;
  onOpen: () => void;
  submit: () => void;
}

const InlineInputDeploy = ({ placeholder, onOpen, submit} : InlineInputDeployProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="d-flex flex-row align-items-center">
      <div className="input-group">
        <div className="input-group-prepend">
          <a className="btn btn-outline-light btn-text" onClick={submit}>
            Deploy
          </a>
        </div>
        <input 
          value={value}
          placeholder={placeholder}
          className="form-control"
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <svg onClick={onOpen} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-down text-light border rounded-circle ml-1" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
      </svg>
    </div>
  );
}

interface ControlledDeployProps {
  submit: () => void;
  onClose: () => void;
}

const CollapsedDeploy = ({onClose, submit}: ControlledDeployProps) => {

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <span className="text-light">DEPLOY</span>
        <svg onClick={onClose} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-up text-light border rounded-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
      </div>

      <div className="mt-1">

      </div>
      
      <div className="d-flex justify-content-end mt-1">
        <a className="btn btn-outline-light btn-text" onClick={submit}>
          transact
        </a>
      </div>
    </div>
  )
}