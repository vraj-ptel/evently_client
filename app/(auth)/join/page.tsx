"use client"
import { revalidatePage } from "@/action/revalidate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import {  useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";


const AuthPage = () => {
    const router=useRouter()
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("")
    const [loading,setLoading]=useState(false);
    const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    
    const handleLogin=async(e:React.FormEvent<HTMLFormElement>)=>{
        
        e.preventDefault()
        if(!email || !password){
            toast.error("All Fields Are Required",{description:"Please fill all the fields to login"})
            return;
        }
        if(!validEmailRegex.test(email)){
            toast.error("Invalid Email",{description:"Please enter a valid email address"})
            return
        }
        setLoading(true)
        try {
                const response=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/login`,{
                    method:'POST',
                    headers:{
                        'content-type':'application/json'
                    },
                    body:JSON.stringify({email,password})
                })
                const data=await response.json();

                if(data?.token){
                    toast.success("Login Successful")
                      router.push('/')
                     document.cookie=`token=${data.token};path=/`
                    return
                }
                if(!data.success){
                    toast.error(data.message)
                    return
                }
                console.log("data",data)
        } catch (error) {
            if(error instanceof Error)toast.error(error.message)
            toast.error('Something went wrong')
            console.log(error)
        }finally{
            setLoading(false);
        }
    }
    const handleRegister=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!email || !password || !name){
            toast.error("All Fields Are Required",{description:"Please fill all the fields to login"})
            return;
        }
        if(!validEmailRegex.test(email)){
            toast.error("Invalid Email",{description:"Please enter a valid email address"})
            return
        }
        setLoading(true)
         try {
                const response=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/register`,{
                    method:'POST',
                    headers:{
                        'content-type':'application/json'
                    },
                    body:JSON.stringify({name,email,password})
                })
                const data=await response.json();
                if(data?.token){
                    toast.success("Registration Successful")
                    router.push('/')
                    await revalidatePage()
                    document.cookie=`token=${data.token};path=/`
                    return
                }
                if(!data.success){
                    toast.error(data.message)
                    return
                }
                console.log("data",data)
        } catch (error) {
            if(error instanceof Error)toast.error(error.message)
            toast.error('Something went wrong')
            console.log(error)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg bg-gradient-to-br  ">
        <CardHeader>
          <CardTitle className="text-center">Welcome, join us to get started</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4" onSubmit={(e)=>handleLogin(e)}>
               <div className="flex flex-col gap-2">
                 <Label htmlFor="email">Email</Label>
                <Input type="email" required id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
               </div>
                <div  className="flex flex-col gap-2">
                     <Label htmlFor="password">Password</Label>
                    <Input type="password" minLength={8} required id="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
                </div>
                <Button variant={'ghost'} disabled={loading}  className="w-full cursor-pointer" type="submit">
                  {loading?<span className="flex flex-row gap-2"><Loader className="animate-spin"/> {"loading..."}</span>:"Login"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form className="space-y-4" onSubmit={(e)=>handleRegister(e)}>
                <div  className="flex flex-col gap-2">
                      <Label htmlFor="name">Name</Label>
                    <Input type="text" value={name} onChange={(e)=>setName(e.target.value)} required id="name" placeholder="Name" />
                </div>
                <div  className="flex flex-col gap-2">
                    <Label htmlFor="email">email</Label>
                    <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required id="email" placeholder="Email" />
                </div>
                 <div  className="flex flex-col gap-2">
                     <Label htmlFor="password">Password</Label>
                    <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  required id="password" placeholder="Password" />
                </div>
              
                <Button variant={'ghost'} disabled={loading}  className="w-full cursor-pointer" type="submit">
                  {loading?<span className="flex flex-row gap-2"><Loader className="animate-spin"/> {"Registering..."}</span>:"Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
