import { AuthForm, } from "../components/authForm";

type formInfo = {
  name: string,
  password: string
};
export default function LoginPage() {
  return (
    <div>
      <div className="p-16 bg-gray-950 " >

        <AuthForm formType={"SignIn"} />
      </div>
    </div>
  )
}
