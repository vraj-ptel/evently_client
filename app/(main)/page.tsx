import Events from "@/components/Events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { ArrowRight } from "lucide-react";
import { cookies } from "next/headers";

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
  const events: Array<Event> = await fetchEvents();

  return (
    <div>
      <section className="relative pt-20 px-4 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-white/20 text-sm px-4 py-2">
              🎉 Event Recommendations
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Events Made
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Effortless
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your event planning with our intelligent booking
              platform. From corporate conferences to intimate celebrations,
              create unforgettable experiences with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 text-white to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 text-lg px-8 py-6"
              >
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-10">
          Upcoming Events
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((event, index) => {
            return <Events key={index} event={event} isLoggedIn={isLoggedUser.success}/>;
          })}
        </div>
      </section>
    </div>
  );
};

export default Page;
