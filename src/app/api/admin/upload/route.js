import { NextResponse } from "next/server";
import { getAdminSessionFromCookieHeader } from "@/auth";
import { getWordPressGraphqlAuth } from "@/lib/wordpressGraphqlAuth";
import { isS3Upload, uploadToS3 } from "@/lib/s3upload";
import { t } from "@/lib/i18n";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: t("apiErrors.adminLoginRequired") },
    { status: 401 },
  );
}

async function uploadToWordPress(arrayBuffer, file) {
  const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/+$/, "");
  if (!wpUrl) throw new Error(t("apiErrors.wpUrlMissing"));

  const auth = getWordPressGraphqlAuth();
  if (!auth.authorization) throw new Error(t("apiErrors.wpAuthMissing"));

  const response = await fetch(`${wpUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: auth.authorization,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: arrayBuffer,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("WordPress media upload failed:", response.status, text);
    throw new Error(t("apiErrors.uploadWpFailed", { status: response.status }));
  }

  const media = await response.json();
  return {
    url: media.source_url || "",
    id: media.id,
    title: media.title?.rendered || file.name,
  };
}

export async function POST(request) {
  const session = getAdminSessionFromCookieHeader(
    request.headers.get("cookie") || "",
  );
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { ok: false, error: t("apiErrors.uploadNoFile") },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    if (isS3Upload()) {
      const url = await uploadToS3(
        new Uint8Array(arrayBuffer),
        file.name,
        file.type,
      );
      return NextResponse.json({ ok: true, url, title: file.name });
    }

    const result = await uploadToWordPress(arrayBuffer, file);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || t("apiErrors.uploadFailed") },
      { status: 500 },
    );
  }
}
