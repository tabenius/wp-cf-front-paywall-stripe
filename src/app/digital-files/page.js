import { auth } from "@/auth";
import DigitalFilesStorefront from "@/components/digital/DigitalFilesStorefront";
import { listAccessibleDigitalProductIds, grantDigitalAccess } from "@/lib/digitalAccessStore";
import { listDigitalProducts } from "@/lib/digitalProducts";
import { fetchStripeCheckoutSession, isStripeEnabled } from "@/lib/stripe";

export const metadata = {
  title: "Digitala filer",
};

export default async function DigitalFilesPage({ searchParams }) {
  const session = await auth();
  const userEmail = session?.user?.email || "";

  const checkoutStatus =
    typeof searchParams?.checkout === "string" ? searchParams.checkout : "";
  const checkoutSessionId =
    typeof searchParams?.session_id === "string" ? searchParams.session_id : "";
  const checkoutProductId =
    typeof searchParams?.product_id === "string" ? searchParams.product_id : "";

  if (userEmail && checkoutStatus === "success" && checkoutSessionId && checkoutProductId) {
    try {
      const stripeSession = await fetchStripeCheckoutSession(checkoutSessionId);
      const paymentStatus = stripeSession?.payment_status;
      const paidEmail = (
        stripeSession?.customer_details?.email ||
        stripeSession?.metadata?.user_email ||
        ""
      ).toLowerCase();
      const purchaseKind = stripeSession?.metadata?.purchase_kind || "";
      const paidProductId = stripeSession?.metadata?.digital_product_id || "";

      if (
        paymentStatus === "paid" &&
        purchaseKind === "digital_file" &&
        paidEmail === userEmail.toLowerCase() &&
        paidProductId === checkoutProductId
      ) {
        await grantDigitalAccess(paidProductId, userEmail);
      }
    } catch (error) {
      console.error("Failed to confirm digital purchase:", error);
    }
  }

  const [products, ownedProductIds] = await Promise.all([
    listDigitalProducts(),
    userEmail ? listAccessibleDigitalProductIds(userEmail) : Promise.resolve([]),
  ]);

  return (
    <DigitalFilesStorefront
      user={session?.user || null}
      products={products}
      ownedProductIds={ownedProductIds}
      stripeEnabled={isStripeEnabled()}
      checkoutStatus={checkoutStatus}
    />
  );
}
