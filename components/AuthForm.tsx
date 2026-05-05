"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/api";

export default function AuthForm({
  onSuccess,
}: {
  onSuccess: (user: any) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "register") {
        const created = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        onSuccess({
          UserID: created.user_id,
          Name_: form.name,
          Email: form.email,
        });
      } else {
        const user = await loginUser({
          name: form.name,
          password: form.password,
        });

        onSuccess(user);
      }
    } catch (err: any) {
      setMessage(err.message);
    }
  }

  return (
  <main className="min-h-screen bg-[#f7f7f2] p-6 text-black">
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <h1 className="text-4xl font-black">
        {mode === "login" ? "Login" : "Register"}
      </h1>

      <div className="mt-8 space-y-4">
        <input
          required
          placeholder="Username"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl bg-neutral-100 px-4 py-3 outline-none"
        />

        {mode === "register" && (
          <input
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl bg-neutral-100 px-4 py-3 outline-none"
          />
        )}

        <input
          required
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-xl bg-neutral-100 px-4 py-3 outline-none"
        />
      </div>

      <button className="mt-6 w-full rounded-xl bg-black py-3 font-bold text-white">
        {mode === "login" ? "Login" : "Create Account"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setMessage("");
        }}
        className="mt-4 w-full text-sm text-gray-500"
      >
        {mode === "login"
          ? "Register"
          : "Login"}
      </button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </form>
  </main>
);
}