import { Input, Label } from "@/app/_components/ui";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";

interface FormInputProps {
  label: string;
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  type?: string;
  placeholder: string;
  error?: FieldError;
}

export const FormInput = ({
  label,
  field,
  register,
  type,
  placeholder,
  error,
}: FormInputProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        {...register(field)}
        type={type}
        placeholder={placeholder}
        className={cn({
          "focus-visible:ring-red-500": error,
        })}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
