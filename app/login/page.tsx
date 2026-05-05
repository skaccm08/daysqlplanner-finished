"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  function handleSuccess(user: any) {
    localStorage.setItem("planner_user", JSON.stringify(user));
    router.push("/planner");
  }

  return <AuthForm onSuccess={handleSuccess} />;
}