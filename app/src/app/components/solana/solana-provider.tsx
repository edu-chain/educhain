'use client';

import dynamic from 'next/dynamic';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { WalletError } from '@solana/wallet-adapter-base';
import {
  AnchorWallet,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode, useCallback, useMemo } from 'react';
import { useCluster } from '../cluster/cluster-data-access';
import IDL from "api/idl/educhain.json";
import { Educhain } from "api/types/educhain";
import { Connection } from "@solana/web3.js";
import { DappProvider } from '~/app/context/program';


require('@solana/wallet-adapter-react-ui/styles.css');

export const WalletButton = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const endpoint = useMemo(() => cluster.endpoint, [cluster]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
        <DappProvider>
          <WalletModalProvider>{children}</WalletModalProvider>
        </DappProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}


export function useAnchorProvider() {
  const { cluster } = useCluster();
  const connection = new Connection(cluster.endpoint);
  const wallet = useWallet();

  return new AnchorProvider(connection, wallet as AnchorWallet, {
    commitment: 'confirmed',
  });
}

export function useProgram() {
  const provider = useAnchorProvider();
  return new Program<Educhain>(IDL as Educhain, provider);
}