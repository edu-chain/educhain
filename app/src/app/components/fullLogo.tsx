import React from 'react'
import { css } from "styled-system/css";
import { hstack } from "styled-system/patterns";

function FullLogo() {
  return (
    <a
      href="http://localhost:3000"
      className={hstack({ alignItems: "center" })}
    >
      <img
        src="/logo.png"
        className={css({ h: 8 })}
        alt="EduChain Logo"
      />
      <span
        className={css({
          fontSize: "2xl",
          fontWeight: "semibold",
          _dark: { color: "white" },
        })}
      >
        EduChain
      </span>
    </a>
  );
}

export default FullLogo