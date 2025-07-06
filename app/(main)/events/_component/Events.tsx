"use client";
import EventCard from "@/components/EventCard";
import React, { useState } from "react";
import { BookedEvent } from "../page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Events = ({ event,handleUnregister }: { event: BookedEvent,handleUnregister:(eventId:string)=>void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const token = document.cookie.split(';').find(cookie=>cookie.trim().startsWith('token'))?.split('=')[1]
  const unregisterEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/event/unregister`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        handleUnregister(eventId);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(
          error.message || "Something Went Wrong While unregistering event"
        );
      } else {
        console.log(error);
        toast.error("Something Went Wrong While unregistering event");
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };
  return (
    <EventCard event={event.event}>
      <div className="flex flex-col gap-1">
        <h6>
          Booked as <span className="font-bold">{event.name}</span>
        </h6>
        <h6>
          Booked with <span className="font-bold">{event.email}</span>
        </h6>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full cursor-pointer mt-4  py-2 rounded-lg shadow-md transition-all duration-300"
            >
              Unregister Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unregister Event</DialogTitle>
              <DialogDescription>
                Are you sure you want to unregister this event this action
                cannot be undone
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-row gap-2 self-start">
              <Button variant={"outline"} className="cursor-pointer" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => unregisterEvent(event._id)}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex flex-row gap-1">
                    <span>
                      <Loader2 className="animate-spin" />
                    </span>{" "}
                    Unregistering...
                  </span>
                ) : (
                  "Unregister Event"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </EventCard>
  );
};

export default Events;
