"use client";
import { NextResponse } from "next/server";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="">
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Email:</label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="you@gmail.com"
          />
        </div>
        <div>
          <label htmlFor="">Password:</label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="text"
            placeholder="at least 8 characters"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
