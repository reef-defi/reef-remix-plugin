import React from "react"

type Color = "success" | "warning" | "danger";

interface Dot {
  color?: Color;
}

const Dot = ({color="success"}: Dot): JSX.Element => (
  <svg width="16" height="16" fill="currentColor" className={`bi bi-circle-fill p-1 text-${color}`} viewBox="0 0 16 16">
    <circle cx="6" cy="6" r="6"/>
  </svg>
);

export default Dot;