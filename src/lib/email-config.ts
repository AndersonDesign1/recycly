export const emailConfig = {
  // Company/Brand Information
  companyName: process.env.APP_NAME || "Recycly",
  companyTagline: process.env.COMPANY_TAGLINE || "Turn Waste Into Rewards",
  companyWebsite: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Sender Information
  senderName: process.env.SENDER_NAME || "Recycly Team",
  fromEmail: process.env.FROM_EMAIL || "noreply@recycly.onresend.com", // Your custom domain
  supportEmail: process.env.SUPPORT_EMAIL || "support@recycly.onresend.com", // Your custom domain

  // Brand Colors
  colors: {
    primary: process.env.PRIMARY_COLOR || "#22c55e",
    secondary: process.env.SECONDARY_COLOR || "#1e88e5",
    accent: process.env.ACCENT_COLOR || "#fbbf24",
  },

  // Footer Information
  footer: {
    copyright: `© ${new Date().getFullYear()} ${
      process.env.APP_NAME || "Recycly"
    }. All rights reserved.`,
    tagline:
      process.env.COMPANY_TAGLINE ||
      "Making waste disposal rewarding and sustainable.",
  },
};

// Helper function to get full sender string
export function getSenderString(customName?: string, customEmail?: string) {
  const name = customName || emailConfig.senderName;
  const email = customEmail || emailConfig.fromEmail;
  return `${name} <${email}>`;
}

// Helper function to get company branding
export function getCompanyBranding() {
  return {
    name: emailConfig.companyName,
    tagline: emailConfig.companyTagline,
    website: emailConfig.companyWebsite,
  };
}
