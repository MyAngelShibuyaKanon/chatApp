'use client';
import { JSX } from "react/jsx-runtime";
import Form from "next/form";
type authFormType = "SignIn" | "SignUp";

export function AuthForm({ formType }: { formType: authFormType, }): JSX.Element {
  const isSignIn = formType === "SignIn";

  function onSubmit(formData: FormData) {

    alert(`test '${formData.get("username")}'`);
  }

  return (
    <Form action={onSubmit} className="flex flex-col text-center gap-y-4 text-black" >
      <h1 className="text-white">
        {isSignIn ? "Sign In" : "Register"}
      </h1>
      <input className="bg-white" name="username" />
      <input className="bg-white" name="password" />
      <button className="bg-white text-black">{isSignIn ? "Sign In" : "Register"} </button>

    </Form>
  )
}
