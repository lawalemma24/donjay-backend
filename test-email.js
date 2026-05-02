import dotenv from "dotenv";
import { sendOTPEmail } from "./utils/nodemailer.js";

dotenv.config();

const RECIPIENTS = ["babawalealameen64@gmail.com", "lawalemma24@gmail.com"];

const runTest = async () => {
  console.log(`🚀 Starting Resend integration test...`);
  
  for (const email of RECIPIENTS) {
    console.log(`📧 Sending to: ${email}`);
    try {
      const result = await sendOTPEmail(email, "123456", "DonJay Test OTP");
      console.log(`✅ Success for ${email}! ID:`, result.id);
    } catch (error) {
      console.error(`❌ Failed for ${email}:`, error.message);
    }
  }
};

runTest();