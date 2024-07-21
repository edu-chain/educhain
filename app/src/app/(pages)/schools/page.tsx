'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { vstack, hstack, grid } from "styled-system/patterns";
import { useProgramProvider } from '~/app/context/blockchain'
import Loading from '~/app/components/loading'
import { css } from 'styled-system/css'
import * as Card from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { School } from "lucide-react";

export default function Schools() {
  const wallet = useWallet();
  const { SchoolContext, GeneralContext } = useProgramProvider();
  const { schools, isLoading, error, selectSchool } = SchoolContext;
  const { selectedItems } = GeneralContext;

  useEffect(() => {
    if (wallet.publicKey) {
      selectSchool(wallet.publicKey);
    }
  }, [wallet.publicKey, selectSchool]);

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div className={css({ p: 6, bg: "gray.50", minHeight: "100vh" })}>
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: 6,
          color: "gray.800",
        })}
      >
        Schools
      </h1>
      <div
        className={grid({
          gap: 6,
          gridTemplateColumns: {
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        })}
      >
        {schools?.map((school) => (
          <Card.Root key={school.publicKey.toString()}>
            <Card.Header>
              <Card.Title className={hstack({ gap: 2, alignItems: "center" })}>
                <School
                  className={css({ color: "blue.500", width: 6, height: 6 })}
                />
                {school.account.name}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Badge
                variant="outline"
                className={css({ alignSelf: "flex-start" })}
              >
                {school.account.coursesCounter.toString()} courses
              </Badge>
              <div
                className={css({
                  fontSize: "sm",
                  color: "gray.600",
                  wordBreak: "break-all",
                  mt: 2,
                })}
              >
                Owner: {school.account.owner.toString()}
              </div>
            </Card.Body>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}