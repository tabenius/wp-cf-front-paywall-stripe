import RegisterClient from "./RegisterClient";
import { t } from "@/lib/i18n";

export async function generateMetadata() {
  return { title: t("metadata.register") };
}

export default function RegisterPage() {
  return <RegisterClient />;
}
