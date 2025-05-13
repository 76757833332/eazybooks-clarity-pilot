
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
}

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-eazybooks-purple" />
              Upcoming Events
            </div>
          </CardTitle>
          <a
            href="/calendar"
            className="text-sm text-eazybooks-purple hover:underline"
          >
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-10">
                  <CalendarDays size={16} className="text-eazybooks-purple" />
                </div>
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {event.date}
                  </span>
                </div>
              </div>
              <button className="rounded-md border border-eazybooks-purple px-2 py-1 text-xs text-eazybooks-purple hover:bg-eazybooks-purple/10">
                Details
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;
