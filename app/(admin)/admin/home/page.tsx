'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, LoaderCircleIcon, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import Event from "./_component/Event";

const AdminHome = () => {
  const [tab, setTab] = useState("create");
  const [token,setToken]= useState('') 

  useEffect(()=>{
    const t=document.cookie
    .split(";")
    .find((cookie) => cookie.includes("admintoken"))
    ?.split("=")[1];
    if(t)setToken(t)
  },[])

  return (
    <div>
      <div className="grid grid-cols-5 h-[100vh]">
        <div className="md:col-span-1 md:block hidden border-r p-2 h-full  ">
          <h1 className="text-2xl my-2">Admin Home</h1>
          <Separator />
          <div className="p-2 flex flex-col gap-2">
            <button
              onClick={() => setTab("create")}
              className={` cursor-pointer p-2 rounded-sm ${
                tab == "create"
                  ? "bg-foreground/30  hover:bg-none"
                  : "bg-transparent"
              }`}
            >
              Create A New Event
            </button>
            <button
              onClick={() => setTab("view")}
              className={` cursor-pointer p-2 rounded-sm ${
                tab == "view"
                  ? "bg-foreground/30  hover:bg-none"
                  : "bg-transparent"
              }`}
            >
              View Events
            </button>
          </div>
        </div>
        <div className="md:col-span-4 col-span-5 py-2">
          <div className="flex flex-col md:items-center md:justify-center">
            <div className="flex flex-row items-center ">
              <MobileDrawer tab={tab} setTab={setTab}/>{" "}
              <h1 className="text-2xl p-2 capitalize flex-grow-1 text-center">
                {tab == "create" ? "create a new event" : "All events"}
              </h1>
            </div>
            <Separator />
            {tab == "create" ? (
              <CreateEvent token={token!} />
            ) : (
              <ViewEvent token={token!} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileDrawer = ({tab,setTab}:{tab:string,setTab:React.Dispatch<React.SetStateAction<string>>}) => {
  return (
    <div className="md:hidden ">
      <Drawer   direction="left">
        <DrawerTrigger asChild>
          <Button variant={'ghost'} size={'sm'}><Menu/></Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="text-2xl p-2">Admin Home</DrawerTitle>
          <Separator />
          <div >
         
          <div className="p-2 flex flex-col gap-2">
            <button
              onClick={() => setTab("create")}
              className={` cursor-pointer p-2 rounded-sm ${
                tab == "create"
                  ? "bg-foreground/30  hover:bg-none"
                  : "bg-transparent"
              }`}
            >
              Create A New Event
            </button>
            <button
              onClick={() => setTab("view")}
              className={` cursor-pointer p-2 rounded-sm ${
                tab == "view"
                  ? "bg-foreground/30  hover:bg-none"
                  : "bg-transparent"
              }`}
            >
              View Events
            </button>
          </div>
        </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

const CreateEvent = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      eventLocation: "",
      eventImage: null,
      eventCapacity: 0,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveEvent = async (data: any) => {
   
    if (new Date(data.startDate) > new Date(data.endDate)) {
      toast.error(
        "event etart date & time cannot be greater than event end date & time"
      );
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("start", data.startDate);
    formData.append("end", data.endDate);
    formData.append("location", data.eventLocation);
    formData.append("eventCapacity", data.eventCapacity);
    formData.append("file", data.eventImage[0]);
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/event/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const resultData = await response.json();
      if (resultData.success) {
        reset();
        toast.success("Event Created Successfully");
      }
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
        throw new Error(error);
      }
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
        throw new Error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-2">
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(saveEvent)}>
            <div className="flex flex-col gap-4  ">
              <div className="flex flex-col gap-2">
                <Label>Event Title</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <span className="text-red-500 text-xs">
                    Title is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>

                <textarea
                  {...register("description", { required: true })}
                  className="border  px-3 py-2 resize-none rounded-sm md:px-4 lg:px-6"
                  placeholder="Enter event description"
                  rows={3}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">
                    Description is required
                  </span>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-2 justify-between">
                <div className="flex flex-col gap-2 ">
                  <Label>Start Date & time</Label>
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    {...register("startDate", {
                      required: true,
                    })}
                  />
                  {errors.startDate && (
                    <span className="text-red-500 text-xs">
                      Start Date is required
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 ">
                  <Label>End Date & time</Label>
                  <Input
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    {...register("endDate", {
                      required: true,
                      // validate: (value) => {

                      //   const today = new Date();
                      //   today.setHours(0, 0, 0, 0);
                      //   const selected = new Date(value);
                      //   selected.setHours(0, 0, 0, 0);
                      //   return (
                      //     selected > today ||
                      //     "End date must be greater than today"
                      //   );
                      // },
                    })}
                  />
                  {errors.endDate && (
                    <span className="text-red-500 text-xs">
                      End date is required
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Event Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  {...register("eventImage", {
                    required: true,
                  })}
                />
                {errors.eventImage && (
                  <span className="text-red-500 text-xs">
                    Event image is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Event Location</Label>
                <Input
                  {...register("eventLocation", { required: true })}
                  placeholder="Enter event location"
                />
                {errors.eventLocation && (
                  <span className="text-red-500 text-xs">
                    Location is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Event Capacity</Label>
                <Input
                  type="number"
                  min="1"
                  {...register("eventCapacity", { required: true, min: 1 })}
                  placeholder="Enter event capacity"
                />
                {errors.eventCapacity && (
                  <span className="text-red-500 text-xs">
                    Capacity is required and must be at least 1
                  </span>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-4 cursor-pointer"
              >
                {loading ? (
                  <span className="flex gap-2 flex-row">
                    <span>
                      <Loader2 className="animate-spin" />
                    </span>
                    Creating...
                  </span>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

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
const ViewEvent = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Array<AdminEventDetailsProps>>([]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/event/admin/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result.events) {
        console.log(result.events);
        setEvents(result.events);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvent();
  }, []);
  return (
    <div className="mt-8 p-4">
      {loading ? (
        <div className="flex items-center justify-center">
          <LoaderCircleIcon className="animate-spin h-15 w-15" />
        </div>
      ) : (
        <div>
          {events?.length === 0 ? (
            <div className="text-center text-foreground/30">
              There Is No Any Event Created
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events?.map((event) => (
                <Event event={event} key={event._id} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
