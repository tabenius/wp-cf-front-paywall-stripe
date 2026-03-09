"use client";

import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

export default function SignOutButton({ className = "" }) {
  const router = useRouter();

  async function onClick() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {t("common.signOut")}
    </button>
  );
}
