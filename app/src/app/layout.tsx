import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import './global.css'
import Navbar from './components/topBar'
import { ModalsProvider } from './context/modals'
import { ThemeProvider } from './context/theme'
import ContentContainer from './contentContainer'
import { ClusterProvider } from './components/cluster/cluster-data-access'
import { SolanaProvider } from './components/solana/solana-provider'

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
          <ClusterProvider>
            <SolanaProvider>
                <ModalsProvider>
              <Navbar />
              <ContentContainer>
                {children}
              </ContentContainer>
            </ModalsProvider>
          </SolanaProvider>
        </ClusterProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}

export default RootLayout
