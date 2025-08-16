import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const results = [];
    const testName = "Test User";

    // Test 1: Welcome Email
    try {
      const welcomeResult = await sendEmail({
        to: email,
        ...emailTemplates.welcome(testName),
      });
      results.push({
        template: "Welcome Email",
        success: welcomeResult.success,
        id: welcomeResult.id,
        error: welcomeResult.error,
      });
    } catch (error) {
      results.push({
        template: "Welcome Email",
        success: false,
        error: error.message,
      });
    }

    // Test 2: Email Verification
    try {
      const verificationResult = await sendEmail({
        to: email,
        ...emailTemplates.emailVerification(testName, "http://localhost:3000/verify?token=test"),
      });
      results.push({
        template: "Email Verification",
        success: verificationResult.success,
        id: verificationResult.id,
        error: verificationResult.error,
      });
    } catch (error) {
      results.push({
        template: "Email Verification",
        success: false,
        error: error.message,
      });
    }

    // Test 3: Password Reset
    try {
      const resetResult = await sendEmail({
        to: email,
        ...emailTemplates.passwordReset(testName, "http://localhost:3000/reset?token=test"),
      });
      results.push({
        template: "Password Reset",
        success: resetResult.success,
        id: resetResult.id,
        error: resetResult.error,
      });
    } catch (error) {
      results.push({
        template: "Password Reset",
        success: false,
        error: error.message,
      });
    }

    // Test 4: Points Earned
    try {
      const pointsResult = await sendEmail({
        to: email,
        ...emailTemplates.pointsEarned(testName, 150, "Plastic"),
      });
      results.push({
        template: "Points Earned",
        success: pointsResult.success,
        id: pointsResult.id,
        error: pointsResult.error,
      });
    } catch (error) {
      results.push({
        template: "Points Earned",
        success: false,
        error: error.message,
      });
    }

    // Test 5: Level Up
    try {
      const levelResult = await sendEmail({
        to: email,
        ...emailTemplates.levelUp(testName, 5),
      });
      results.push({
        template: "Level Up",
        success: levelResult.success,
        id: levelResult.id,
        error: levelResult.error,
      });
    } catch (error) {
      results.push({
        template: "Level Up",
        success: false,
        error: error.message,
      });
    }

    // Test 6: 2FA Setup
    try {
      const twoFactorResult = await sendEmail({
        to: email,
        ...emailTemplates.twoFactorSetup(testName, "JBSWY3DPEHPK3PXP", ["123456", "234567", "345678", "456789", "567890"]),
      });
      results.push({
        template: "2FA Setup",
        success: twoFactorResult.success,
        id: twoFactorResult.id,
        error: twoFactorResult.error,
      });
    } catch (error) {
      results.push({
        template: "2FA Setup",
        success: false,
        error: error.message,
      });
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: true,
      message: `Email test completed: ${successCount}/${totalCount} templates successful`,
      results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
      },
    });

  } catch (error) {
    console.error("Test all emails error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
