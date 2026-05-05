'use client';
import {
  BriefcaseIcon,
  EditIcon,
  FileTextIcon,
  GraduationCapIcon,
  LinkedinIcon,
  Loader2,
  MessageSquareIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import type { BasicData } from '@/app/components/careers/step1';
import type { ExperienceData } from '@/app/components/careers/step2';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ReviewGrid, ReviewItem, ReviewSection } from '@/components/ui/reviewSection';
import { Separator } from '@/components/ui/separator';
import { useJobStore } from '@/store/jobStore';
import { ApplyJob } from './applyJob';

// Define the serialized file interface
interface SerializedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: string; // base64 encoded file data
}

export default function Step4() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, setData } = useJobStore();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const basicInfo = data.basicInformation as BasicData;
  const workExperience = data.workExperience as ExperienceData;
  const applicationQuestions = data.applicationQuestions;

  // Helper function to convert base64 back to File object
  const base64ToFile = (serializedFile: SerializedFile): File => {
    const base64Data = serializedFile.data.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: serializedFile.type });

    return new File([blob], serializedFile.name, {
      type: serializedFile.type,
      lastModified: serializedFile.lastModified,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const [month, year] = dateString.split('/');
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${monthNames[Number.parseInt(month) - 1]} ${year}`;
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSubmit = async () => {
    if (!accepted) {
      setError('Kindly Agree to the terms to continue');
      return;
    } else {
      setError('');
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const requisition_id = localStorage.getItem('jobRequisitionId');
      const position =  localStorage.getItem('jobPositionName');

      if (requisition_id) {
        formData.append('requisition_id', requisition_id);
      }

      if (position) {
        formData.append('position_name', position);
      }

      // ✅ 1. Basic Information
      const basic = data.basicInformation;
      if (basic) {
        formData.append('name', basic.legalName);
        formData.append('email', basic.email);
        formData.append('phone', basic.phoneNumber);
        formData.append('country', basic.country);
      }

      // ✅ 2. LinkedIn URL
      const exp = data.workExperience;
      if (exp?.linkedinUrl) {
        formData.append('linkedin_url', exp.linkedinUrl);
      }

      // ✅ 3. Questions (as stringified JSON array)
      if (data.applicationQuestions) {
        const formattedQuestions = data.applicationQuestions.map((que) => ({
          question: que.question,
          answer: que.answer,
        }));
        formData.append('questions', JSON.stringify(formattedQuestions));
      }

      // ✅ 4. Education (multiple entries)
      const educationArray =
        exp?.education?.map((edu) => ({
          degree: edu.degree,
          institution: edu.institution,
          from: edu.fromDate, // Convert fromDate → from
          to: edu.toDate,
        })) || [];
      formData.append('education', JSON.stringify(educationArray));

      // ✅ 5. Work Experience
      const experienceArray =
        exp?.workExperiences?.map((work) => ({
          company: work.company,
          position: work.jobTitle,
          from: work.fromDate,
          to: work.toDate || '',
          description: work.roleDescription,
        })) || [];
      formData.append('experience', JSON.stringify(experienceArray));

      // ✅ 6. Files - Handle both serialized files and direct FileList
      if (exp?.resumeFiles) {
        // Check if it's serialized files (array) or FileList
        if (Array.isArray(exp.resumeFiles)) {
          // Handle serialized files
          const serializedFiles = exp.resumeFiles as SerializedFile[];
          serializedFiles.forEach((serializedFile) => {
            const file = base64ToFile(serializedFile);
            formData.append('files', file);
          });
        } else if (exp.resumeFiles instanceof FileList) {
          // Handle FileList (if somehow it's still a FileList)
          Array.from(exp.resumeFiles).forEach((file: File) => {
            formData.append('files', file);
          });
        }
      }

      // Alternative: Use uploadedFiles from store if available
      if (data.uploadedFiles && data.uploadedFiles.length > 0) {
        data.uploadedFiles.forEach((serializedFile) => {
          const file = base64ToFile(serializedFile);
          formData.append('files', file);
        });
      }
      console.log("form data", formData);
      const response = await ApplyJob(formData);
      console.log("apply job client response", response);
      if (response.success === true) {
        toast.success(response.message, {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'light',
          transition: Slide,
        });
        localStorage.removeItem('jobRequisitionId');
        localStorage.removeItem('jobPositionName');
        router.push('/');
      } else {
        toast.error(response.message || 'Failed to submit application. Please try again.', {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'light',
          transition: Slide,
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(`Failed to submit application. Please try again.`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        transition: Slide,
      });
    }

    setIsSubmitting(false);
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setData('currentStep', step);
  };

  // Get files for display - handle both serialized and FileList formats
  const getFilesForDisplay = (): Array<{ name: string; size: number }> => {
    if (workExperience?.resumeFiles) {
      if (Array.isArray(workExperience.resumeFiles)) {
        // Serialized files
        return workExperience.resumeFiles as SerializedFile[];
      } else if (workExperience.resumeFiles instanceof FileList) {
        // FileList
        return Array.from(workExperience.resumeFiles);
      }
    }

    // Fallback to uploadedFiles from store
    if (data.uploadedFiles && data.uploadedFiles.length > 0) {
      return data.uploadedFiles;
    }

    return [];
  };

  const displayFiles = getFilesForDisplay();

  return (
    <div className="space-y-6 lg:w-[800px]">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-medium">Review Your Application</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please review all information before submitting your application
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <ReviewSection
          title="Personal Information"
          icon={<UserIcon className="w-5 h-5 text-primary" />}
        >
          <div className="space-y-4">
            <ReviewGrid>
              <ReviewItem
                label="Legal Name"
                value={basicInfo?.legalName}
              />
              <ReviewItem
                label="Email Address"
                value={basicInfo?.email}
              />
              <ReviewItem
                label="Phone Number"
                value={
                  basicInfo
                    ? `${basicInfo.countryCode} ${basicInfo.phoneNumber} (${basicInfo.phoneType})`
                    : undefined
                }
              />
              <ReviewItem
                label="Country"
                value={basicInfo?.country}
              />
              <ReviewItem
                label="How did you hear about us?"
                value={basicInfo?.howDidYouHear}
              />
              <ReviewItem
                label="Previously worked here?"
                value={basicInfo?.workedBefore === 'yes' ? 'Yes' : 'No'}
              />
            </ReviewGrid>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(1)}
              >
                <EditIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </ReviewSection>

        {/* Education */}
        <ReviewSection
          title="Education"
          icon={<GraduationCapIcon className="w-5 h-5 text-primary" />}
        >
          <div className="space-y-4">
            {workExperience?.education?.map((edu, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-secondary rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{edu.degree}</h4>
                  <Badge variant="default">Education {index + 1}</Badge>
                </div>
                <ReviewGrid>
                  <ReviewItem
                    label="Institution"
                    value={edu.institution}
                  />
                  <ReviewItem
                    label="Duration"
                    value={`${formatDate(edu.fromDate)} - ${formatDate(edu.toDate)}`}
                  />
                </ReviewGrid>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToStep(2)}
              >
                <EditIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </ReviewSection>

        {/* Work Experience */}
        {workExperience?.workExperiences && workExperience.workExperiences.length > 0 && (
          <ReviewSection
            title="Work Experience"
            icon={<BriefcaseIcon className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-4">
              {workExperience.workExperiences.map((work, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-secondary rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{work.jobTitle}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{work.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="default">Work {index + 1}</Badge>
                      {work.currentlyWorking && (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ReviewGrid>
                    <ReviewItem
                      label="Duration"
                      value={`${formatDate(work.fromDate)} - ${
                        work.currentlyWorking ? 'Present' : formatDate(work.toDate || '')
                      }`}
                    />
                    <ReviewItem
                      label="Currently Working"
                      value={work.currentlyWorking ? 'Yes' : 'No'}
                    />
                  </ReviewGrid>
                  <Separator className="my-3" />
                  <ReviewItem
                    label="Role Description"
                    value={
                      <div className="mt-1 p-3 bg-white dark:bg-secondary rounded border text-sm">
                        {work.roleDescription}
                      </div>
                    }
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(2)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </ReviewSection>
        )}

        {/* Resume Files */}
        {displayFiles.length > 0 && (
          <ReviewSection
            title="Resume & Documents"
            icon={<FileTextIcon className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                {displayFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 dark:bg-secondary rounded-lg"
                  >
                    {/* Left side */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <FileTextIcon className="w-4 h-4 text-gray-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white wrap-break-word">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    {/* Right side */}
                    <div className="sm:ml-3">
                      <Badge variant="outline">{file.name.split('.').pop()?.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              {/* Edit button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(2)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </ReviewSection>
        )}

        {/* LinkedIn Profile */}
        {workExperience?.linkedinUrl && (
          <ReviewSection
            title="Social Network"
            icon={<LinkedinIcon className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-4">
              <ReviewItem
                label="LinkedIn Profile"
                value={
                  <a
                    href={workExperience.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    {workExperience.linkedinUrl}
                  </a>
                }
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(2)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </ReviewSection>
        )}

        {/* Application Questions */}
        {applicationQuestions && applicationQuestions.length > 0 && (
          <ReviewSection
            title="Application Questions"
            icon={<MessageSquareIcon className="w-5 h-5 text-primary" />}
          >
            <div className="space-y-4">
              {applicationQuestions.map((que) => (
                <div
                  key={que.question}
                  className="p-4 bg-gray-50 dark:bg-secondary rounded-lg"
                >
                  <ReviewItem
                    label={que.question}
                    value={
                      <div className="mt-1 p-3 bg-white dark:bg-secondary rounded border text-sm">
                        <p className="wrap-break-word whitespace-pre-line">
                          {Array.isArray(que.answer) ? que.answer.join(', ') : String(que.answer)}
                        </p>
                      </div>
                    }
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(3)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </ReviewSection>
        )}
      </div>

      {/* Submission Section */}
      <div className="pt-6 border-t dark:border-gray-700">
        <div className="text-sm flex items-center">
          <Checkbox
            className="me-2"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          I hereby agree to Aeromag&apos;s Employees, Candidates, and Workers{' '}
          <Link
            className="text-primary ms-2"
            target="_blank"
            href="/policy/employee-privacy-notice"
          >
            Privacy Notice.
          </Link>
        </div>
        {error && <p className="text-sm text-red-500 mt-5">{error}</p>}
        <div className="flex justify-between mt-5 gap-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => goToStep(3)}
            disabled={isSubmitting}
          >
            Previous
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 dark:text-white!"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
