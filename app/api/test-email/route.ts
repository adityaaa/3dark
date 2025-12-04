// app/api/test-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json(
        { error: "Email address required" },
        { status: 400 }
      );
    }

    // Send test email
    const result = await sendEmail({
      to,
      subject: "Test Email from 3Dark",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px;">
            <h1 style="color: #000; margin-bottom: 20px;">✅ Email Service Working!</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              Congratulations! Your Resend email service is configured correctly.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
              This is a test email from <strong>3Dark</strong>.
            </p>
            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Email Service:</strong> Resend<br/>
                <strong>Status:</strong> ✅ Active<br/>
                <strong>Sent from:</strong> 3Dark E-commerce Platform
              </p>
            </div>
            <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
              You can now safely delete the <code>EMAIL_SETUP.txt</code> file from your project.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (!result || !result.success) {
      return NextResponse.json(
        { 
          error: "Failed to send email", 
          details: result?.error || "RESEND_API_KEY may not be configured"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send test email" },
      { status: 500 }
    );
  }
}
