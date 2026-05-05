import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { BasicData } from '@/app/components/careers/step1';
import { ExperienceData } from '@/app/components/careers/step2';

interface question {
  id: number;
  question: string;
  answer: string | number | string[] | boolean | number[];
}

// Interface for serialized file data
interface SerializedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: string; // base64 encoded file data
}

export interface careersData {
  currentStep: 1 | 2 | 3 | 4;
  basicInformation?: BasicData;
  workExperience?: ExperienceData;
  applicationQuestions?: question[];
  uploadedFiles?: SerializedFile[]; // Add this to store files separately
}

export interface careerStore {
  data: careersData;
  setData: <K extends keyof careersData>(key: K, value: careersData[K]) => void;
  resetSubs: () => void;
  // Helper method to get files as File objects when needed
  getFilesAsFileObjects: () => File[];
}

export const useJobStore = create<careerStore>()(
  devtools(
    persist(
      (set, get) => ({
        data: {
          sameAsBilling: true,
          currentStep: 1,
        },
        setData: (step, value) =>
          set(
            (state) => ({
              data: { ...state.data, [step]: value },
            }),
            false,
            `setStepData: ${step}`,
          ),
        resetSubs: () =>
          set(
            {
              data: {
                currentStep: 1,
              },
            },
            false,
            'resetsubs',
          ),
        getFilesAsFileObjects: () => {
          const { uploadedFiles } = get().data;
          if (!Array.isArray(uploadedFiles) || !uploadedFiles.length) return [];

          return uploadedFiles.map(({ name, type, lastModified, data }) => {
            const blob = new Blob(
              [Uint8Array.from(atob(data.split(',')[1]), (c) => c.charCodeAt(0))],
              {
                type,
              },
            );
            return new File([blob], name, { type, lastModified });
          });
        },
      }),
      {
        name: 'application-store',
        // Exclude uploaded files from persistence — base64 data can exceed localStorage limits
        partialize: (state) => ({
          data: { ...state.data, uploadedFiles: undefined },
        }),
      },
    ),
    { name: 'ApplicationStore' },
  ),
);
