'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface ICreateSchoolModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ICreateCourseModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface ICourseAdminModal {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  courseAddress: string
  setCourseAddress: React.Dispatch<React.SetStateAction<string>>
}

interface IEnrollCourseModal {
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
  CreateSchoolModalContext: ICreateSchoolModal;
  CourseAdminModalContext: ICourseAdminModal;
  EnrollCourseModalContext: IEnrollCourseModal;
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
  const [openCreateSchoolModal, setOpenCreateSchoolModal] = useState<boolean>(false)
  const [openCourseAdminModal, setOpenCourseAdminModal] = useState<boolean>(false)
  const [courseAddress, setCourseAddress] = useState<string>("");
  const [openEnrollCourseModal, setOpenEnrollCourseModal] = useState<boolean>(false)

  const CreateCourseModalContext = {
    open: openCreateCourseModal,
    setOpen: setOpenCreateCourseModal,
  }

  const AskGroupExchangeModalContext = {
    open: openAskGroupExchangeModal,
    setOpen: setOpenAskGroupExchangeModal,
  }

  const CreateSchoolModalContext = {
    open: openCreateSchoolModal,
    setOpen: setOpenCreateSchoolModal,
  }

  const CourseAdminModalContext = {
    open: openCourseAdminModal,
    setOpen: setOpenCourseAdminModal,
    courseAddress: courseAddress,
    setCourseAddress: setCourseAddress,
  }

  const EnrollCourseModalContext = {
    open: openEnrollCourseModal,
    setOpen: setOpenEnrollCourseModal,
  }

  return (
    <ModalsProviderContext.Provider
      value={{
        CreateCourseModalContext,
        AskGroupExchangeModalContext,
        CreateSchoolModalContext,
        CourseAdminModalContext,
        EnrollCourseModalContext
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
