'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useJobStore } from '@/store/jobStore';
import { GetCountries } from './getCountries';
import { GetCodes } from './getcodes';

const formSchema = z.object({
  howDidYouHear: z.string().min(1, 'Please enter this field'),
  workedBefore: z.enum(['yes', 'no']),
  country: z.enum(['India'], {
    error: () => ({ message: 'Please select a country' }),
  }),
  legalName: z.string().min(1, 'Please enter your legal name'),
  email: z.string().email('Please enter a valid email address'),
  phoneType: z.string().min(1, 'Please select a phone type'),
  countryCode: z.string().min(1, 'Please select a country code'),
  phoneNumber: z.string().min(1, 'Please enter your phone number'),
});

export type BasicData = z.infer<typeof formSchema>;

export default function Step1() {
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [codes, setCodes] = useState([]);
  const { data, setData } = useJobStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicData>({
    resolver: zodResolver(formSchema),
    defaultValues: data.basicInformation || {
      howDidYouHear: '',
      workedBefore: 'no',
      country: 'India',
      legalName: '',
      email: '',
      phoneType: 'Mobile',
      countryCode: '+91',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    async function getcountry() {
      const response = await GetCountries();
      setCountries(response);
    }
    getcountry();
  }, []);

  useEffect(() => {
    async function getcodes() {
      const response = await GetCodes();
      const orgArray = [...new Set(response)];
      setCodes(orgArray as SetStateAction<never[]>);
    }
    getcodes();
  }, []);

  const onSubmit = async (data: BasicData) => {
    setIsLoading(true);
    setData('basicInformation', data);
    setIsLoading(false);

    setData('currentStep', 2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 lg:w-[700px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <h3 className="text-xl font-medium text-center">My Information</h3>

        <div className="space-y-2">
          <Label className="text-[16px]">How Did You Hear About Us?*</Label>
          <Input
            className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            {...register('howDidYouHear')}
            placeholder="Enter response"
          />
          {errors.howDidYouHear && (
            <p className="text-sm text-red-500">{errors.howDidYouHear.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[16px]">Have you previously worked for Aeromagasia?*</Label>
          <RadioGroup
            defaultValue="no"
            {...register('workedBefore')}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="yes"
                id="yes"
              />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="no"
                id="no"
              />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
          {errors.workedBefore && (
            <p className="text-sm text-red-500">{errors.workedBefore.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[16px]">Country*</Label>
          <Select
            defaultValue={data.basicInformation?.country || 'India'}
            {...register('country')}
          >
            <SelectTrigger className="peer mt-3 bg-white dark:bg-secondary w-full border placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-sm px-4 h-[40px] text-sm focus-visible:ring-0">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem
                  value={country}
                  key={country}
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-[16px]">Legal Name*</Label>
          <Input
            className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            {...register('legalName')}
            placeholder="Enter your name"
          />
          {errors.legalName && <p className="text-sm text-red-500">{errors.legalName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-[16px]">Email*</Label>
          <Input
            className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-[16px]">Phone</Label>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-1">
              <Label className="text-[16px]">Phone Device Type*</Label>
              <Select
                defaultValue={data.basicInformation?.phoneType || 'Mobile'}
                {...register('phoneType')}
              >
                <SelectTrigger className="peer mt-3 bg-white dark:bg-secondary  w-full border placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-sm px-4 h-[40px] text-sm focus-visible:ring-0">
                  <SelectValue placeholder="Device Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Landline">Landline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 space-y-1">
              <Label className="text-[16px]">Country Phone Code*</Label>
              <Select
                defaultValue={data.basicInformation?.countryCode || '+91'}
                {...register('countryCode')}
              >
                <SelectTrigger className="peer mt-3 bg-white dark:bg-secondary w-full border placeholder:font-medium placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-sm px-4 h-[40px] text-sm focus-visible:ring-0">
                  <SelectValue placeholder="Country Code" />
                </SelectTrigger>
                <SelectContent>
                  {codes.map((code) => (
                    <SelectItem
                      value={code}
                      key={code}
                    >
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 space-y-1">
              <Label className="text-[16px]">Phone Number*</Label>
              <Input
                className="mt-3 w-full border placeholder:font-normal bg-white dark:bg-secondary placeholder:text-gray-500 placeholder:text-sm  border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                {...register('phoneNumber')}
                placeholder="1234567890"
              />
            </div>
          </div>
          {(errors.phoneType || errors.countryCode || errors.phoneNumber) && (
            <p className="text-sm text-red-500">Please fill all phone fields correctly</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
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
      </form>
    </div>
  );
}
