import React from 'react';
import { css } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { Session } from "~/app/types/all";
import SessionCard from "~/app/components/cards/sessionCard";
import { Heading } from "~/components/ui/heading";
import { Divider } from 'styled-system/jsx';

type props = {
  sessions: Session[]
}

function SessionMap({ sessions }: props) {
  const firstLockedIndex = sessions.findIndex(session => session.status === 'locked');

  return (
    <div className={css({ overflowX: 'auto', width: '100%', pb: 4 })}>
      <Heading className={css({padding: 2, paddingBottom: 4})}>Sessions:</Heading>
      <div className={hstack({alignItems: 'center' })}>
        {sessions.map((session, index) => (
          <React.Fragment key={session.id}>
            <SessionCard name={session.name} status={session.status} />
            { index < sessions.length - 1 && (
              <Divider width="22px" padding="0px" color="black" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default SessionMap;
