import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import { expect } from 'chai';
import bs58 from 'bs58';

import {
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
} from './tests_helpers';

/*
Test dataset:

wallet1
  school1
    course1  (id=1)
      course1_admin1
      course1_admin2
      student1 (Bob)
      student2 (Alice)
      student7 (John)
      group3 (id=1)
    course2  (id=2)
      course2_admin1
      session1 (id=1)
      session2 (id=2)
      session3 (id=3)
      session4 (id=4)
      group1 (id=1)
        student7 (John)
        student3 (Paul)
        student4 (Jessie)
      group2 (id=2)
        student5 (Jack)
        student6 (Steve) -> Wants to join group1. student4 will accept to swap.
      student2 (Alice)

wallet2
  school2
    course3 (id=1)
      course3_admin1
      session5 (id=1)
*/

describe("educhain", () => {

  // Wallets declarations
  let wallet1, wallet2: Keypair;	// owners of school1 and school2
  let course1_admin1, course1_admin2, course2_admin1, course3_admin1: Keypair;

  // Data-accounts declarations
  let da_school1, da_school2: PublicKey;
  let da_course1, da_course2, da_course3: PublicKey;
  let da_session1, da_session2, da_session3, da_session4, da_session5: PublicKey;
  let student1, student2, student3, student4, student5, student6, student7: Keypair; // PublicKey;
  let sub_student1_course1, sub_student2_course1, sub_student7_course1, sub_student2_course2, sub_student7_course2, sub_student3_course2, sub_student4_course2, sub_student5_course2, sub_student6_course2: PublicKey;  
  let da_group1, da_group2, da_group3: PublicKey;
  let student6_swap_request, student5_swap_request: PublicKey;
  
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

  it("student1 trying to join course1 - setting wrong school (should fail)", async () => {
    try {
      await student_subscription(da_school2, da_course1, student1, "Bob", 1, "Java, C#", "Fishing");
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("student1, student2, student7 wants to join course1", async () => {
    let initial_balance_school1 = await program.provider.connection.getBalance(da_school1);
    let initial_balance_student1 = await program.provider.connection.getBalance(student1.publicKey);

    sub_student1_course1 = await student_subscription(da_school1, da_course1, student1, "Bob", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student2_course1 = await student_subscription(da_school1, da_course1, student2, "Alice", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student7_course1 = await student_subscription(da_school1, da_course1, student7, "John", 4, "Solana, Anchor, Rust", "Blockchain");

    let new_balance_school1 = await program.provider.connection.getBalance(da_school1);
    expect(new_balance_school1 - initial_balance_school1).to.equal(9 * LAMPORTS_PER_SOL);

    let new_balance_student1 = await program.provider.connection.getBalance(student1.publicKey);
    expect(new_balance_student1 - initial_balance_student1).to.be.within(-3.1 * LAMPORTS_PER_SOL, -3 * LAMPORTS_PER_SOL); // TODO: Hard to find fees...
  });

  it("student2, student7 also wants to join course2", async () => {
    sub_student2_course2 = await student_subscription(da_school1, da_course2, student2, "Alice", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student7_course2 = await student_subscription(da_school1, da_course2, student7, "John", 4, "Solana, Anchor, Rust", "Blockchain");
  });

  it("student3,4,5,6 on course2", async () => {
    sub_student3_course2 = await student_subscription(da_school1, da_course2, student3, "Paul", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student4_course2 = await student_subscription(da_school1, da_course2, student4, "Jessie", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student5_course2 = await student_subscription(da_school1, da_course2, student5, "Jack", 4, "Solana, Anchor, Rust", "Blockchain");
    sub_student6_course2 = await student_subscription(da_school1, da_course2, student6, "Steve", 4, "Solana, Anchor, Rust", "Blockchain");
  });

  it("student1 tries to subscribe again to course1 (should fail)", async () => {
    try {
      await student_subscription(da_school1, da_course1, student1, "Bob", 4, "Solana, Anchor, Rust", "Blockchain");
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

  it("course1 admin creates group3 in course1", async () => {
    da_group3 = await create_group(
      da_school1, 
      1, // course id (in school 1)
      1, // group id (in course)
      course1_admin1);
  });

  it("student6 asks to join group3 (should fail because group3 is in course1)", async () => {
    try {
      await create_group_swap_request(da_course2, sub_student6_course2, da_group3, student6);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    try {
      await create_group_swap_request(da_course1, sub_student6_course2, da_group3, student6);
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("student6 asks to join group1", async () => {
    student6_swap_request = await create_group_swap_request(da_course2, sub_student6_course2, da_group1, student6);
  });

  it("student5 also asks to join group1", async () => {
    student5_swap_request = await create_group_swap_request(da_course2, sub_student5_course2, da_group1, student5);
  });

  it("swap acceptation - wrong arguments (should fail)", async () => {
    try
    { 
      // wrong school
      await accept_swap(
        da_school2,
        da_course2,
        2,                        // course id
        student6.publicKey,       // requesting student
        sub_student6_course2,     // requesting student subscription
        2,                        // requesting student's initial group id
   
        student6_swap_request,

        student4,                 // signer wallet (student accepting swap from group 1)
        sub_student4_course2,     // signer subscription
        1                         // signer's initial group id
      );
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("AccountNotInitialized");
    }

    try
    { 
      // wrong student swap request
      await accept_swap(
        da_school1,
        da_course2,
        2,                        // course id
        student6.publicKey,       // requesting student
        sub_student6_course2,     // requesting student subscription
        2,                        // requesting student's initial group id
   
        student5_swap_request,

        student4,                 // signer wallet (student accepting swap from group 1)
        sub_student4_course2,     // signer subscription
        1                         // signer's initial group id
      );
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("InvalidStudentConstraint");
    }

    try
    { 
      // wrong group
      await accept_swap(
        da_school1,
        da_course2,
        2,                        // course id
        student6.publicKey,       // requesting student
        sub_student6_course2,     // requesting student subscription
        1,                        // requesting student's initial group id
   
        student6_swap_request,

        student4,                 // signer wallet (student accepting swap from group 1)
        sub_student4_course2,     // signer subscription
        1                         // signer's initial group id
      );
      expect.fail("Should fail");
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("InvalidGroupConstraint");
    }
  });

  it("student4 accepts to swap with student6", async () => {
    let swap_requests = await program.account.groupSwapRequestDataAccount.all();
    expect(swap_requests.length).to.equal(2);

    await accept_swap(
      da_school1,
      da_course2, 
      2,			// course id
      student6.publicKey,	// requesting student
      sub_student6_course2,	// requesting student subscription
      2,			// requesting student's initial group id
   
      student6_swap_request, 

      student4,			// signer wallet (student accepting swap from group 1)
      sub_student4_course2,	// signer subscription
      1				// signer's initial group id
    );

    // Check: The request should have been deleted
    swap_requests = await program.account.groupSwapRequestDataAccount.all();
    expect(swap_requests.length).to.equal(1);
  });

  it("Check group1 new members", async () => {
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

      expect(ret.name==="Paul" || ret.name==="John" || ret.name==="Steve").to.be.true;
      expect(ret.group.toString()).to.equal(da_group1.toString());
    }
  });

  it("Check group2 new members", async () => {
    let ret = await program.account.groupDataAccount.all([
      // group.course==da_course2 && group.id==2
      {
        memcmp: {
          offset: 8+8, // offset to course field
          bytes: da_course2
        } 
      },
      {
        memcmp: {
          offset: 8, // offset to id field
          bytes: bs58.encode((new BN(2)).toBuffer('le', 8))
        } 
      }
    ]);
    expect(ret.length).to.equal(1);
    let students = ret[0].account.students;
    expect(students.length).to.equal(2);

    for (let student of students) {
      const [da_subscription] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("subscription"),
          da_course2.toBuffer(),
          student.toBuffer()
        ], program.programId);

      ret = await program.account.studentSubscriptionDataAccount.fetch(da_subscription);

      expect(ret.name==="Jack" || ret.name==="Jessie").to.be.true;
      expect(ret.group.toString()).to.equal(da_group2.toString());
    }
  });

  it("wallet2 trying to withdraw school1 revenues (should fail)", async () => {
    try {
      await withdraw_revenues(da_school1, wallet2);
    } catch (err) {
      expect(err).to.have.property("error");
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("wallet1: withdraw school1 revenues", async () => {
    let initial_balance_wallet1 = await program.provider.connection.getBalance(wallet1.publicKey);

    await withdraw_revenues(da_school1, wallet1); // This will withdraw all SOLs from school1 data-account, except the rent

    let new_balance_wallet1 = await program.provider.connection.getBalance(wallet1.publicKey);
    expect(new_balance_wallet1 - initial_balance_wallet1).to.equal(9 * 3 * LAMPORTS_PER_SOL);
    
    let new_balance_school1 = await program.provider.connection.getBalance(da_school1);
    const school1_account_info = await program.provider.connection.getAccountInfo(da_school1);
    const rent = await program.provider.connection.getMinimumBalanceForRentExemption(school1_account_info.data.length);
    expect(new_balance_school1).to.equal(rent); // We must keep the rent on school1 data-account
  });
});
