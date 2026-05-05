'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MonthYearPickerLimited from '@/components/ui/mont-year-picker';
import { Textarea } from '@/components/ui/textarea';
import { useJobStore } from '@/store/jobStore';

const MAX_TOTAL_SIZE_MB = 10;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

const workExperienceSchema = z
  .object({
    jobTitle: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company is required'),
    currentlyWorking: z.boolean(),
    fromDate: z.string().min(1, 'From date is required'),
    toDate: z.string().optional(),
    roleDescription: z.string().min(1, 'Role description is required'),
  })
  .refine(
    (data) => {
      if (!data.toDate || data.currentlyWorking) return true;
      const [fromMonth, fromYear] = data.fromDate.split('/').map(Number);
      const [toMonth, toYear] = data.toDate.split('/').map(Number);
      if (fromYear > toYear) return false;
      if (fromYear === toYear && fromMonth > toMonth) return false;
      return true;
    },
    { message: 'End date must be after start date', path: ['toDate'] },
  );

const educationSchema = z
  .object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    fromDate: z.string().min(1, 'From date is required'),
    toDate: z.string().min(1, 'To date is required'),
  })
  .refine(
    (data) => {
      const [fromMonth, fromYear] = data.fromDate.split('/').map(Number);
      const [toMonth, toYear] = data.toDate.split('/').map(Number);
      if (fromYear > toYear) return false;
      if (fromYear === toYear && fromMonth > toMonth) return false;
      return true;
    },
    { message: 'End date must be after start date', path: ['toDate'] },
  );

const formSchema = z.object({
  workExperiences: z.array(workExperienceSchema).optional(),
  education: z.array(educationSchema).min(1, 'At least one education entry is required'),
  resumeFiles: z
    .any()
    .refine((files) => files && (files as FileList).length > 0, {
      message: 'Please upload at least one file',
    })
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const fileArray = Array.from(files as FileList);
        const totalSize = fileArray.reduce((acc, file: File) => acc + file.size, 0);
        return totalSize <= MAX_TOTAL_SIZE_BYTES;
      },
      { message: `Total file size must not exceed ${MAX_TOTAL_SIZE_MB}MB` },
    ),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
});

export type ExperienceData = z.infer<typeof formSchema>;

export default function Step2() {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { data, setData } = useJobStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceData>({
    resolver: zodResolver(formSchema),
    defaultValues: data.workExperience || {
      workExperiences: [],
      education: [{ degree: '', institution: '', fromDate: '', toDate: '' }],
      linkedinUrl: '',
    },
  });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: 'workExperiences',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  });

  const watchCurrentlyWorking = watch('workExperiences');
  const watchFiles = watch('resumeFiles');
  const uploadedFiles = watchFiles ? Array.from(watchFiles as FileList) : [];

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const currentFiles = uploadedFiles;
      const newFiles = Array.from(e.dataTransfer.files);
      const dt = new DataTransfer();
      [...currentFiles, ...newFiles].forEach((file) => dt.items.add(file));
      setValue('resumeFiles', dt.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const currentFiles = uploadedFiles;
      const newFiles = Array.from(e.target.files);
      const dt = new DataTransfer();
      [...currentFiles, ...newFiles].forEach((file) => dt.items.add(file));
      setValue('resumeFiles', dt.files);
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = uploadedFiles;
    const newFiles = currentFiles.filter((_, i) => i !== index);
    const dt = new DataTransfer();
    newFiles.forEach((file) => dt.items.add(file));
    setValue('resumeFiles', dt.files);
  };

  const onSubmit = async (formData: ExperienceData) => {
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      formPayload.append('education', JSON.stringify(formData.education));
      formPayload.append('experience', JSON.stringify(formData.workExperiences || []));
      formPayload.append('linkedinUrl', formData.linkedinUrl || '');

      // Append files once
      uploadedFiles.forEach((file) => {
        formPayload.append('files', file);
      });

      setData('workExperience', formData);

      setData('currentStep', 3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 lg:w-[700px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <h3 className="text-xl font-medium text-center">My Experience</h3>

        {/* Education Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-red-500">Education</h4>
          {educationFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 bg-white dark:bg-secondary border border-gray-200 dark:border-gray-800 rounded-md"
            >
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Education {index + 1}</h5>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[16px]">Degree</Label>
                <Input
                  {...register(`education.${index}.degree`)}
                  placeholder="Bachelor's Degree"
                  className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                />
                {errors.education?.[index]?.degree && (
                  <p className="text-sm text-red-500">{errors.education[index]?.degree?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[16px]">Institution</Label>
                <Input
                  {...register(`education.${index}.institution`)}
                  placeholder="University Name"
                  className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                />
                {errors.education?.[index]?.institution && (
                  <p className="text-sm text-red-500">
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <MonthYearPickerLimited
                  label="From*"
                  value={watch(`education.${index}.fromDate`)}
                  onChange={(value) => setValue(`education.${index}.fromDate`, value)}
                  error={errors.education?.[index]?.fromDate?.message}
                />
                <MonthYearPickerLimited
                  label="To*"
                  value={watch(`education.${index}.toDate`)}
                  onChange={(value) => setValue(`education.${index}.toDate`, value)}
                  error={errors.education?.[index]?.toDate?.message}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              appendEducation({ degree: '', institution: '', fromDate: '', toDate: '' })
            }
            className="w-full"
          >
            Add Education
          </Button>
        </div>

        {/* Work Experience Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-red-500">Work Experience</h4>
          {workFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 border bg-white dark:bg-secondary border-gray-200 dark:border-gray-800 rounded-md"
            >
              <div className="flex justify-between items-center">
                <h5 className="font-medium">Work Experience {index + 1}</h5>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeWork(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  {...register(`workExperiences.${index}.jobTitle`)}
                  placeholder="Job Title"
                  className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  {...register(`workExperiences.${index}.company`)}
                  placeholder="Company Name"
                  className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                />
                {errors.workExperiences?.[index]?.company && (
                  <p className="text-sm text-red-500">
                    {errors.workExperiences[index]?.company?.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`currently-working-${index}`}
                  {...register(`workExperiences.${index}.currentlyWorking`)}
                />
                <Label htmlFor={`currently-working-${index}`}>I currently work here</Label>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <MonthYearPickerLimited
                  label="From*"
                  value={watch(`workExperiences.${index}.fromDate`)}
                  onChange={(value) => setValue(`workExperiences.${index}.fromDate`, value)}
                  error={errors.workExperiences?.[index]?.fromDate?.message}
                />
                <MonthYearPickerLimited
                  label="To*"
                  value={watch(`workExperiences.${index}.toDate`)}
                  onChange={(value) => setValue(`workExperiences.${index}.toDate`, value)}
                  disabled={watchCurrentlyWorking?.[index]?.currentlyWorking}
                  error={errors.workExperiences?.[index]?.toDate?.message}
                  placeholder={
                    watchCurrentlyWorking?.[index]?.currentlyWorking
                      ? 'Present'
                      : 'Select month/year'
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Role Description*</Label>
                <Textarea
                  {...register(`workExperiences.${index}.roleDescription`)}
                  placeholder="Describe your role..."
                  className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 py-3 text-xs focus-visible:ring-0 min-h-[100px]"
                />
                {errors.workExperiences?.[index]?.roleDescription && (
                  <p className="text-sm text-red-500">
                    {errors.workExperiences[index]?.roleDescription?.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              appendWork({
                jobTitle: '',
                company: '',
                currentlyWorking: false,
                fromDate: '',
                toDate: '',
                roleDescription: '',
              })
            }
            className="w-full"
          >
            Add Work Experience
          </Button>
        </div>

        {/* Resume/CV Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-red-500">Resume/CV/Cover Letter</h4>
          <p className="text-sm text-gray-600">You can upload several documents (10MB max)</p>

          <div
            className={`border-2 bg-white dark:bg-secondary border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 dark:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drop files here</p>
            <p className="text-gray-500 mb-4">or</p>
            <label className="cursor-pointer">
              <span className="text-red-500 hover:text-red-600">Select files</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium">Uploaded Files:</h5>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 px-3 bg-white dark:bg-secondary border-2 border-primary rounded-md"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          {typeof errors.resumeFiles?.message === 'string' && (
            <p className="text-sm text-red-500">{errors.resumeFiles.message}</p>
          )}
        </div>

        {/* Social URLs */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-red-500">Social Network URLs</h4>
          <p className="text-sm text-gray-600">
            If you wish you can provide your LinkedIn profile (full URL starting with https://)
          </p>
          <div className="space-y-2">
            <Input
              {...register('linkedinUrl')}
              placeholder="https://linkedin.com/in/yourprofile"
              className="mt-3 w-full border placeholder:text-gray-500 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            />
            {errors.linkedinUrl && (
              <p className="text-sm text-red-500">{errors.linkedinUrl.message}</p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 gap-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setData('currentStep', 1)}
          >
            Previous
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 dark:!text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
