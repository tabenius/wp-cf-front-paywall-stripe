import AdminLoginClient from "./LoginClient";
import { t } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: t("metadata.adminLogin") };
}

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
