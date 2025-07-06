"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Event } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EventCard from "./EventCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Events = ({ event ,isLoggedIn}: { event: Event,isLoggedIn:boolean }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [open, setOpen] = useState(false);
  const [token,setToken] =useState('') 
  useEffect(()=>{
    const t=document.cookie.split(';').find(cookie=>cookie.trim().startsWith('token'))?.split('=')[1];
    if(t)setToken(t);
  },[])

  const registerForEvent = async (EventId: string) => {
    if (!name || !email) {
      toast.error("Email and Name are required for registering an event");
      return;
    }
    if (!validEmailRegex.test(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address",
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/event/register`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: EventId, name, email }),
        }
      );
      const data = await res.json();
      console.log("event register data", data);
      if (!data.success) {
        toast.error(data.message, {
          description:
            "if you already registered for this event then you can't register again",
        });
        return;
      } else {
        toast.success(data.message);
        setOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
      setName("");
      setEmail("");
    }
  };

  return (
    <EventCard event={event}>
      {isLoggedIn&&(<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className="w-full cursor-pointer mt-4  py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Book Now
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book You Event Now</DialogTitle>
            <DialogDescription>
              Provide Your Name And Email To Receiver Conformation On Mail
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input
                value={email}
                type={"email"}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
              />
            </div>
            <div>
              <Button
                disabled={isLoading}
                variant={"outline"}
                className="cursor-pointer"
                onClick={() => registerForEvent(event._id)}
              >
                {isLoading ? (
                  <span className="flex flex-row gap-2">
                    <Loader2 className="animate-spin" /> Loading...
                  </span>
                ) : (
                  "Register For This Event"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>)}
    </EventCard>
  );
};

export default Events;
