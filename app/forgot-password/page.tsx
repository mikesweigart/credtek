import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = {
  title: "Reset your password · CredTek",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
