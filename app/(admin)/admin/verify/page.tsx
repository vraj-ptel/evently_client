"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!secret) {
      toast.error("Secret Key Required", {
        description: "Please enter valid secret key to login as admin. ",
      });
      return;
    }
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/admin/verify`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ secretKey: secret }),
        }
      );
      const data = await response.json();
      if(!data.success){
        toast.error(data.message)
        return
      }
      if (data?.token) {
        toast.success("Login Successful");
        document.cookie = `admintoken=${data.token};path=/`;
        router.push('/admin/home')
        return;
      }
      // console.log("data", data);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <Card className="md:w-md w-full">
          <CardHeader>
            <CardTitle className="capitalize text-foreground/30 font-bold">
              login as admin with special secret key to create and manage events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <form onSubmit={(e) => handleAdminLogin(e)}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="secret">Enter a secret key</Label>
                  <Input
                    id="secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    type="password"
                    placeholder="Secret Key"
                  />
                </div>
                <Button
                  type="submit"
                  className="my-2 cursor-pointer flex flex-row gap-2"
                  variant={"outline"}
                  disabled={loading}
                >
                    {loading?<span className="flex flex-row gap-2"><span><Loader2 className="animate-spin"/></span>loading...</span>:"Submit"}
                
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
