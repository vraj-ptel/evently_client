import EventCard from "@/components/EventCard";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface AdminEventDetailsProps {
  seatLeft: number;
  seatRegistered: number;
  percentage: number;
  _id: string;
  title: string;
  description: string;
  url: string;
  start: Date;
  end: Date;
  public_id: string;
  eventCapacity: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
const Event = ({ event }: { event: AdminEventDetailsProps }) => {
  
  return (
    <EventCard event={event}>
      <div>
        <div className="flex flex-row gap-2">
          <Badge>
            <h6>
              Event Capacity: <strong>{event.eventCapacity}</strong>
            </h6>
          </Badge>
          <Badge>
            <h6>
              {" "}
              Registered Users: <strong>{event.seatRegistered}</strong>
            </h6>
          </Badge>
        </div>
      </div>
    </EventCard>
  );
};

export default Event;
