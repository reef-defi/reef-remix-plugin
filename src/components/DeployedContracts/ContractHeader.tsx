import React from "react";
import Copy from "../common/Copy";
import { RightSmallLoading } from "../common/loading/Loading";

interface ContractHeaderProps {
  open: boolean;
  address: string;
  isLoading: boolean;
  onClick: () => void;
  onRemove: () => void;
}

const ContractHeader = ({address, open, isLoading, onClick, onRemove}: ContractHeaderProps) => {
  const text = `STORAGE AT ${address.slice(0, isLoading ? 13 : 15)}...${address.slice(address.length-3, address.length)}`
  return (
    <div className="d-flex column justify-content-between">
      <div>
        <OpenIcon open={open} onClick={onClick}/>
        <label className="text-color ml-1 mr-2">{text}</label>
      </div>
      <div>
        { isLoading && <RightSmallLoading /> }
        <Copy value={address} />
        <svg onClick={onRemove} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x text-color cursor ml-1" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>
    </div>
  )
}

interface OpenIconProps {
  open: boolean;
  onClick: () => void
}

const OpenIcon = ({open, onClick}: OpenIconProps) => (open ? 
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-down text-color" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  </svg> :
  <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chevron-right text-color" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
  </svg>
);

export default ContractHeader;