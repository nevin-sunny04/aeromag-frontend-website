import RenderStep from '@/app/components/subscription/renderStep';
import Steps from '@/app/components/subscription/steps';
import { apiRequest } from '@/lib/apiClient';

export const dynamic = 'force-dynamic';

async function getPlans() {
  const data = await apiRequest('plans/', { next: { revalidate: 3600, tags: ['plans'] } });
  return data;
}

export default async function Page() {
  const plans = await getPlans();

  return (
    <div className="relative  z-1">
      <div className="border shadow-md lg:w-max w-[95vw]  md:mx-auto relative z-1 bg-primary/5 dark:bg-transparent  border-[#eff0f6] dark:border-gray-500 h-full md:p-10 p-7 rounded-lg">
        <Steps />
        <RenderStep plans={plans} />
      </div>
      {/* <div
        // style={{ backgroundImage: 'url("/pattern1.png")' }}
        className="absolute bg-primary/20 dark:bg-black  top-0 rounded-lg right-0 w-full h-full -z-[1]"
      /> */}
    </div>
  );
}
