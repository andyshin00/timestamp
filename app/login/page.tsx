"use client";
import { NextResponse } from "next/server";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const res = await fetch("./api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.error, error: "400" });
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center">
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="">Email:</label>
          <input
            className="border rounded"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="you@gmail.com"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Password:</label>
          <input
            className="border rounded"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="text"
            placeholder="at least 8 characters"
          />
        </div>
        <button className="border rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
