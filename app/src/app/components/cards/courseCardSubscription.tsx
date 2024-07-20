import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  CourseAccountData,
  Infos,
  StudentSubscriptionDataAccount
} from "~/app/types/educhain";
import { getStudentSubscriptionInfos, subscribeToCourse } from "@api/educhain";

import { css } from "styled-system/css";
import { center, gridItem, vstack } from "styled-system/patterns";

import { useProgram } from "~/app/components/solana/solana-provider";
import { Badge } from "~/components/ui/badge";
import Loading from "../loading";


export default function CourseCardSubscription(
  { course }: { course: Infos<CourseAccountData> })
{

  const [schoolName, setSchool] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscription, setSubscription] = useState<StudentSubscriptionDataAccount | null>(null);

  const program = useProgram();
  const wallet = useWallet();

  const handleSubscription = async() => {
    await subscribeToCourse(
      program,
      wallet,
      course.publicKey,
      "name of what?"
    );
  };

  useEffect(() => {
    program.account.schoolDataAccount.fetch(course.account.school)
      .then((school) => {
        setSchool(school.name);
        getStudentSubscriptionInfos(
          program,
          wallet.publicKey as PublicKey,
          course.publicKey
        ).then((studentSubscription) => {
          setSubscription(studentSubscription);
        }).catch((error) => {
          throw error;
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

  });

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <>
    {
      loading ?
        <Loading />
      :
        <div className={gridItem({backgroundColor: 'lightgray'})}>
          <div className={vstack({
            alignItems: "center",
            justifyContent: "space-between",
          })}>
            <div className={center({
              fontSize: '2xl',
              fontWeight: "bold",
              color: "primary",
            })}>{course.account.name}</div>
            <div>{schoolName}</div>
            {
              subscription ?
                <Badge size="lg">Subscribed</Badge>
              :
                <Badge 
                  onClick={handleSubscription} 
                  size="lg"
                  variant="solid"
                  className={css({
                    _hover: {
                      cursor: "pointer",
                      backgroundColor: "green",
                      transform: "scale(1.1)" 
                    }
                  })}
                >Buy course (3 SOL)</Badge>
            }
          </div>
        </div>
    }
    </>
  );
}