import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | s1mple_sys",
  description: "Página de registro de s1mple_sys",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
