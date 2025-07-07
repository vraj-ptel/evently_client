"use client";
import { Event } from "@/types";
import { useEffect, useState } from "react";
import Events from "./_component/Events";

export interface BookedEvent {
  _id: string;
  name: string;
  email: string;
  event: Event;
}

const MyEvents = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
   const [token,setToken] =useState('') 
   
   
  const fetchBookedEvents = async (t?:string|undefined) => {
    const cookie=t||token
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/event/booked`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${cookie}` },
        }
      );
      const result = await res.json();
      if (result.success) {
        setBookedEvents(result.events);
        // console.log("event", result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=>{
      const t=document.cookie.split(';').find(cookie=>cookie.trim().startsWith('token'))?.split('=')[1];
      
      if(t)setToken(t);
      fetchBookedEvents(t);
   },[])

  const handleUnregister = (eventId: string) => {
    const unregisterEvent = bookedEvents.filter(
      (event: BookedEvent) => event.event._id !== eventId
    );
    setBookedEvents(unregisterEvent);
    fetchBookedEvents();
  };

  return (
    <div className="mt-20 p-4">
      <div className="">
        <h4 className="text-2xl   bg-gradient-to-br from-purple-400 font-bold  to-pink-400 bg-clip-text text-transparent">
          My Booked Events
        </h4>
      </div>
      {bookedEvents.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 mt-4  md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookedEvents.map((event: BookedEvent) => (
              <Events
                event={event}
                key={event._id}
                handleUnregister={handleUnregister}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center  mt-5 text-foreground/30">
          No Events Booked Yet
        </div>
      )}
    </div>
  );
};

export default MyEvents;
