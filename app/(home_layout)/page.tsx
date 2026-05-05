import "@/app/styles/home.css";
import { apiRequest } from "@/lib/apiClient";
import HomeClient from "../components/home/homeClient";

export const revalidate = 300;

export default async function Page() {
  const [base, homeData] = await Promise.all([
    apiRequest(`/base/`, { next: { revalidate: 300, tags: ["base", "home"] } }),
    apiRequest("home", { next: { revalidate: 300, tags: ["home"] } }),
  ]);

  // Defensive check for API errors (e.g. WAF blocking)
  if (
    !base ||
    "error" in base ||
    "detail" in base ||
    !base.sidebar ||
    !homeData ||
    "error" in homeData ||
    "detail" in homeData
  ) {
    console.error("Home page data fetch failed:", { base, homeData });
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Service Temporarily Unavailable
        </h1>
        <p className="text-gray-600">
          We are traversing some turbulence. Please try again in a few moments.
        </p>
      </div>
    );
  }

  return <HomeClient baseSidebar={base.sidebar} initialData={homeData} />;
}
