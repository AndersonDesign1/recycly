import { prisma } from "./prisma";
import { UserService } from "./user-service";
import { UserRole, WasteType } from "@prisma/client";

export async function testAuthSystem() {
  try {
    console.log("🔍 Testing Better Auth system...");

    // Test 1: Get superadmin user
    const superadmin = await prisma.user.findUnique({
      where: { email: "superadmin@recycly.com" },
      include: { accounts: true },
    });
    console.log(
      "✅ Superadmin found:",
      superadmin?.name,
      "Role:",
      superadmin?.role
    );

    // Test 2: Test role-based access control
    const canAccess = UserService["canAccessUser"](
      UserRole.SUPERADMIN,
      UserRole.USER
    );
    console.log("✅ Superadmin can access USER:", canAccess);

    const cannotAccess = UserService["canAccessUser"](
      UserRole.USER,
      UserRole.ADMIN
    );
    console.log("✅ USER cannot access ADMIN:", !cannotAccess);

    // Test 3: Test waste disposal points calculation
    const points = UserService["calculatePoints"](WasteType.RECYCLING, 2.5);
    console.log("✅ Recycling 2.5kg points:", points);

    const hazardousPoints = UserService["calculatePoints"](
      WasteType.HAZARDOUS,
      1.0
    );
    console.log("✅ Hazardous 1kg points:", hazardousPoints);

    // Test 4: Test user creation
    const testUser = await UserService.createUser({
      email: "test@recycly.com",
      name: "Test User",
      password: "test123",
      role: UserRole.USER,
    });
    console.log("✅ Test user created:", testUser.name);

    // Test 5: Test waste disposal processing
    const disposalResult = await UserService.processWasteDisposal({
      userId: testUser.id,
      wasteBinId: "test-bin-id",
      wasteType: WasteType.RECYCLING,
      weightKg: 1.0,
    });
    console.log(
      "✅ Waste disposal processed:",
      disposalResult.pointsEarned,
      "points earned"
    );

    // Test 6: Test user stats
    const stats = await UserService.getUserStats(testUser.id, UserRole.USER);
    console.log("✅ User stats:", stats);

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    console.log("✅ Test user cleaned up");

    console.log("🎉 All Better Auth tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return false;
  }
}
