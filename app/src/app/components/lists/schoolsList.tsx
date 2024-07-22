import React from "react";
import { useProgramProvider } from "~/app/context/blockchain";

const SchoolList: React.FC = () => {
  const { SchoolContext } = useProgramProvider();
  const { schools, isLoading, error, selectSchool } = SchoolContext;

  if (isLoading) return <div>Loading schools...</div>;
  if (error) return <div>Error loading schools: {error.toString()}</div>;

  return (
    <ul>
      {schools?.map((school) => (
        <li
          key={school.publicKey.toString()}
          onClick={() => selectSchool(school.publicKey)}
        >
          {school.account.name}
        </li>
      ))}
    </ul>
  );
};

export default SchoolList;
