import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata = {
  title: "Choose a new password · CredTek",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
