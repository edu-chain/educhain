import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Educhain } from "../target/types/educhain";
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from 'chai';

describe("educhain", () => {
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

    // Create school1, linked to wallet1
    const [da_school1] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("school"),
        wallet1.publicKey.toBuffer()
      ], program.programId);

    tx = await program.methods.initializeSchool("Alyra")
      .accounts({ 
        school: da_school1,
        signer: wallet1.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet1])
      .rpc();

    // Create school2, linked to wallet2
    const [da_school2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("school"),
        wallet2.publicKey.toBuffer()
      ], program.programId);

    tx = await program.methods.initializeSchool("IUT")
      .accounts({ 
        school: da_school2,
        signer: wallet2.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet2])
      .rpc();

    // Create course1, linked to school1
    const [da_course1] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        da_school1.toBuffer(),
        new BN(1).toArrayLike(Buffer, "le", 8)		// course id
      ], program.programId);

    tx = await program.methods.createCourse("Dev")
      .accounts({ 
        school: da_school1,
        course: da_course1,
        signer: wallet1.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet1])
      .rpc();

    // Create course2, linked to school1
    const [da_course2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        da_school1.toBuffer(),
        new BN(2).toArrayLike(Buffer, "le", 8)		// course id
      ], program.programId);

    tx = await program.methods.createCourse("Defi")
      .accounts({ 
        school: da_school1,
        course: da_course2,
        signer: wallet1.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet1])
      .rpc();

    // Try to create course3, linked to school1, using wallet2
    const [da_course3] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("course"),
        da_school1.toBuffer(),
        new BN(3).toArrayLike(Buffer, "le", 8)		// course id
      ], program.programId);

    try {
      tx = await program.methods.createCourse("Wrong")
        .accounts({ 
          school: da_school1,
          course: da_course3,
          signer: wallet2.publicKey,
          systemProgram: SystemProgram.programId
        })
        .signers([wallet2])
        .rpc();
    } catch (err) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }

    // Create session1 linked to course2 (school1)
    const [da_session1] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("session"),
        da_school1.toBuffer(),
        new BN(2).toArrayLike(Buffer, "le", 8), // course id
        new BN(1).toArrayLike(Buffer, "le", 8), // session id
      ], program.programId);

    tx = await program.methods.createSession(new BN(1), new BN(2) /* TODO: set correct start/end */)
      .accounts({ 
        school: da_school1,
        course: da_course2,
        session: da_session1,
        signer: wallet1.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([wallet1])
      .rpc();

    // Checks
    // let schools = await program.account.schoolDataAccount.all();
    // let courses = await program.account.courseDataAccount.all();
    
  });
});
