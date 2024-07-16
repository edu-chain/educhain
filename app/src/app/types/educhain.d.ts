import { BN } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"

/*
 * Generic Types
 */
type Infos<T> = {
  publicKey: PublicKey,
  account: T
}

/*
 * School Types
 */

type SchoolAccountData = {
  owner: PublicKey,
  name: string,
  coursesCounter: BN,
}

type SchoolData = {
  owner: PublicKey,
  name: string,
  coursesCounter: BN,
}

/*
 * Course Types
 */
//TODO: rename school to schoolAddress in rust program

type CourseAccountData = {
  id: BN,
  school: PublicKey,
  schoolOwner: PublicKey,
  name: string,
  admins: PublicKey[],
  sessionsCounter: BN,
  groupsCounter: BN,
}

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

/*
 * Session Types
 */
//TODO: rename course to courseAddress in rust program

type SessionAccountData = {
  id: BN,
  course: PublicKey,
  start: BN,
  end: BN,
}

type SessionData = {
  id?: BN,
  course: PublicKey,
  start: BN,
  end: BN,
}

type SessionAccounts = {
  school: PublicKey,
  course: PublicKey,
  session: PublicKey,
  signer: PublicKey,
}

/*
 * Student Subscription Types
 */
type StudentSubscriptionDataAccount = {
  course: PublicKey,
  student: PublicKey,
  groupe?: PublicKey | null,
  active: boolean,
}

type StudentSubscriptionAccounts = {
  school: PublicKey,
  course: PublicKey,
  subscription: PublicKey,
  signer: PublicKey,
}