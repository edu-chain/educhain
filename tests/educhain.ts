import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "../target/types/educhain";
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from 'chai';

describe("educhain", () => {

  async function create_school(name: String, wallet: Keypair) : Promise<PublicKey> {
    const [da_school] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("school"),
        wallet.publicKey.toBuffer()
      ], program.programId);

    let tx = await program.methods.initializeSchool(name)
      .accounts({ 
        school: da_school,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet])
      .rpc();
    return da_school;
  }

  async function create_course(name: String, da_school: PublicKey, course_id:Number, wallet: Keypair) : Promise<PublicKey> {
    const [da_course] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        da_school.toBuffer(),
        new BN(course_id).toArrayLike(Buffer, "le", 8)
      ], program.programId);

    let tx = await program.methods.createCourse(name)
      .accounts({ 
        school: da_school,
        course: da_course,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet])
      .rpc();
    return da_course;
  } 

  async function create_session(da_school: PublicKey, course_id:Number, session_id:Number, wallet: Keypair) : Promise<PublicKey> {

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

    let tx = await program.methods.createSession(new BN(1), new BN(2)) // TODO: set correct start/end 
      .accounts({ 
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

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Educhain as Program<Educhain>;

  it("Some tests", async () => {

    // Create 2 wallet2 with some SOL
    const wallet1 = new Keypair()
    let tx = await program.provider.connection.requestAirdrop(wallet1.publicKey, 1000 * LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(tx);

    const wallet2 = new Keypair()
    tx = await program.provider.connection.requestAirdrop(wallet2.publicKey, 1000 * LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(tx);

    // Create some schools
    let da_school1 = await create_school("Ecole 1", wallet1);
    let da_school2 = await create_school("Ecole 2", wallet2);

    // Create course1, linked to school1
    let da_course1 = await create_course("Dev", da_school1, 1, wallet1);

    // Create course2, linked to school1
    let da_course2 = await create_course("Defi", da_school1, 2, wallet1);

    // Try to create a course, linked to school2, using wallet1
    try {
      await create_course("Wrong", da_school2, 1, wallet1);
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // Create course3, linked to school2, using wallet2
    let da_course3 = await create_course("Consultant", da_school2, 1, wallet2);

    // Create some sessions linked to course2 (school1)
    let da_session1 = await create_session(da_school1, 2, 1, wallet1);
    let da_session2 = await create_session(da_school1, 2, 2, wallet1);
    let da_session3 = await create_session(da_school1, 2, 3, wallet1);
    let da_session4 = await create_session(da_school1, 2, 4, wallet1);

    // Try to create a session linked to course3, using wallet1
    try {
      await create_session(da_school1, 1, 1, wallet1);
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // Try to create a session linked to course3, using wallet2, but with school1
    try {
      await create_session(da_school1, 1, 1, wallet2);
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // Create a session linked to course3, using wallet2, on school 2
    let da_session5 = await create_session(da_school2, 1 /* course id */, 1 /* session id */, wallet2);

    // Checks
    let schools_wallet1 = await program.account.schoolDataAccount.all([{
      memcmp: {
        offset: 8, // offset to owner field
        bytes: wallet1.publicKey.toBase58(),
      }
    }]);
    let school1 = schools_wallet1[0];
    expect(school1.account.coursesCounter.eq(new anchor.BN(2))).to.be.true; // TODO: Why .account object ?

    /* TODO: Filter does not work
    let course2 = await program.account.courseDataAccount.all([
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: new BN(2).toArrayLike(Buffer, "le", 8)
        } 
      },
      {
        memcmp: {
          offset: 8+8, // offset to school field
          bytes: school1.publicKey
        } 
      },
    ]);
    console.log(course2);
    */
  });
});
