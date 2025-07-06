'use client'

import { logOut } from "@/action/logout"

import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react"

const LogOut = () => {
    const logoutHandler=async()=>{
        console.log('log out')
      await logOut()
    }
  return (
    <>
        <Button onClick={logoutHandler} variant={'outline'} className="cursor-pointer flex flex-row gap-2"><span><LogOutIcon /></span> Log out</Button>
    </>
  )
}

export default LogOut
