"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { signInSchema } from '@/lib/validations/zod'
import LoadingButton from '@/app/_components/loadingButton'
import { handleCredentialsSignin } from '@/app/actions/authActions'
import ErrorMessage from '@/app/_components/errorMessage'
import { handleGoogleSignin } from '@/app/actions/authActions'
import Link from 'next/link'
// import { FcGoogle } from "react-icons/fc"
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInForm() {

  const params = useSearchParams()
  const error = params.get('error')
  const router = useRouter()

  useEffect(() => {
    if(error) {
      switch(error) {
        case "OAuthAccountNotLinked":
          setGlobalError(
            "Please use your email and password to sign in."
          )
          break
        default:
          setGlobalError(
            "An unexpected error occured. Please try again."
          )
      }
    }
    router.replace('/auth/signin')
  }, [error, router])

  const [globalError, setGlobalError] = useState<string>("")

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignin(values)
      if(result?.message == "Invalid credentials") {
        setGlobalError("Invalid credentials")
      } 
      
    } catch (error) {
      setGlobalError("Unexpected error occurred. Please try again.")
      console.error("Sign-in error:", error)
    }
  }
  return (
   
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton pending={form.formState.isSubmitting}>Sign in</LoadingButton>
            </form>
          </Form>
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              Or continue with
            </span>
          </div>
          <form action={handleGoogleSignin}>
            <Button
            variant="outline"
            className="w-full"
          >
          {/* <FcGoogle className="mr-2 h-5 w-5" /> */}
            Sign in with Google
          </Button></form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}