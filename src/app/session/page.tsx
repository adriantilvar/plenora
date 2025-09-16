import type { UIMessage } from "ai";
import { Composer } from "@/components/composer";
import { cn } from "@/lib/utils";

const mockMessages: UIMessage[] = [
  {
    role: "assistant",
    id: "1",
    parts: [
      {
        type: "text",
        text: "Hey! Thanks for taking a moment to chat with me. I'd love to hear about your experience with BestDos lately. How's it been going?",
      },
    ],
  },
  {
    role: "user",
    id: "2",
    parts: [
      {
        type: "text",
        text: "Oh hey! It's been pretty good actually. I've been using it quite a bit recently.",
      },
    ],
  },
  {
    role: "assistant",
    id: "3",
    parts: [
      {
        type: "text",
        text: "That's great to hear! Sounds like it's become part of your regular routine. What's been driving you to use it so much?",
      },
    ],
  },
  {
    role: "user",
    id: "4",
    parts: [
      {
        type: "text",
        text: "Yeah, I'd say I'm in there maybe 3-4 times a week now. Mainly trying to keep all my projects and tasks from getting completely out of hand, you know?",
      },
    ],
  },
  {
    role: "assistant",
    id: "5",
    parts: [
      {
        type: "text",
        text: "Absolutely! The juggling act is real. How's BestDos working out for keeping things manageable? Are you feeling more on top of things?",
      },
    ],
  },
  {
    role: "user",
    id: "6",
    parts: [
      {
        type: "text",
        text: "Most of the time, yeah! It definitely helps. Though I have to admit, sometimes I get a bit lost in all the menus and options.",
      },
    ],
  },
  {
    role: "assistant",
    id: "7",
    parts: [
      {
        type: "text",
        text: "Ah, interesting. So it's doing the job, but navigation can be a bit of a maze sometimes? Can you think of a recent example where you got a bit turned around?",
      },
    ],
  },
  {
    role: "user",
    id: "8",
    parts: [
      {
        type: "text",
        text: "Yeah, just yesterday actually! I was trying to set up a weekly recurring task for my team meetings, and I spent way too long hunting for that option. Ended up clicking through like five different menus before I found it.",
      },
    ],
  },
  {
    role: "assistant",
    id: "9",
    parts: [
      {
        type: "text",
        text: "Ugh, that sounds frustrating! Five menus deep is definitely not ideal. Once you found it though, did the actual recurring task setup work well for you?",
      },
    ],
  },
  {
    role: "user",
    id: "10",
    parts: [
      {
        type: "text",
        text: "Oh yeah, once I got there it was super straightforward. The feature itself works great - it's just buried. I feel like there's so much stuff on the screen sometimes that I miss the obvious things.",
      },
    ],
  },
  {
    role: "assistant",
    id: "11",
    parts: [
      {
        type: "text",
        text: "That makes total sense. So it sounds like the functionality is solid, but the interface could be cleaner and more intuitive. If you had a magic wand, what would you change first?",
      },
    ],
  },
  {
    role: "user",
    id: "12",
    parts: [
      {
        type: "text",
        text: "Definitely streamline the interface! Maybe hide some of the advanced features unless you really need them. When I have 20+ tasks, the screen just feels overwhelming.",
      },
    ],
  },
  {
    role: "assistant",
    id: "13",
    parts: [
      {
        type: "text",
        text: "That's really valuable insight. The power is there, but maybe it needs better organization. I'm curious - despite these navigation hiccups, would you stick with BestDos?",
      },
    ],
  },
  {
    role: "user",
    id: "14",
    parts: [
      {
        type: "text",
        text: "Oh absolutely! I mean, it's not perfect, but it's still way better than the chaos I had before. I'd definitely keep using it.",
      },
    ],
  },
  {
    role: "assistant",
    id: "15",
    parts: [
      {
        type: "text",
        text: "That's awesome to hear! And what about your colleagues who are also drowning in tasks? Think any of them would benefit from BestDos?",
      },
    ],
  },
  {
    role: "user",
    id: "16",
    parts: [
      {
        type: "text",
        text: "Yeah, I've actually already mentioned it to a few people. I mean, I usually add the caveat about the interface being a bit cluttered, but the core functionality is really solid. My project manager friend would probably love it once she gets past the learning curve.",
      },
    ],
  },
  {
    role: "assistant",
    id: "17",
    parts: [
      {
        type: "text",
        text: "That's fantastic - thanks so much for sharing all of this! It's incredibly helpful to hear both what's working well and where we can make things smoother. Really appreciate you taking the time!",
      },
    ],
  },
  {
    role: "user",
    id: "18",
    parts: [
      {
        type: "text",
        text: "No problem at all! Hope it helps make BestDos even better.",
      },
    ],
  },
];

export default function SessionPage() {
  return (
    <main className="mx-auto flex h-screen flex-col items-center overflow-hidden">
      <div className="-mb-4 flex w-full flex-1 justify-center overflow-y-scroll">
        <div className="h-fit max-w-3xl space-y-6 pt-16 text-lg">
          {mockMessages.map((message, index) => {
            return (
              <div
                key={message.id}
                className={cn("grid grid-cols-16 last:pb-12", {
                  "mt-16": message.role === "assistant" && !!index,
                })}
              >
                {message.role === "user" && <Avatar />}
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={`${message.id}-part-${index}`}
                        className={cn({
                          "col-span-16 font-medium text-stone-800 text-xl":
                            message.role === "assistant",
                          "col-span-15 rounded-2xl bg-stone-50 px-4 py-3 text-slate-950 shadow-2xs ring-1 ring-stone-900/10":
                            message.role === "user",
                        })}
                      >
                        {part.text}
                      </div>
                    );
                  }

                  return "";
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 flex h-22 w-full justify-center">
        <Composer className="fixed bottom-6 max-h-96 min-h-16 w-3xl" />
      </div>
    </main>
  );
}

function Avatar() {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-red-400 text-red-50">
      A
    </div>
  );
}
