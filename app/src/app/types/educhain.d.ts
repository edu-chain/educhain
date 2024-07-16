import { BN } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"

type SchoolData = {
  owner: PublicKey,
  name: string,
  coursesCounter: BN,
}


//TODO: rename school to schoolAddress in rust program
type CourseData = {
  id?: BN,
  school?: PublicKey,
  schoolOwner?: PublicKey,
  name: string,
  admins: PublicKey[],
  sessionsCounter?: BN,
  groupsCounter?: BN,
  maxStudents?: BN,
  groupSize?: BN,
}

//TODO: rename course to courseAddress in rust program
type SessionData = {
  id?: BN,
  course: PublicKey,
  start: BN,
  end: BN,
}

type Infos<T> = {
  publicKey: PublicKey,
  account: T
}

type SessionAccounts = {
  school: PublicKey,
  course: PublicKey,
  session: PublicKey,
  signer: PublicKey,
}
