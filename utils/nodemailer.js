import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_SENDER = process.env.RESEND_SENDER_EMAIL || "DonJay Autos <onboarding@resend.dev>";

/**
 * Sends an OTP email to the user
 */
export const sendOTPEmail = async (email, content, subject = "Your OTP Code") => {
  try {
    const isHtml = typeof content === "string" && content.includes("<");
    
    const html = isHtml ? content : `<p>Your OTP code is <strong>${content}</strong>. It is valid for 10 minutes.</p>`;
    const text = isHtml ? content.replace(/<[^>]*>?/gm, "") : `Your OTP code is ${content}. It is valid for 10 minutes.`;

    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: [email],
      subject,
      html,
      text,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[Resend] Failed to send OTP to ${email}:`, error.message);
    throw error;
  }
};

/**
 * Sends a password reset link to the user
 */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await resend.emails.send({
      from: DEFAULT_SENDER,
      to: [email],
      subject: "Password Reset",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #007bff;">Password Reset</h2>
          <p>You requested a password reset. Click the button below to continue:</p>
          <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
            Reset Password
          </a>
          <p><small style="color: #666;">This link expires in 1 hour. If you didn't request this, please ignore this email.</small></p>
        </div>
      `,
      text: `Reset your password here: ${resetUrl}\n\nThis link expires in 1 hour.`,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`[Resend] Failed to send reset email to ${email}:`, error.message);
    throw error;
  }
};