'use client'

import { USERS_MOCK } from "@api/mock/mock-data";
import { useState } from "react";
import { css } from "styled-system/css";
import { center, vstack } from "styled-system/patterns";

function Example() {

const [data, setData] = useState(null);

  const handleClick = async () => {
    const response = await fetch(
      "/api/generate-group",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "prompt": USERS_MOCK,
        })
      }
    );
    const data = await response.json();
    setData(data.message);
  }

  return <div className={vstack({
      height: "70vh",
      fontSize: "2rem",
      bg: "lightgray",
      justifyContent: "center",
      alignItems: "center",
    })}
  >
    <button className={css({
      bg: "red",
      color: "white",
      padding: 3,
      cursor: "pointer",
      borderRadius: "xl",
    })} onClick={handleClick}>fetch</button>
    <div className={css({
      fontSize: 'sm',
      color: "black",
    })}>{data}</div>
  </div>
}

export default Example;