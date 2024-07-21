'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useProgramProvider } from '~/app/context/blockchain'
import Loading from '~/app/components/loading'

export default function Schools() {
  const wallet = useWallet()
  const { SchoolContext, GeneralContext } = useProgramProvider()
  const { schools, isLoading, error, selectSchool } = SchoolContext
  const { selectedItems } = GeneralContext

  useEffect(() => {
    if (wallet.publicKey) {
      selectSchool(wallet.publicKey)
    }
  }, [wallet.publicKey, selectSchool])

  if (isLoading) return <Loading />
  if (error) return <div>Error: {error.toString()}</div>

  return (
    <div>
      <h1>Schools</h1>
      <ul>
        {schools?.map((school) => (
          <li
            key={school.publicKey.toString()}
            onClick={() => selectSchool(school.publicKey)}
            // isSelected={selectedItems.school?.equals(school.publicKey)}
          >
            {school.account.name}
          </li>
        ))}
      </ul>
    </div>
  );
}