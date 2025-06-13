'use client';
import { JSX } from "react/jsx-runtime";
import Form from "next/form";
import Link from 'next/link'
type authFormType = "SignIn" | "SignUp";

export function AuthForm({ formType }: { formType: authFormType, }): JSX.Element {
  const isSignIn = formType === "SignIn";

  function onSubmit(formData: FormData) {

    alert(`test '${formData.get("username")}'`);
  }

  return (
    <Form action={onSubmit} className="flex flex-col text-center gap-y-4 text-black w-64" >
      <h1 className="text-white">
        {isSignIn ? "Sign In" : "Register"}
      </h1>
      <input className="bg-white" name="username" />
      <input className="bg-white" name="password" />
      <button className="bg-white text-black">{isSignIn ? "Sign In" : "Register"} </button>
      <p className="flex flex-row text-white text-sm justify-center gap-2">
        <p>{isSignIn ? "Don't have an account?" : "Already have an account?"}</p>
        {isSignIn ? <Link href={"/auth/register"}>Sign Up!</Link> : <Link href={"/auth/login"}>Sign In!</Link>}
      </p>
    </Form>
  )
}
