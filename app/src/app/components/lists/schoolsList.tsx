
import { css } from "styled-system/css";
import { Infos, SchoolAccountData } from "~/app/types/educhain";

export default function SchoolsList(
  { schoolsList }: { schoolsList: Infos<SchoolAccountData>[] }
){
  return (
    <ul>
      {schoolsList.map((school, index) => (
        <li key={index} className={css({
          fontSize: "2xl"
        })}>
          {school.account.name}
        </li>
      ))}
    </ul>
  );
}
