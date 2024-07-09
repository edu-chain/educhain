import React from 'react';
import { css } from "styled-system/css";
import {Lock, Clock, Check} from "lucide-react";
import { SessionStatus } from '~/app/types/all';



type Props = {
  name: string;
  status: SessionStatus;
}

function SessionCard({ name, status }: Props) {
  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'validated':
        return <Check color="green" />;
      case 'in_progress':
        return <Clock color="blue" />;
      case 'locked':
        return <Lock color="red" />;
    }
  };

  return (
    <div
      className={css({
        p: 4,
        borderRadius: 'md',
        boxShadow: 'md',
        height: '80px',
        width: '200px',
        bg: 'white',
        _dark: { bg: 'gray.800' },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <div className={css({ position: 'absolute', top: '0px', right: '0px' })}>
        {getStatusIcon(status)}
      </div>
      <h3 className={css({ fontWeight: 'bold', mb: 2, color: 'gray.800', _dark: { color: 'white' } })}>
        {name}
      </h3>
    </div>
  );
}



export default SessionCard;
