import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "@api/types/educhain";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { 
  Infos,
  SchoolData,
  CourseData, 
  SessionData, 
  SessionAccounts, 
  StudentSubscriptionDataAccount, 
  StudentSubscriptionAccounts, 
  WithdrawalAccounts,
  AttendanceAccountData,
  AttendanceAccounts
} from "~/app/types/educhain";

const PROGRAM_ID = 'BMuxBtE1aJ8dJdjjXybV81iYUiR4ribMuc6HALfEYSBH';

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

function getStudentSubscriptionAddress(
  studentAddress: PublicKey,
  courseAddress: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("subscription"),
      courseAddress.toBuffer(),
      studentAddress.toBuffer(),
    ],
    new PublicKey(PROGRAM_ID)
  )[0];
}

function getAttendanceAddress(
  sessionAddress: PublicKey,
  studentAddress: PublicKey,
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("attendance"),
      sessionAddress.toBuffer(),
      studentAddress.toBuffer(),
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

export async function getAttendanceInfosFromStudentAndCourse(
  program: Program<Educhain>,
  courseAddress: PublicKey,
  studentAddress: PublicKey
) : Promise<Infos<AttendanceAccountData | null>[]> {

  const sessions = await getSessionsInfosFromCourse(program, courseAddress);
  const attendancesAddresses = sessions
    .map(session => getAttendanceAddress(session.publicKey, studentAddress));

  const attendances = await program.account.studentAttendanceProofDataAccount.fetchMultiple(
    attendancesAddresses
  );

  return attendances.map((attendance, index) => ({
    publicKey: attendancesAddresses[index],
    account: attendance
  }));
}

export async function getCoursesInfosFromSchool(
  program: Program<Educhain>,
  schoolAddress: PublicKey
) : Promise<Infos<CourseData>[]> {
  try {
    const courses = await program.account.courseDataAccount.all([
      {
        memcmp: {
          offset: 16,
          bytes: schoolAddress.toBase58(),
        },
      },
    ]);
    return courses;
  } catch (error) {
    return [];
  }
}

export async function getCoursesInfosFromStudent(
  program: Program<Educhain>,
  studentAddress: PublicKey
) : Promise<Infos<CourseData>[]> {

  const subscriptions = await program.account.studentSubscriptionDataAccount.all(
    [
    {
      memcmp: {
        offset: 40,
        bytes: studentAddress.toBase58(),
      },
    },
  ]
);

  const courses = await program.account.courseDataAccount.fetchMultiple(
    subscriptions.map(subscription => subscription.account.course)
  );

  const coursesMapped = courses.map((course, index) => ({
    publicKey: subscriptions[index].account.course,
    account: course
  }));

  return coursesMapped as Infos<CourseData>[];
}

export async function getCoursesExcludingStudentCourses(
  program: Program<Educhain>,
  studentAddress: PublicKey
) : Promise<Infos<CourseData>[]> {

  const subscriptions = await program.account.studentSubscriptionDataAccount.all([
    {
      memcmp: {
        offset: 40,
        bytes: studentAddress.toBase58(),
      },
    },
  ]);

  const courses = await program.account.courseDataAccount.all();

  const studentCourses = subscriptions.map(subscription => subscription.account.course.toBase58());

  const coursesFiltered = courses.filter(course => !studentCourses.includes(course.publicKey.toBase58()));

  return coursesFiltered;
}

export async function getSessionsInfosFromCourse(
  program: Program<Educhain>,
  courseAddress: PublicKey
) : Promise<Infos<SessionData>[]> {

  const sessions = await program.account.sessionDataAccount.all([
    {
      memcmp: {
        offset: 16,
        bytes: courseAddress.toBase58(),
      },
    },
  ]);

  return sessions;
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

export async function getStudentSubscriptionInfos(
  program: Program<Educhain>,
  studentAddress: PublicKey,
  courseAddress: PublicKey
) : Promise<StudentSubscriptionDataAccount | null> {

  const studentSubscriptionAddress = getStudentSubscriptionAddress(
    studentAddress,
    courseAddress
  );

  try {
    const studentSubscriptionData = await program.account.studentSubscriptionDataAccount.fetch(
      studentSubscriptionAddress
    );
    return studentSubscriptionData;
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
    .accountsPartial({
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
    .accountsPartial({
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

export async function subscribeToCourse(
  program: Program<Educhain>,
  wallet: WalletContextState,
  studentSubscriptionData: StudentSubscriptionDataAccount
) {

  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const studentSubscriptionAddress = getStudentSubscriptionAddress(
    wallet.publicKey,
    studentSubscriptionData.course
  );

  const course = await program.account.courseDataAccount.fetch(studentSubscriptionData.course);

  const studentSubscriptionAccounts: StudentSubscriptionAccounts = {
    school: course.school,
    course: studentSubscriptionData.course,
    subscription: studentSubscriptionAddress,
    signer: wallet.publicKey,
  }

  const transaction = await program.methods.studentSubscription(
    studentSubscriptionData.name,
    studentSubscriptionData.availability,
    studentSubscriptionData.skills,
    studentSubscriptionData.interests
  )
    .accounts(studentSubscriptionAccounts)
    .transaction();

  sendTransation(transaction, wallet);

  return true;
}

export async function withdrawal(
  program: Program<Educhain>,
  wallet: WalletContextState,
  schoolAddress: PublicKey,
) {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet error!");
  }

  const withdrawalAccounts: WithdrawalAccounts = {
    school: schoolAddress,
    signer: wallet.publicKey,
  }

  const transaction = await program.methods.withdrawRevenues()
    .accounts(withdrawalAccounts)
    .transaction();

  sendTransation(transaction, wallet);
}

export async function signAttendance(
  program: Program<Educhain>,
  courseAddress: PublicKey,
  sessionAddress: PublicKey,
  signer: WalletContextState,
) {

  if (!signer || !signer.publicKey || !signer.signTransaction) {
    throw new Error("Wallet error!");
  }

  const subscriptionAddress = getStudentSubscriptionAddress(
    signer.publicKey,
    courseAddress
  );

  const attendanceAddress = getAttendanceAddress(
    sessionAddress,
    signer.publicKey
  );

  const attendanceAccounts: AttendanceAccounts = {
    course: courseAddress,
    session: sessionAddress,
    subscription: subscriptionAddress,
    attendance: attendanceAddress,
    signer: signer.publicKey,
  }

  const transaction = await program.methods.studentAttendance()
    .accounts(attendanceAccounts)
    .transaction();

  sendTransation(transaction, signer);
}

export async function getStudentsFromCourse(
  program: Program<Educhain>,
  courseAddress: PublicKey
) : Promise<Infos<StudentSubscriptionDataAccount>[]> {
  const subscriptions = await program.account.studentSubscriptionDataAccount.all([
    {
      memcmp: {
        offset: 8,
        bytes: courseAddress.toBase58(),
      },
    },
  ]);

  return subscriptions;
}
