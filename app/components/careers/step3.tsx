"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Question } from "@/app/utils/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import QuestionField from "@/components/ui/questionfield";
import { useJobStore } from "@/store/jobStore";
import { getQuestions } from "./getQues";

// Dynamic schema builder
const createFormSchema = (questions: Question[]) => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  questions.forEach((question) => {
    let fieldSchema;

    switch (question.type) {
      case "text":
      case "textarea":
        fieldSchema = z.string();
        if (question.required) {
          fieldSchema = fieldSchema.min(1, `${question.question} is required`);
        }
        if (question.validation?.minLength) {
          fieldSchema = fieldSchema.min(
            question.validation.minLength,
            `Minimum ${question.validation.minLength} characters required`,
          );
        }
        if (question.validation?.maxLength) {
          fieldSchema = fieldSchema.max(
            question.validation.maxLength,
            `Maximum ${question.validation.maxLength} characters allowed`,
          );
        }
        if (question.validation?.pattern) {
          fieldSchema = fieldSchema.regex(
            new RegExp(question.validation.pattern),
            "Invalid format",
          );
        }
        break;

      case "number":
        fieldSchema = z.string().regex(/^\d+$/, "Only numbers are allowed"); // only digits allowed

        // Guard against undefined
        if (question.validation?.minValue !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => Number(val) >= (question.validation?.minValue ?? 0),
            `Minimum value is ${question.validation.minValue}`,
          );
        }

        if (question.validation?.maxValue !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => Number(val) <= (question.validation?.maxValue ?? Infinity),
            `Maximum value is ${question.validation.maxValue}`,
          );
        }
        break;

      case "select":
      case "radio":
        fieldSchema = z.string();
        if (question.required) {
          fieldSchema = fieldSchema.min(
            1,
            `Please select an option for: ${question.question}`,
          );
        }
        break;

      case "checkbox":
        fieldSchema = z.array(z.string());
        if (question.required) {
          fieldSchema = fieldSchema.min(
            1,
            `Please select at least one option for: ${question.question}`,
          );
        }
        break;

      default:
        fieldSchema = z.string();
    }

    if (!question.required && question.type !== "checkbox") {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[question.id] = fieldSchema;
  });

  return z.object(schemaFields);
};

export type QuestionFormData = Record<
  string,
  string | number | string[] | boolean | number[]
>;

export default function Step3Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data, setData } = useJobStore();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const data = await getQuestions();
        if (data?.length > 0) {
          setQuestions(data);
        }
        setIsLoadingQuestions(false);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Create form schema based on loaded questions
  const formSchema =
    questions.length > 0
      ? createFormSchema(questions as Question[])
      : z.object({});
  const defaultQues = Object.fromEntries(
    (data.applicationQuestions ?? []).map((que) => [
      que.id.toString(),
      que.answer,
    ]),
  );
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(formSchema as any),
    defaultValues: defaultQues || {},
  });

  const watchedValues = watch();

  const onSubmit = async (formData: QuestionFormData) => {
    setIsSubmitting(true);
    const ques = questions.map((que) => ({
      id: que.id,
      question: que.question,
      answer: formData[que.id],
    }));

    try {
      // Save to store
      setData("applicationQuestions", ques);
      setData("currentStep", 4);
    } catch (err) {
      setError("Failed to save your responses. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryLoadQuestions = () => {
    setError(null);
    setIsLoadingQuestions(true);
    // Trigger useEffect again
    window.location.reload();
  };

  if (isLoadingQuestions) {
    return (
      <div className="space-y-6 lg:w-[700px]">
        <div className="text-center space-y-2">
          <div className="h-6 w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md animate-pulse"
            >
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-6 gap-6">
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded flex-1" />
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="space-y-6 lg:w-[700px]">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={retryLoadQuestions}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:w-[700px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium">Application Questions</h3>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 bg-white dark:bg-background border border-gray-200 rounded-md"
            >
              <QuestionField
                question={question as Question}
                value={watchedValues[question.id] ?? ""}
                onChange={(value) =>
                  setValue(question.id.toString(), value ?? "")
                }
                error={errors[question.id]?.message as string}
              />
            </div>
          ))}
        </div>

        {questions.length === 0 && !isLoadingQuestions && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No questions available at this time.
            </p>
          </div>
        )}

        <div className="flex justify-between pt-6 gap-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => setData("currentStep", 2)}
            disabled={isSubmitting}
          >
            Previous
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || questions.length === 0}
            className="flex-1 dark:text-white!"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
