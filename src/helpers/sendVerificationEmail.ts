import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log(`\n[LOCAL TESTING] Verification Code for ${username}: ${verifyCode}\n`);
    await resend.emails.send({
      from: 'devharsh.com',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    })
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email (but allowing signup to proceed locally):', emailError);
    return { success: true, message: 'Verification code logged to console.' };
  }
}
