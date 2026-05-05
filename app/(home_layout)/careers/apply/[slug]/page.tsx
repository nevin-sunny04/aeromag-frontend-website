import RenderStep from '@/app/components/careers/renderStep';
import Steps from '@/app/components/careers/steps';
import Header from '@/app/components/subscription/header';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  return (
    <div className="relative  z-1">
      <Header title="Job Application" />
      <div className="min-h-[calc(100vh-74px)] justify-center flex  py-10 items-center">
        <div className="border shadow-md lg:w-max w-[95vw]  md:mx-auto relative z-1 bg-primary/5 dark:bg-transparent  border-[#eff0f6] dark:border-gray-500 h-full md:p-10 p-7 rounded-lg">
          <Steps jobId={slug} />
          <RenderStep />
        </div>
      </div>
    </div>
  );
}
