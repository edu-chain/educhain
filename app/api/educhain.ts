import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Infos, SchoolData, CourseData, SessionData, SessionAccounts } from "~/app/types/educhain";

const PROGRAM_ID = 'EQTpUfQNeenySvPPvwYw9rfyjC6gPNhnR7YikL8Y41m9';

function getSchoolAddress(
  ownerSchoolKey: PublicKey
) : PublicKey {

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("school"),
      ownerSchoolKey.toBuffer()
    ],
    new PublicKey(PROGRAM_ID)
  )[0];
}

function getCourseAddress(
  schoolAddress: PublicKey,
  curCountCourseSchool: number
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("course"),
      schoolAddress.toBuffer(),
      new BN(curCountCourseSchool).toArrayLike(Buffer, 'le', 8),
    ],
    new PublicKey(PROGRAM_ID)
  )[0];
}

function getSessionAddress(
  schoolAddress: PublicKey,
  courseId: number,
  nextSessionId: number
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("session"),
      schoolAddress.toBuffer(),
      new BN(courseId).toArrayLike(Buffer, 'le', 8),
      new BN(nextSessionId).toArrayLike(Buffer, 'le', 8),
    ],
    new PublicKey(PROGRAM_ID)
  )[0];
}

async function sendTransation(
  transaction: Transaction, wallet: WalletContextState){

  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = blockhash;
  const signedTransaction = await wallet.signTransaction(transaction);
  await connection.sendRawTransaction(signedTransaction.serialize());
}

export async function getSchoolInfos(
  program: Program<Educhain>,
  ownerSchoolKey: PublicKey,
) : Promise<Infos<SchoolData> | null> {
  
  const schoolAddress = getSchoolAddress(ownerSchoolKey);

  try {
    const schoolData = await program.account.schoolDataAccount.fetch(schoolAddress);

    return {
      publicKey: schoolAddress,
      account: schoolData
    };

  } catch (error) {
    return null;
  }
}

export async function getCoursesInfos(
  program: Program<Educhain>,
  schoolAddress: PublicKey
) : Promise<Infos<CourseData>[]> {

  const courses = await program.account.courseDataAccount.all([
    {
      memcmp: {
        offset: 16,
        bytes: schoolAddress.toBase58(),
      },
    },
  ]);

  return courses;
}

export async function getCourseInfos(
  program: Program<Educhain>,
  courseAddress: PublicKey
) : Promise<Infos<CourseData> | null> {
 try {
  const courseData = await program.account.courseDataAccount.fetch(courseAddress);
  return {
    publicKey: courseAddress,
    account: courseData
  };
 } catch (error) {
  return null;
 }
}

export async function getSessionsInfos(
  program: Program<Educhain>,
  courseAddress: PublicKey
) : Promise<Infos<SessionData>[]> {

  try {
    const sessions = await program.account.sessionDataAccount.all([
      {
      memcmp: {
        offset: 16,
        bytes: courseAddress.toBase58(),
      },
      },
    ]);
    return sessions;
  } catch (error) {
    return [];
  }
}

export async function createSchoolDataAccount(
  program: Program<Educhain>,
  wallet: WalletContextState,
  name: string
) {

  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const [school] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("school"),
      wallet.publicKey.toBuffer()
    ],
    program.programId
  );

  const transaction = await program.methods
    .initializeSchool(
      name
    )
    .accounts({
      school: school,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  sendTransation(transaction, wallet);
}

export async function createCourseDataAccount(
  program: Program<Educhain>,
  wallet: WalletContextState,
  courseData: CourseData
) {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const adminPublicKeys = courseData.admins
    .map(admin => {
      if (admin) {
        return new PublicKey(admin);
      }
      return null;
    })
    .filter((admin): admin is PublicKey => admin !== null);

  const school = await getSchoolInfos(program, wallet.publicKey);
  if (!school) {
    throw new Error("School not found");
  }

  const course = getCourseAddress(
    school.publicKey,
    school.account.coursesCounter.toNumber() + 1
  );

  const transaction = await program.methods.createCourse(courseData.name, adminPublicKeys)
    .accounts({
      school: school.publicKey,
      course: course,
      signer: wallet.publicKey,
    })
    .transaction();

    sendTransation(transaction, wallet);
}

export async function createSessionDataAccount(
  program: Program<Educhain>,
  wallet: WalletContextState,
  sessionData: SessionData,
  courseAddress: PublicKey,
  schoolAddress: PublicKey,
) {

  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const course = await program.account.courseDataAccount.fetch(courseAddress);

  const sessionAddress = getSessionAddress(
    schoolAddress,
    course.id.toNumber(),
    course.sessionsCounter.toNumber() + 1
  );
  
  const sessionsAccounts: SessionAccounts = {
    school: schoolAddress,
    course: courseAddress,
    signer: wallet.publicKey,
    session: sessionAddress,
  }
  
  const transaction = await program.methods.createSession(
    sessionData.start,
    sessionData.end
  )
    .accounts(sessionsAccounts)
    .transaction();

  sendTransation(transaction, wallet);
}