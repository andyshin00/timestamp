"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("./api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center items-center">
      <Link
        href="/"
        className="mb-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold">Register an account</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            id="login-form"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <Label className="py-1 font-bold" htmlFor="email">
                Email:
              </Label>
              <Input
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                placeholder="em@gmail.com"
              />
            </div>
            <div className="flex flex-col">
              <Label className="py-1 font-bold" htmlFor="password">
                Password:
              </Label>
              <Input
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="at least 8 characters, 1 special, 1 upper character
                "
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {error && <p className="text-red-600">{error}</p>}
          <Button type="submit" form="login-form" className="w-full ">
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
