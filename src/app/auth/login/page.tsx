/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn } from "next-auth/react";
import Error from "next/error";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "~/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card";
import { Icons } from "~/app/components/ui/icons";
import { Input } from "~/app/components/ui/input";
import { Label } from "~/app/components/ui/label";

type FormData = {
  username: string;
  password: string;
};

type IFormInput = {
  username: string;
  password: string;
};

const onSubmit: SubmitHandler<IFormInput> = async (data, e) => {
  e?.preventDefault();
  console.log(data);
  console.log(e);
  const { username, password } = data;

  const loginResponse = await signIn("credentials", {
    redirect: false,
    username,
    password,
    // callbackUrl: "localhost:3000/dashboard",
  });

  if (loginResponse) {
    console.log("ok");
  } else {
    console.log("error");
  }
};

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <form method="post" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline">
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" {...register("username")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
