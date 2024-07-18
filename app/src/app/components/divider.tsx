import { css } from "styled-system/css";

export default function Divider() {
  return <hr
  className={css({
    width: "100%",
    height: "5px",
    backgroundColor: "ui.background",
    border: "none",
    margin: "10px 0",
      })}
    />
}