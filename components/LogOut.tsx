'use client'

import { logOut } from "@/action/logout"

import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react"

const LogOut = ({setToken}:{setToken:React.Dispatch<React.SetStateAction<string>>}) => {
    const logoutHandler=async()=>{
        console.log('log out')
      await logOut()
      setToken('')
    }
  return (
    <>
        <Button onClick={logoutHandler} variant={'outline'} className="cursor-pointer p-1 flex flex-row gap-2"><span><LogOutIcon /></span> Log out</Button>
    </>
  )
}

export default LogOut
