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
        src="https://flowbite.com/docs/images/logo.svg"
        className={css({ h: 8 })}
        alt="Flowbite Logo"
      />
      <span
        className={css({
          fontSize: "2xl",
          fontWeight: "semibold",
          _dark: { color: "white" },
        })}
      >
        Flowbite
      </span>
    </a>
  );
}

export default FullLogo