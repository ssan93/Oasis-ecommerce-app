import { ISignUp, SignUpSchema } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { Button } from "@/app/_components/ui";

interface SignUpFormProps {
  onSubmit: (data: ISignUp) => void;
}
export const SignUpForm = ({ onSubmit }: SignUpFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUp>({
    resolver: zodResolver(SignUpSchema),
  });

  return (
    <div className="">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormInput
          label="Email"
          field="email"
          register={register}
          placeholder="Enter your email"
          error={errors.email}
        />
        <FormInput
          label="Password"
          field="password"
          register={register}
          type="password"
          placeholder="Enter your password"
          error={errors.password}
        />
        <FormInput
          label="Confirm Password"
          field="confirmPassword"
          register={register}
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};
