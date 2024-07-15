import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { CourseData } from "~/app/components/modals/createCourse";

function getSchoolAddress(program: Program<Educhain>, publicKey: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("school"),
      publicKey.toBuffer()
    ],
    program.programId
  );
}

function getCourseAddress(
  program: Program<Educhain>,
  schoolKey: PublicKey,
  curCountCourseSchool: number
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("course"),
      schoolKey.toBuffer(),
      new BN(curCountCourseSchool).toArrayLike(Buffer, 'le', 8),
    ],
    program.programId
  );
}

async function sendTransation(transaction: Transaction, wallet: WalletContextState){

  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = blockhash;
  const signedTransaction = await wallet.signTransaction(transaction);
  const response = await connection.sendRawTransaction(signedTransaction.serialize());
}

export async function getSchoolInfos(
  program: Program<Educhain>,
  publicKey: PublicKey,
) {
  const school = getSchoolAddress(program, publicKey);

  try {
    const schoolData = await program.account.schoolDataAccount.fetch(school[0]);
    return { schoolAddress: school[0], schoolData: schoolData };
  } catch (error) {
    return null;
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

  const adminPublicKeys = [courseData.admin1, courseData.admin2]
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
    program,
    school.schoolAddress,
    school.schoolData.coursesCounter.toNumber() + 1
  );

  const transaction = await program.methods.createCourse(courseData.courseName, adminPublicKeys)
    .accounts({
      school: school.schoolAddress,
      course: course[0],
      signer: wallet.publicKey,
    })
    .transaction();

    sendTransation(transaction, wallet);
}