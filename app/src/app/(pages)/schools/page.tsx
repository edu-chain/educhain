'use client'

import { center } from "styled-system/patterns";
import { css } from "styled-system/css";

import Divider from "~/app/components/divider";
import useSchools from "~/app/components/hooks/useScools";
import Loading from "~/app/components/loading";
import SchoolsList from "~/app/components/lists/schoolsList";

export default function SchoolsPage() {

  const { schoolsList, loading, errorMessage } = useSchools();

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className={css({ p: 6})}>
      <h1 className={center({
          fontSize: '4xl',
          fontWeight: "bold",
          color: "primary",
        })}>Schools</h1>
      <Divider />
      {
        loading ?
          <Loading />
        :
          <SchoolsList schoolsList={schoolsList} />
      }
    </div>
  );
}