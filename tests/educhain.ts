import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "../target/types/educhain";
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from 'chai';
import bs58 from 'bs58';

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

  async function create_course(name: String, da_school: PublicKey, course_id:Number, course_admins: PublicKey[], wallet: Keypair) : Promise<PublicKey> {
    const [da_course] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        da_school.toBuffer(),
        new BN(course_id).toArrayLike(Buffer, "le", 8)
      ], program.programId);

    let tx = await program.methods.createCourse(name, course_admins)
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

  async function create_group(da_school: PublicKey, course_id: Number, group_id:Number, wallet: Keypair) : Promise<PublicKey> {
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

    let tx = await program.methods.createGroup()
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

  async function add_student_to_group(da_course: PublicKey, da_subscription: PublicKey, da_group: PubkicKey, wallet: Keypair) {
    let tx = await program.methods.addStudentToGroup()
      .accounts({ 
        course: da_course,
        subscription: da_subscription,
        group: da_group,
        signer: wallet.publicKey
      })
      .signers([wallet])
      .rpc();
  };

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Educhain as Program<Educhain>;

  // Wallets declarations
  let wallet1, wallet2: Keypair;	// owners of school1 and school2
  let course1_admin1, course1_admin2, course2_admin1, course3_admin1: Keypair;

  // Data-accounts declarations
  let da_school1, da_school2: PublicKey;
  let da_course1, da_course2, da_course3: PublicKey;
  let da_session1, da_session2, da_session3, da_session4, da_session5: PublicKey;
  let student1, student2, student3, student4, student5, student6, student7: PublicKey;
  let sub_student1_course1, sub_student2_course1, sub_student7_course1, sub_student2_course2, sub_student7_course2, sub_student3_course2, sub_student4_course2, sub_student5_course2, sub_student6_course2: PublicKey;  
  let da_group1, da_group2: PublicKey;
  
  it("Create 2 schools, each with its own wallet", async () => {
    wallet1 = await create_wallet_with_sol();
    wallet2 = await create_wallet_with_sol();

    da_school1 = await create_school("Ecole 1", wallet1);
    da_school2 = await create_school("Ecole 2", wallet2);
  });

  it("Create course1, linked to school1", async () => {
    course1_admin1 = await create_wallet_with_sol();
    course1_admin2 = await create_wallet_with_sol();

    da_course1 = await create_course(
      "Dev", 
      da_school1, 
      1, // course id
      [course1_admin1.publicKey, course1_admin2.publicKey],
      wallet1);
  });

  it("Trying to create a course with 3 admins (should fail)", async () => {
    let tmp_admin1 = await create_wallet_with_sol();
    let tmp_admin2 = await create_wallet_with_sol();
    let tmp_admin3 = await create_wallet_with_sol();

    try {
      await create_course(
        "Wrong",
        da_school1,
        2,
        [tmp_admin1.publicKey, tmp_admin2.publicKey, tmp_admin3.publicKey],
        wallet1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ExceedingMaximumAdmins");
    }
  });

  it("Create course2, linked to school1", async () => {
    course2_admin1 = await create_wallet_with_sol();

    da_course2 = await create_course(
      "Defi",
      da_school1,
      2,
      [course2_admin1.publicKey],
      wallet1);
  });

  it("Try to create a course, linked to school2, using wallet1 (should fail)", async () => {
    try {
      let tmp_admin = await create_wallet_with_sol();
      await create_course("Wrong", da_school2, 1, [tmp_admin.publicKey], wallet1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Create course3, linked to school2, using wallet2", async () => {
    course3_admin1 = await create_wallet_with_sol();

    da_course3 = await create_course(
      "Consultant", 
      da_school2, 
      1, // course id in school 2
      [course3_admin1.publicKey],
      wallet2);
  });

  it("Create some sessions linked to course2 (school1)", async () => {
    da_session1 = await create_session(da_school1, 2 /* course id */, 1 /* session id */, wallet1);
    da_session2 = await create_session(da_school1, 2, 2, wallet1);
    da_session3 = await create_session(da_school1, 2, 3, wallet1);
    da_session4 = await create_session(da_school1, 2, 4, wallet1);
  });

  it("Try to create a session linked to course3, using wallet1 (should fail)", async () => {
    try {
      await create_session(da_school2, 1 /* course id */, 1 /* session id */, wallet1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Try to create a session linked to course3, using wallet2, but with school1 (should fail)", async () => {
    try {
      await create_session(da_school1, 1, 1, wallet2);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Create a session linked to course3, using wallet2, on school 2", async () => {
    da_session5 = await create_session(da_school2, 1 /* course id */, 1 /* session id */, wallet2);
  });

  it("Check school1", async () => {
    let schools_wallet1 = await program.account.schoolDataAccount.all([{
      memcmp: {
        offset: 8, // offset to owner field
        bytes: wallet1.publicKey.toBase58(),
      }
    }]);
    let check_school1 = schools_wallet1[0];
    expect(check_school1.account.coursesCounter.eq(new anchor.BN(2))).to.be.true; // TODO: Why .account object ?
  });

  it("Create some students", async () => {
    student1 = await create_wallet_with_sol();
    student2 = await create_wallet_with_sol();
    student3 = await create_wallet_with_sol();
    student4 = await create_wallet_with_sol();
    student5 = await create_wallet_with_sol();
    student6 = await create_wallet_with_sol();
    student7 = await create_wallet_with_sol();
  });

  it("student1, student2, student7 wants to join course1", async () => {
    sub_student1_course1 = await student_subscription(da_course1, student1, "Bob");
    sub_student2_course1 = await student_subscription(da_course1, student2, "Alice");
    sub_student7_course1 = await student_subscription(da_course1, student7, "John");
  });

  it("student2, student7 also wants to join course2", async () => {
    sub_student2_course2 = await student_subscription(da_course2, student2, "Alice");
    sub_student7_course2 = await student_subscription(da_course2, student7, "John");
  });

  it("student3,4,5,6 on course2", async () => {
    sub_student3_course2 = await student_subscription(da_course2, student3, "Paul");
    sub_student4_course2 = await student_subscription(da_course2, student4, "Jessie");
    sub_student5_course2 = await student_subscription(da_course2, student5, "Jack");
    sub_student6_course2 = await student_subscription(da_course2, student6, "Steve");
  });

  it("student1 tries to subscribe again to course1 (should fail)", async () => {
    try {
      await student_subscription(da_course1, student1, "Bob");
      expect.fail("Should fail");
    } catch (err) {
      // TODO: no error code in this case ? Find a better way...
      expect(err).to.have.property("transactionLogs");
      expect(err.transactionLogs.some(log => log.includes("already in use"))).to.be.true;
    }
  });

  it("Check course2 of school1", async () => {
    let ret = await program.account.courseDataAccount.all([
      // course.school==school1 && course.id==2
      {
        memcmp: {
          offset: 8+8, // offset to school field
          bytes: da_school1
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

    // Check students of this course
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
  });

  /*
  it("TODO - usless test ?", async () => {
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
  });
  */

  it("student3 tries to sign for student2 (should fail)", async () => {

    // TODO: data/time management

    // student3 tries to sign for student2
    try {
      await student_attendance(da_course2, sub_student2_course2, da_session1, student3);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("student2 signs the attendence sheet for session1 of course2 (school 1)", async () => {
    await student_attendance(da_course2, sub_student2_course2, da_session1, student2);
  });

  it("student2 tries to sign twice the same session (should fail)", async () => {
    try {
      await student_attendance(da_course2, sub_student2_course2, da_session1, student2);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("transactionLogs");
      expect(err.transactionLogs.some(log => log.includes("already in use"))).to.be.true;
    }
  });

  it("student2 signs the attendence sheet for session2 of course2 (school 1)", async () => {
    await student_attendance(da_course2, sub_student2_course2, da_session2, student2);
  });

  it("Trying to create a group with wrong course admin (should fail)", async () => {
    try {
      await create_group(
        da_school1, 
        2, // course id
        1, // group id
        course1_admin1	// This wallet is not admin on course2
      );
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("OnlyCourseAdminCanCreateGroup");
    }
  });

  it("course2 admin creates group1 in course2 with 3 students", async () => {
    da_group1 = await create_group(
      da_school1, 
      2, // course id
      1, // group id
      course2_admin1);

    await add_student_to_group(da_course2, sub_student7_course2, da_group1, course2_admin1);
    await add_student_to_group(da_course2, sub_student3_course2, da_group1, course2_admin1);
    await add_student_to_group(da_course2, sub_student4_course2, da_group1, course2_admin1);
  });

  it("Tries to add a 4th member in group1 (should fail)", async () => {
    try {
      await add_student_to_group(da_course2, sub_student2_course2, da_group1, course2_admin1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ExceedingMaximumGroupMembers");
    }
  });

  it("course2 admin creates group2 in course2 with 2 students", async () => {
    da_group2 = await create_group(
      da_school1, 
      2, // course id
      2, // group id
      course2_admin1);

    await add_student_to_group(da_course2, sub_student5_course2, da_group2, course2_admin1);
    await add_student_to_group(da_course2, sub_student6_course2, da_group2, course2_admin1);
  });

  it("Tries to put student1 in group2 (should fail because student1 is not a member of course2)", async () => {
    try {
      await add_student_to_group(
        da_course2, 
        sub_student1_course1, 
        da_group2,
        course2_admin1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Tries to put student4 in group2 (should fail because student4 is already member of group1)", async () => {
    try {
      await add_student_to_group(da_course2, sub_student4_course2, da_group2, course2_admin1);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("StudentIsMemberOfAnotherGroup");
    }
  });

  it("Check group1 members", async () => {
    let ret = await program.account.groupDataAccount.all([
      // group.course==da_course2 && group.id==1
      {
        memcmp: {
          offset: 8+8, // offset to course field
          bytes: da_course2
        } 
      },
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: bs58.encode((new BN(1)).toBuffer('le', 8))
        } 
      }
    ]);
    expect(ret.length).to.equal(1);
    let students = ret[0].account.students;
    expect(students.length).to.equal(3);

    for (let student of students) {
      const [da_subscription] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("subscription"),
          da_course2.toBuffer(),
          student.toBuffer()
        ], program.programId);

      ret = await program.account.studentSubscriptionDataAccount.fetch(da_subscription);
      expect(ret.name==="Paul" || ret.name==="John" || ret.name==="Jessie").to.be.true;
    }
  });

  it("student6 asks to join group1", async () => {
     // TODO
  });

  it("student4 accepts to swap with student6", async () => {
     // TODO
  });
});
