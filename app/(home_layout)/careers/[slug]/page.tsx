import Banner from '@/app/components/careers/banner';
import JobDetails from '@/app/components/careers/jobDetails';
import { apiRequest } from '@/lib/apiClient';

export async function generateMetadata() {
  return {
    title: 'Careers',
    description: 'Explore career opportunities at Aeromagasia',
    keywords: 'Careers, Jobs, Aeromagasia, Opportunities',
  };
}

export interface JobType {
  id: number;
  requisition_id: string;
  position_name: string;
  posted_date: string;
  work_area: string;
  work_area_slug: string;
  career_status: string;
  employment_type: string;
  expected_travel: string;
  location: string;
  job_description: string;
  active: boolean;
}

export interface CareersDataType {
  banner: string | null;
  jobs: JobType[];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  let data: CareersDataType | null = null;

  try {
    const res = await apiRequest(`/career/${slug}`);
    if (!res) throw new Error('No data returned from API');
    data = res as CareersDataType;
    console.log(res)
  } catch (err) {
    console.error('Failed to fetch career details:', err);
  }

  // Defensive handling for all edge cases
  const hasJobs = Array.isArray(data?.jobs) && data.jobs.length > 0;

  if (!hasJobs || !data) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Job Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
          The job you&apos;re looking for might have been removed or is temporarily unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Only render banner if available */}
      {data.banner ? <Banner imageUrl={data.banner} /> : null}
      <JobDetails data={data} />
    </div>
  );
}
