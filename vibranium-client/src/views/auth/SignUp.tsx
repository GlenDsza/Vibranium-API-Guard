import InputField from "@/components/fields/InputField";
import Card from "@/components/card";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    email: "",
    name: "",
    mobile: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    id: "",
    password: "",
    email: "",
    name: "",
    mobile: "",
  });

  const idRegex = /^[A-Z0-9]{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, password, email, name, mobile } = formData;
    const newErrors = {
      id: "",
      password: "",
      email: "",
      name: "",
      mobile: "",
    };

    if (!idRegex.test(id)) newErrors.id = "Invalid ID";
    if (!passwordRegex.test(password))
      newErrors.password = "At least 8 characters, 1 uppercase, 1 lowercase";
    if (!emailRegex.test(email)) newErrors.email = "Invalid email";
    if (!mobileRegex.test(mobile)) newErrors.mobile = "Invalid mobile number";

    setErrors(newErrors);

    if (
      !newErrors.id &&
      !newErrors.password &&
      !newErrors.email &&
      !newErrors.name &&
      !newErrors.mobile
    ) {
      const formData = {
        userId: id,
        password: password,
        email: email,
        name: name,
        mobile: mobile,
      };

      console.log(formData);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        formData
      );

      console.log(res);

      // Add your sign-up logic here
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      <Card
        extra={
          "items-center flex-col w-[470px]  min-h-[55vh] p-[16px] bg-cover mt-8 py-8 shadow-3xl"
        }
      >
        <form onSubmit={handleSubmit} autoComplete="off" className="w-full">
          <div className="flex gap-3 w-full">
            <InputField
              variant="auth"
              extra="mb-5 w-full"
              label="ID"
              placeholder="E.g. ABCD1234"
              id="id"
              type="text"
              maxLength={8}
              value={formData.id}
              errorMsg={errors.id}
              onChange={(e) => handleFieldChange(e, "id")}
              state={errors.id ? "error" : ""}
            />
            <InputField
              variant="auth"
              extra="mb-5 w-full"
              label="Name"
              placeholder="E.g. John Doe"
              id="name"
              type="text"
              value={formData.name}
              errorMsg={errors.name}
              onChange={(e) => handleFieldChange(e, "name")}
              state={errors.name ? "error" : ""}
            />
          </div>

          <div className="flex gap-3">
            <InputField
              variant="auth"
              extra="mb-5 w-full"
              label="Email"
              placeholder="E.g. example@email.com"
              id="email"
              type="email"
              value={formData.email}
              errorMsg={errors.email}
              onChange={(e) => handleFieldChange(e, "email")}
              state={errors.email ? "error" : ""}
            />

            <InputField
              variant="auth"
              extra="mb-5 w-full"
              label="Mobile"
              placeholder="E.g. 1234567890"
              id="mobile"
              type="tel"
              maxLength={10}
              value={formData.mobile}
              errorMsg={errors.mobile}
              onChange={(e) => handleFieldChange(e, "mobile")}
              state={errors.mobile ? "error" : ""}
            />
          </div>

          <InputField
            variant="auth"
            extra="mb-5 w-full"
            label="Password"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            minLength={8}
            showPassword={formData.showPassword}
            errorMsg={errors.password}
            value={formData.password}
            onChange={(e) => handleFieldChange(e, "password")}
            state={errors.password ? "error" : ""}
          />

          <button
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            type="submit"
          >
            Sign Up
          </button>

          <div className="mt-4 text-center text-sm text-navy-700 dark:text-white">
            Already have an account?{" "}
            <a
              className="text-brand-500 hover:text-brand-600 dark:text-white"
              href="/auth/sign-in"
            >
              Sign In
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
}
