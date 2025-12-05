import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | s1mple_sys",
  description: "Página de inicio de sesión de s1mple_sys",
};

export default function SignIn() {
  return <SignInForm />;
}
