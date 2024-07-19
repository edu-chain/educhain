'use client'

import React, { useEffect, useState } from 'react'
import { css } from 'styled-system/css'
import { hstack, vstack } from 'styled-system/patterns'
import FullLogo from './fullLogo'
import UserMenu from './userMenu'
import dynamic from 'next/dynamic'
import { NavBar } from './navBar'
import { useWallet } from '@solana/wallet-adapter-react'
import { getBalance } from './solana/solana.helpers'
import { PublicKey } from '@solana/web3.js'

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui')
          .then((mod) => mod.WalletMultiButton), { ssr: false });

function Navbar() {

  const [balance, setBalance] = useState<number | null>(null);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.publicKey !== null) {
      const fetchBalance = async () => {
        const balance = await getBalance(wallet.publicKey as PublicKey);
        setBalance(parseFloat(balance.toFixed(2)));
      };
      fetchBalance();
    }
  }, [wallet]);
  
  return (
    <nav className={css({ bg: "ui.background" })}>
      <div className={hstack({ maxWidth: "", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", mx: "auto", p: 4 })}>
        <FullLogo />
        <NavBar />
        <div className={hstack({ alignItems: "center", justifyContent: "flex-end", w: "full", md: { flex: 1, w: "auto" } })} id="navbar-user">
          <UserMenu />
        </div>
        <WalletMultiButton />
        <div>
          {balance && <p>{balance} SOL</p>}
        </div>
      </div>
    </nav>
  )
}

export default Navbar