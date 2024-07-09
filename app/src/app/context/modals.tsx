'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface ICreateCourseModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IAskGroupExchangeModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type ModalsContextType = {
  CreateCourseModalContext: ICreateCourseModal;
  AskGroupExchangeModalContext: IAskGroupExchangeModal;
};

// Create a context for the smart contract wallet
const ModalsProviderContext = createContext<ModalsContextType | null>(null)

// Define the props for the wallet provider
interface ModalsProviderProps {
  children: ReactNode
}

// WalletProvider component to wrap your app
export const ModalsProvider: React.FC<ModalsProviderProps> = ({
  children,
}): JSX.Element => {
  const [openCreateCourseModal, setOpenCreateCourseModal] = useState<boolean>(false)
  const [openAskGroupExchangeModal, setOpenAskGroupExchangeModal] = useState<boolean>(false)

  const CreateCourseModalContext = {
    open: openCreateCourseModal,
    setOpen: setOpenCreateCourseModal,
  }

  const AskGroupExchangeModalContext = {
    open: openAskGroupExchangeModal,
    setOpen: setOpenAskGroupExchangeModal,
  }

  return (
    <ModalsProviderContext.Provider
      value={{
        CreateCourseModalContext,
        AskGroupExchangeModalContext,
      }}
    >
      {children}
    </ModalsProviderContext.Provider>
  )
}

// Custom hook to access the smart contract wallet from any component
export const useModalsProvider = (): ModalsContextType => {
  const context = useContext(ModalsProviderContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
