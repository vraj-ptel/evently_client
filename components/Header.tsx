"use client"
import { Calendar, User2Icon, UserLockIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogOut from "./LogOut";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Header = () => {
  const [isLoggedUser,setIsLoggedUser]=useState(false)
  const [token,setToken] =useState('') 
 
  const validateUser=async(t:string|undefined)=>{
     const userDetail=await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verify`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${t}` },
      }
    )
    const result=await userDetail.json()
    console.log('result',result)
    setIsLoggedUser(result.success)
  }
   useEffect(()=>{
        const t=document.cookie.split(';').find(cookie=>cookie.trim().startsWith('token'))?.split('=')[1];
        if(t)setToken(t);
        validateUser(t)
     },[token])
     
  //   const cookieStore = await cookies();
  // const userDetails = await fetch(
  //     `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verify`,
  //     {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
  //     }
  //   )
  //     const isLoggedUser = await userDetails.json();
 
  return (
    <div className="backdrop-blur fixed top-0 z-50 bg-background/30 w-full ">
      <div className="flex p-4 justify-between">
       <Link href={'/'}> <h1 className="text-2xl bg-gradient-to-br from-purple-400 font-bold  to-pink-400 bg-clip-text text-transparent ">
          Evently
        </h1></Link>
        <div>
          <div className="flex flex-row  gap-2 ">
          {
            !isLoggedUser &&  <div className="flex flex-row gap-2">
              <Link href={'/join'}>
               <Button className="cursor-pointer p-1" size={'sm'} variant={"outline"}>
              <span>
                <User2Icon />
              </span>
              Join Now
            </Button>
            
           </Link>
           <Link href={'/admin/verify'}>
               <Button className="cursor-pointer p-1" size={'sm'} variant={"outline"}>
              <span>
                <UserLockIcon />
              </span>
              Login As Admin
            </Button>
           </Link>

            </div>
          }
          {
            isLoggedUser && <div className="flex flex-row gap-1"><Link href={'/events'}>
            <Button className="cursor-pointer" variant={"outline"}>
            {" "}
            <span>
              <Calendar />
            </span>
            My Events
          </Button>
          </Link>
         
            <LogOut setToken={setToken}/>
          

          </div>
          }
          </div>
          
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default Header;
