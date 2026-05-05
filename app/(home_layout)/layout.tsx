import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import { apiRequest } from "@/lib/apiClient";
import Footer from "../components/footer";
import Header from "../components/header";
import SuccessModal from "../components/subscription/SuccessModal";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [magazineCat, categories, base] = await Promise.all([
    apiRequest(`/magazines-category`, { next: { revalidate: 0 } }),
    apiRequest(`/news-category/`, { next: { revalidate: 0 } }),
    apiRequest(`/base/`, { next: { revalidate: 0 } }),
  ]);

  // Defensive check for API errors
  const isBaseError = !base || "error" in base;
  const isCategoriesError =
    !categories || "error" in categories || !Array.isArray(categories);
  const isMagazineError = !magazineCat || "error" in magazineCat;

  if (isBaseError) {
    console.error("Layout base data fetch failed:", { base });
  }

  // Fallback values to prevent crash
  const safeBase = isBaseError
    ? {
        logo: [{ image: "", alt_text: "Aeromag" }],
        social_media: [],
        advertisements: [
          { id: 0, url: "#", file: "" },
          { id: 0, url: "#", file: "" },
        ],
        footer_content: "",
        policy: "",
      }
    : base;

  const safeCategories = isCategoriesError ? [] : categories;
  const safeMagazineCat = isMagazineError ? [] : magazineCat;

  return (
    <>
      <Header
        logo={safeBase.logo}
        categories={safeCategories}
        magazineCat={safeMagazineCat}
        social={safeBase.social_media}
        advertisements={safeBase.advertisements}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Suspense fallback={null}>
        <SuccessModal />
      </Suspense>
      {children}
      <Footer
        footerLogo={base.logo}
        social={base.social_media}
        content={base.footer_content}
        policy={base.policy}
      />
    </>
  );
}
