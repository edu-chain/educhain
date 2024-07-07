import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "../target/types/educhain";
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from 'chai';
import bs58 from 'bs58';

// TODO: Split into multiple individual tests

describe("educhain", () => {

  async function create_wallet_with_sol() : Promise<Keypair> {
    const wallet = new Keypair()
    let tx = await program.provider.connection.requestAirdrop(wallet.publicKey, 1000 * LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(tx);
    return wallet
  }
 
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

  async function student_subscription(da_course: PublicKey, wallet: Keypair, name) : Promise<PublicKey> {
    const [da_subscription] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("subscription"),
        da_course.toBuffer(),
        wallet.publicKey.toBuffer()
      ], program.programId);

    let tx = await program.methods.studentSubscription(name)
      .accounts({ 
        course: da_course,
        subscription: da_subscription,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet])
      .rpc();
    return da_subscription;
  };

  async function student_attendance(da_course: PublicKey, da_subscription: PublicKey, da_session: PublicKey, wallet: Keypair) : Promise<PublicKey> {
    const [da_attendance] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("attendance"),
        da_session.toBuffer(),
        wallet.publicKey.toBuffer()
      ], program.programId);

    let tx = await program.methods.studentAttendance()
      .accounts({ 
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

  async function create_group(da_school: PublicKey, course_id: Number, group_id:Number, students: PublicKey[], wallet: Keypair) : Promise<PublicKey> {
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

    let tx = await program.methods.createGroup(/* students */)
      .accounts({ 
        course: da_course,
        group: da_group,
        signer: wallet.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet])
      .rpc();
    return da_group;
  };

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Educhain as Program<Educhain>;

  it("Some tests", async () => {

    // Create 2 wallet2 with some SOL
    const wallet1 = await create_wallet_with_sol();
    const wallet2 = await create_wallet_with_sol();

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
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
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
      await create_session(da_school2, 1 /* course id */, 1 /* session id */, wallet1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // Try to create a session linked to course3, using wallet2, but with school1
    try {
      await create_session(da_school1, 1, 1, wallet2);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
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

    // Create some students
    const student1 = await create_wallet_with_sol();
    const student2 = await create_wallet_with_sol();
    const student3 = await create_wallet_with_sol();
    const student4 = await create_wallet_with_sol();
    const student5 = await create_wallet_with_sol();
    const student6 = await create_wallet_with_sol();
    const student7 = await create_wallet_with_sol();

    // student1, student2, student7 wants to join course1
    const sub_student1_course1 = await student_subscription(da_course1, student1, "Bob");
    const sub_student2_course1 = await student_subscription(da_course1, student2, "Alice");
    const sub_student7_course1 = await student_subscription(da_course1, student7, "John");

    // student2, student7 also wants to join course2
    const sub_student2_course2 = await student_subscription(da_course2, student2, "Alice");
    const sub_student7_course2 = await student_subscription(da_course2, student7, "John");

    // student3,4,5,6 on course2
    const sub_student3_course2 = await student_subscription(da_course2, student3, "Paul");
    const sub_student4_course2 = await student_subscription(da_course2, student4, "Jessie");
    const sub_student5_course2 = await student_subscription(da_course2, student5, "Jack");
    const sub_student6_course2 = await student_subscription(da_course2, student6, "Steve");

    // student1 tries to subscribe again to course1
    try {
      await student_subscription(da_course1, student1, "Bob");
      expect.fail("Should fail");
    } catch (err) {
      // TODO: no error code in this case ? Find a better way...
      expect(err).to.have.property("transactionLogs");
      expect(err.transactionLogs.some(log => log.includes("already in use"))).to.be.true;
    }

    // Check course2 of school1
    let ret = await program.account.courseDataAccount.all([
      // course.school==school1 && course.id==2
      {
        memcmp: {
          offset: 8+8, // offset to school field
          bytes: school1.publicKey
        } 
      },
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: bs58.encode((new BN(2)).toBuffer('le', 8))
        } 
      },
    ]);
    expect(ret.length).to.equal(1);
    let course2_of_school1 = ret[0];
    expect(course2_of_school1.account.id.eq(new anchor.BN(2))).to.be.true;
    expect(course2_of_school1.account.name).to.equal("Defi");
    expect(course2_of_school1.account.sessionsCounter.eq(new anchor.BN(4))).to.be.true;

    // Get sudents of school1 > course2
    ret = await program.account.studentSubscriptionDataAccount.all([
      // subscription.course==course2_of_school1
      {
        memcmp: {
          offset: 8, // offset to course field
          bytes: course2_of_school1.publicKey
        } 
      }
    ]);
    expect(ret.length).to.equal(6);
    expect(ret.some(obj => obj.account.name === "Bob")).to.be.false;
    expect(ret.some(obj => obj.account.name === "Alice")).to.be.true;
    expect(ret.some(obj => obj.account.name === "Paul")).to.be.true;

    // Get sudents of school1 > course2
    ret = await program.account.studentSubscriptionDataAccount.all([
      // subscription.course==course2_of_school1
      {
        memcmp: {
          offset: 8, // offset to course field
          bytes: course2_of_school1.publicKey
        } 
      }
    ]);
    expect(ret.length).to.equal(6);
    expect(ret.some(obj => obj.account.name === "Bob")).to.be.false;

    /*
    // Check course1 of school 1:
    ret = await program.account.courseDataAccount.all([
      // course.school==school1 && course.id==1
      {
        memcmp: {
          offset: 8+8, // offset to school field
          bytes: school1.publicKey
        } 
      },
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: bs58.encode((new BN(1)).toBuffer('le', 8))
        } 
      },
    ]);
    console.log(ret);

    // Check session1 of course1 of school 1:
    ret = await program.account.sessionDataAccount.all([
      // session.course==course1 && session.id=1
      {
        memcmp: {
          offset: 8+8, // offset to course field
          bytes: ret[0].publicKey
        } 
      },
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: bs58.encode((new BN(1)).toBuffer('le', 8))
        } 
      },
    ]);
    console.log(ret);
    */

    // TODO: data/time management

    // student3 tries to sign for student2
    try {
      await student_attendance(da_course2, sub_student2_course2, da_session1, student3);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // student2 signs the attendence sheet for session1 of course2 (school 1)
    await student_attendance(da_course2, sub_student2_course2, da_session1, student2);

    // student2 tries to sign twice the same session
    try {
      await student_attendance(da_course2, sub_student2_course2, da_session1, student2);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("transactionLogs");
      expect(err.transactionLogs.some(log => log.includes("already in use"))).to.be.true;
    }

    // student2 signs the attendence sheet for session2 of course2 (school 1)
    await student_attendance(da_course2, sub_student2_course2, da_session2, student2);

    // school admin creates a group
    // TODO: use a course admin wallet
    let group1 = await create_group(da_school1, 2 /* course id */, 1 /* group id */, [student2, student3], wallet1);

    // Student1 wants to change group

    // Student2 changes group
  });
});
