'use client'
import { useState } from "react";
import { AuthForm, } from "../components/authForm";

type formInfo = {
  name: string,
  password: string
};
export default function RegistrationPage() {
  const [info, setInfo] = useState<formInfo>({ name: "", password: "" });
  return (
    <div>
      <div className="p-16 bg-gray-950 " >

        <AuthForm formType={"SignUp"} />
      </div>
    </div>
  )
}
