import Events from "@/components/Events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import { AdminEventDetailsProps } from "../(admin)/admin/home/page";

const Page = async () => {
  const cookieStore = await cookies();
  const userDetails = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/user/verify`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    }
  );
  const isLoggedUser = await userDetails.json();
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data?.events) {
        return data.events;
      }
    } catch (err) {
      if (typeof err === "string") throw new Error(err);
      if (err instanceof Error) throw err;
    }
  };
  const events: Array<AdminEventDetailsProps> = await fetchEvents();

  return (
    <div>
      <section className="relative pt-20 px-4 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-white/20 text-sm px-4 py-2">
              🎉 Event Booking Now Simple
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Events Made
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Effortless
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium quod porro accusantium id in quidem ea error? Hic!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#event" className="animate-bounce scroll-smooth">
                <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 text-white to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 text-lg px-8 py-6"
              >
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </a>
            </div>
          </div>
        </div>
        <Separator/>
        

        <h1 className="text-3xl font-bold text-center mb-10">
          Upcoming Events
        </h1>
          {events.length==0 && <h1 className=" text-center mb-10">No Events are available at the moment</h1>}
        <div id="event"  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, index) => {
            return <Events key={index} event={event} isLoggedIn={isLoggedUser.success}/>;
          })}
        </div>

         {
          !isLoggedUser.success && <div className="my-3 z-1 ">
            <p className="text-foreground/30 text-2xl text-center mb-10">You are not joined yet please join first to book any event</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              
            </div>
          </div>
        }
       
      </section>
    </div>
  );
};

export default Page;
