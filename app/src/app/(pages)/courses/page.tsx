'use client'

import { useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useProgramProvider } from '~/app/context/blockchain'
import CourseCardSubscription from '~/app/components/cards/courseCardSubscription'
import Loading from '~/app/components/loading'
import { grid } from 'styled-system/patterns'

export default function CoursesPage() {
  const wallet = useWallet()
  const { CourseContext } = useProgramProvider()
  const { courses, isLoading, error, selectCourse } = CourseContext

  useEffect(() => {
    if (wallet.publicKey) {
      selectCourse(null) // Reset course selection when the page loads
    }
  }, [wallet.publicKey, selectCourse])

  if (!wallet.publicKey) return <div>Please connect your wallet</div>
  if (error) return <div>Error: {error.toString()}</div>

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={grid({
            gap: 6,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
            gridAutoRows: "minmax(200px, 1fr)",
          })}>
            {courses?.map((course) => (
              <CourseCardSubscription 
                key={course.publicKey.toBase58()} 
                coursePublicKey={course.publicKey}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}