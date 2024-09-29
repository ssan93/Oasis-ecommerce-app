import { Input, Label } from "@/app/_components/ui";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  field: string;
  register: any;
  type?: string;
  placeholder: string;
  error: any;
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
