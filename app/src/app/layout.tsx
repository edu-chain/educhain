import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import './global.css'
import Navbar from './components/topBar'
import { ModalsProvider } from './context/modals'
import { ThemeProvider } from './context/theme'
import ContentContainer from './contentContainer'
import { ClusterProvider } from './components/cluster/cluster-data-access'
import { SolanaProvider } from './components/solana/solana-provider'
import { ProgramProvider } from './context/blockchain'
import ClientWrapper from './clientWrapper'

  export const metadata: Metadata = {
  title: 'EduChain',
  description: 'Platform for education on Solana',
}

const RootLayout = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <html lang="en">
      <ThemeProvider>
        <body>
          <ClientWrapper>
            <ClusterProvider>
              <SolanaProvider>
                <ProgramProvider>
                  <ModalsProvider>
                    <Navbar />
                    <ContentContainer>{children}</ContentContainer>
                  </ModalsProvider>
                </ProgramProvider>
              </SolanaProvider>
            </ClusterProvider>
          </ClientWrapper>
        </body>
      </ThemeProvider>
    </html>
  );
}

export default RootLayout
