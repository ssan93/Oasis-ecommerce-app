import { AuthCredentialsSchema, IAuthCredentials } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "./FormInput";
import { Button } from "@/app/_components/ui";

interface SignInFormProps {
  onSubmit: (data: IAuthCredentials) => void;
}
export const SignInForm = ({ onSubmit }: SignInFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthCredentials>({
    resolver: zodResolver(AuthCredentialsSchema),
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
        <Button type="submit">Log in</Button>
      </form>
    </div>
  );
};
