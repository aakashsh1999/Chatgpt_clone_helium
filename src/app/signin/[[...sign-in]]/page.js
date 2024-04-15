import { SignIn } from "@clerk/nextjs";
 
 function Login() {
  return (
    <div className="flex justify-center items-center h-screen">
    <SignIn />
    </div>
  );
}

export default Login