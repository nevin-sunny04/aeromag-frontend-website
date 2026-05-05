'use client';

import Link from 'next/link';
import { CareersDataType, JobType } from '@/app/(home_layout)/careers/[slug]/page';
import { Button } from '@/components/ui/button';

interface JobDetailsProps {
  data: CareersDataType;
}

export default function JobDetails({ data }: JobDetailsProps) {
  const job: JobType = data.jobs[0];

 if (job!= null) {
  localStorage.setItem('jobPositionName', job.work_area);
 }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: Job Description */}
      <div className="lg:col-span-2 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-primary mb-2">{job.work_area}</h2>
          <div
            className="text-gray-700 dark:text-white leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.job_description }}
          />
        </section>

        {/* <section>
          <h2 className="text-xl font-semibold text-primary mb-2">
            Lorem ipsum dolor sit amet consectetur.
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
            pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
            aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
            egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
            vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos
            himenaeos.
          </p>
          <br />
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae
            pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu
            aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
            egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper
            vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos
            himenaeos.
          </p>
        </section> */}
      </div>
      <aside className="bg-gray-50 border border-gray-200 rounded-lg p-6 h-fit">
        <Link href={`/careers/apply/${job.requisition_id}/`}>
          <Button className="w-full mb-6">Apply Now</Button>
        </Link>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-gray-900">Requisition ID</dt>
            <dd className="text-gray-600">{job.requisition_id}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Posted Date</dt>
            <dd className="text-gray-600">{new Date(job.posted_date).toLocaleDateString()}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Designation</dt>
            <dd className="text-gray-600">{job.work_area}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Career Status</dt>
            <dd className="text-gray-600">{job.career_status}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Employment Type</dt>
            <dd className="text-gray-600">{job.employment_type}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Expected Travel</dt>
            <dd className="text-gray-600">{job.expected_travel}</dd>
          </div>

          <div>
            <dt className="font-semibold text-gray-900">Location</dt>
            <dd className="text-gray-600">{job.location}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
