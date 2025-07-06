"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";

const EventCard = ({ event ,children}: { event: Event,children?:React.ReactNode }) => {
  

  return (
    <Card className=" z-1 shadow-lg h-full rounded-xl overflow-hidden bg-white dark:bg-gray-900 transition-transform  hover:shadow-2xl duration-300">
      <CardContent className="flex flex-col gap-4">
        <div className="w-full aspect-video relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <Image
            src={event.url}
            fill
            className="object-cover object-center "
            alt={event.title}
            sizes="(max-width: 640px) 100vw, 400px"
            priority
          />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white ">
            {event.title}
          </div>
          <div className="text-gray-500 dark:text-gray-300 ">
            {event.description}
          </div>
        </div>

        <div>
          <Badge className=" px-3 py-1 rounded-full text-xs font-semibold">
            {event.location}
            <MapPin />
          </Badge>
        </div>

        <div className="flex flex-wrap  items-center gap-2 mt-2">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar />
            {new Date(event.start).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
              hour12: true,
            })}
          </Badge>
          {"-"}
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar />
            {new Date(event.end).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
              hour12: true,
            })}
          </Badge>
        </div>

        {children}
      </CardContent>
    </Card>
  );
};

export default EventCard;
