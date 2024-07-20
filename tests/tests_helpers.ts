import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "../target/types/educhain";
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from 'chai';
import bs58 from 'bs58';

anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Educhain as Program<Educhain>;

async function create_wallet_with_sol() : Promise<Keypair> {
  const wallet = new Keypair()
  let tx = await program.provider.connection.requestAirdrop(wallet.publicKey, 1000 * LAMPORTS_PER_SOL);
  let latestBlockhash = await program.provider.connection.getLatestBlockhash();
  await program.provider.connection.confirmTransaction({
    signature: tx,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  }, 'confirmed');
  return wallet
}

async function create_school(
  name: string, 
  wallet: Keypair
) : Promise<PublicKey> {
  const [da_school] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("school"),
      wallet.publicKey.toBuffer()
    ], program.programId);

  await program.methods.initializeSchool(name)
    .accountsPartial({ 
      school: da_school,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_school;
}

async function create_course(
  name: string, 
  da_school: PublicKey, 
  course_id: number, 
  course_admins: PublicKey[], 
  wallet: Keypair
) : Promise<PublicKey> {
  const [da_course] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("course"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8)
    ], program.programId);

  await program.methods.createCourse(name, course_admins)
    .accountsPartial({ 
      school: da_school,
      course: da_course,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_course;
} 

// TODO: Add start/end dates
async function create_session(
  da_school: PublicKey, 
  course_id: number, 
  session_id: number,
  wallet: Keypair
) : Promise<PublicKey> {

  const [da_course] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("course"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8)
    ], program.programId);

  const [da_session] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("session"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8), 
      new BN(session_id).toArrayLike(Buffer, "le", 8),
    ], program.programId);

  await program.methods.createSession(new BN(1), new BN(2)) // TODO: set correct start/end 
    .accountsPartial({ 
      school: da_school,
      course: da_course,
      session: da_session,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_session;
} 

async function student_subscription(
  da_school: PublicKey, 
  da_course: PublicKey, 
  wallet: Keypair, 
  name: string, 
  availability: number, 
  skills: string[], 
  interests: string
) : Promise<PublicKey> {
  let balance1 = await program.provider.connection.getBalance(wallet.publicKey);

  const [da_subscription] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("subscription"),
      da_course.toBuffer(),
      wallet.publicKey.toBuffer()
    ], program.programId);

  let tx = await program.methods.studentSubscription(name, availability, skills, interests)
    .accountsPartial({ 
      school: da_school,
      course: da_course,
      subscription: da_subscription,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();

  let latestBlockhash = await program.provider.connection.getLatestBlockhash();
  await program.provider.connection.confirmTransaction({
    signature: tx,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
  }, 'confirmed');


  const txDetails = await program.provider.connection.getTransaction(
    tx,
    { commitment: 'confirmed', maxSupportedTransactionVersion: undefined });

  let balance2 = await program.provider.connection.getBalance(wallet.publicKey);
  // TODO: fee does not include everything. delta should be equals to 3...
  let delta = balance1 - balance2 - txDetails?.meta?.fee;  
  // console.log(delta);
  // console.log(delta / LAMPORTS_PER_SOL);

  return da_subscription;
};

async function student_attendance(
  da_course: PublicKey, 
  da_subscription: PublicKey, 
  da_session: PublicKey, 
  wallet: Keypair
) : Promise<PublicKey> {
  const [da_attendance] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("attendance"),
      da_session.toBuffer(),
      wallet.publicKey.toBuffer()
    ], program.programId);

  await program.methods.studentAttendance()
    .accountsPartial({ 
      course: da_course,
      subscription: da_subscription,	// Important because we need to check if the subscription exists
      session: da_session,
      attendance: da_attendance,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_attendance;
};

async function create_group(
  da_school: PublicKey, 
  course_id: number, 
  group_id: number, 
  wallet: Keypair
) : Promise<PublicKey> {
  const [da_course] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("course"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8)
    ], program.programId);

  const [da_group] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("group"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8),
      new BN(group_id).toArrayLike(Buffer, "le", 8),
    ], program.programId);

  await program.methods.createGroup()
    .accountsPartial({ 
      course: da_course,
      group: da_group,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_group;
};

async function add_student_to_group(
  da_course: PublicKey, 
  da_subscription: PublicKey, 
  da_group: PublicKey, 
  wallet: Keypair
) {
  await program.methods.addStudentToGroup()
    .accountsPartial({ 
      course: da_course,
      subscription: da_subscription,
      group: da_group,
      signer: wallet.publicKey
    })
    .signers([wallet])
    .rpc();
};

async function create_group_swap_request(
  da_course: PublicKey, 
  da_subscription: PublicKey, 
  da_requested_group: PublicKey, 
  wallet: Keypair
) : Promise<PublicKey> {
  const [da_request] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("swap_request"),
      da_course.toBuffer(),
      da_subscription.toBuffer(),
      wallet.publicKey.toBuffer()
    ], program.programId);

  await program.methods.groupSwapRequest()
    .accountsPartial({ 
      course: da_course,
      subscription: da_subscription,
      requestedGroup: da_requested_group,
      swapRequest: da_request,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
  return da_request;
};

async function accept_swap(
  da_school: PublicKey, 
  da_course: PublicKey, 
  course_id: number,
  da_requesting_student: PublicKey,
  da_requesting_student_subscription: PublicKey,
  requesting_student_group_id: number,
  da_swap_request: PublicKey, 
  signer_wallet: Keypair,  // Signer is the student who accepts the swap
  da_signer_subscription: PublicKey,
  signer_group_id: number
) {
  const [da_requesting_student_group] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("group"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8),
      new BN(requesting_student_group_id).toArrayLike(Buffer, "le", 8),
    ], program.programId);

  const [da_signer_group] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("group"),
      da_school.toBuffer(),
      new BN(course_id).toArrayLike(Buffer, "le", 8),
      new BN(signer_group_id).toArrayLike(Buffer, "le", 8),
    ], program.programId);

  await program.methods.acceptGroupSwap()
    .accountsPartial({
      course: da_course,

      requestingStudent: da_requesting_student,
      requestingStudentSubscription: da_requesting_student_subscription,
      requestingStudentGroup: da_requesting_student_group,

      swapRequest: da_swap_request,

      signer: signer_wallet.publicKey,
      signerSubscription: da_signer_subscription,
      signerGroup: da_signer_group,

      systemProgram: SystemProgram.programId
    })
    .signers([signer_wallet])
    .rpc();
};

async function withdraw_revenues(
  da_school: PublicKey, 
  wallet: Keypair
) {
  await program.methods.withdrawRevenues()
    .accountsPartial({ 
      school: da_school,
      signer: wallet.publicKey,
      systemProgram: SystemProgram.programId
    })
    .signers([wallet])
    .rpc();
}

export {
  create_wallet_with_sol,
  create_school,
  create_course,
  create_session,
  student_subscription,
  student_attendance,
  create_group,
  add_student_to_group,
  create_group_swap_request,
  accept_swap,
  withdraw_revenues,
  program
}