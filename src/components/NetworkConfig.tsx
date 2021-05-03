import React, { useState } from "react"

interface NetworkConfigProps {
  errorMessage: string;
  submit: (url: string) => void;
}

const NetworkConfig = ({errorMessage, submit} : NetworkConfigProps) => {
  const [url, setUrl] = useState("");
  
  return (
    <div className="m-3">
      <form onSubmit={() => submit(url)} className="mt-4">
        <div className="form-group">
          <label htmlFor="reefRpcUrl">Reef node url</label>
          <input type="email" className="form-control mt-1" id="reefRpcUrl" value={url} onChange={(event) => setUrl(event.currentTarget.value)} placeholder="ws://127.0.0.1:9944"/>
          <small className="form-text text-danger">{errorMessage}</small>
        </div>
        <div className="d-flex justify-content-end">

          <button className="btn btn-outline-light mt-1" onClick={() => submit(url)}>Connect</button>
        </div>
      </form>
    </div>
  );
}

export default NetworkConfig;