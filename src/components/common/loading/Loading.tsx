import React from "react"

const Loading = () => (
  <div className="d-flex align-items-center justify-content-center h-100 mt-5">
    <div className="spinner-border text-light" role="status">
      <span className="sr-only"/>
    </div>
  </div>
);


export default Loading;

export const RightSmallLoading = () => (
  <div className="spinner-border text-light mr-1 ml-1" role="status" style={{ width: "15px", height: "15px", fontSize: "10px" }}>
    <span className="sr-only"/>
  </div>
);