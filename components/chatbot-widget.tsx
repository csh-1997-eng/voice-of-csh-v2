"use client"

import { FormEvent, useEffect, useRef, useState } from "react"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
}

export default function ChatbotWidget() {
  const [threadId, setThreadId] = useState<string>()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "seed-1",
      role: "assistant",
      text: "I am Voice of Cole. Ask me about projects, writing, strategy, or what I am building next.",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  const send = async (text: string) => {
    const prompt = text.trim()
    if (!prompt || sending) return

    setSending(true)
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: prompt }])
    setInput("")

    // Service temporarily disabled — restore the fetch block below to re-enable
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: "assistant", text: "Voice of Cole is offline for maintenance. Check back soon." },
    ])
    setSending(false)

    // try {
    //   const res = await fetch("/api/chat", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ threadId, message: prompt }),
    //   })
    //   const data = (await res.json()) as { threadId?: string; reply?: string; error?: string }
    //   if (!res.ok || !data.reply) throw new Error(data.error || "Unable to process chat request.")
    //   if (data.threadId) setThreadId(data.threadId)
    //   setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: data.reply as string }])
    // } catch (error) {
    //   setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: "Service unavailable at this time." }])
    // } finally {
    //   setSending(false)
    // }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  return (
    <div className="flex h-[68vh] min-h-[560px] flex-col rounded-2xl border border-[#E8E5E0]/16 bg-[#0B0B0B]/92">
      <div className="flex items-center justify-between border-b border-[#E8E5E0]/12 px-4 py-3 md:px-5">
        <p className="text-xs uppercase tracking-[0.18em] text-[#C45A3C]">Live Session</p>
        <p className="text-xs text-[#bfb7ad]">{sending ? "Thinking..." : "Ready"}</p>
      </div>

      <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[80%] ${
                m.role === "user"
                  ? "border border-[#C45A3C]/45 bg-[#C45A3C]/18 text-[#F5DDD5]"
                  : "border border-[#E8E5E0]/14 bg-[#141414]/90 text-[#E8E5E0]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-[#E8E5E0]/14 bg-[#141414]/90 px-4 py-3 text-sm text-[#d2ccc3]">
              Generating response...
            </div>
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[#E8E5E0]/12 p-4 md:p-5">
        <div className="rounded-2xl border border-[#E8E5E0]/18 bg-[#111111] p-2">
          <textarea
            value={input}
            disabled={sending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder="Ask Voice of Cole anything..."
            rows={4}
            className="w-full resize-none bg-transparent px-3 py-2 text-sm text-[#E8E5E0] outline-none placeholder:text-[#9f968c]"
          />
          <div className="mt-2 flex items-center justify-between border-t border-[#E8E5E0]/10 px-3 pt-2">
            <p className="text-xs text-[#9f968c]">Enter to send, Shift+Enter for newline</p>
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full border border-[#C45A3C]/45 px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-[#F5DDD5] transition hover:border-[#C45A3C] hover:bg-[#C45A3C]/18 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}












// "use client";

// import { useState, useRef, useEffect, type FormEvent } from "react";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar } from "@/components/ui/avatar";
// import { SendIcon, Bot, User } from "lucide-react";

// type UiMsg = {
//   id: string;
//   content: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// };

// export default function ChatbotWidget() {
//   const [messages, setMessages] = useState<UiMsg[]>([
//     {
//       id: "1",
//       content: "Hi there! I'm your personal assistant. Ask me anything about John's content, resume, or projects!",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);

//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

//   /** Converts UI messages → OpenAI role messages */
//   const toOpenAiFormat = (msgs: UiMsg[]) =>
//     msgs.map(({ sender, content }) => ({
//       role: sender === "user" ? "user" : "assistant",
//       content,
//     }));

//   const handleSendMessage = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMsg: UiMsg = {
//       id: Date.now().toString(),
//       content: input,
//       sender: "user",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ thread: toOpenAiFormat([...messages, userMsg]) }),
//       });

//       const data = (await res.json()) as { content?: string; error?: string };
//       const botMsg: UiMsg = {
//         id: Date.now().toString() + "-bot",
//         content: data.content ?? data.error ?? "Sorry, something went wrong.",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: Date.now().toString() + "-bot",
//           content: "Network error – please try again.",
//           sender: "bot",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="h-[400px] flex flex-col">
//       <CardHeader>
//         <CardTitle className="text-xl">Chat with Me</CardTitle>
//       </CardHeader>

//       <CardContent className="flex-1 overflow-y-auto">
//         <div className="space-y-4">
//           {messages.map((m) => (
//             <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`flex gap-2 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
//                 <Avatar className={`h-8 w-8 ${m.sender === "user" ? "bg-primary" : "bg-muted"}`}>
//                   {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//                 </Avatar>
//                 <div
//                   className={`rounded-lg px-3 py-2 text-sm ${
//                     m.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
//                   }`}
//                 >
//                   {m.content}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="flex gap-2 max-w-[80%]">
//                 <Avatar className="h-8 w-8 bg-muted">
//                   <Bot className="h-4 w-4" />
//                 </Avatar>
//                 <div className="rounded-lg px-3 py-2 text-sm bg-muted">
//                   <span className="flex gap-1">
//                     <span className="animate-bounce">.</span>
//                     <span className="animate-bounce delay-100">.</span>
//                     <span className="animate-bounce delay-200">.</span>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={bottomRef} />
//         </div>
//       </CardContent>

//       <CardFooter>
//         <form onSubmit={handleSendMessage} className="flex w-full gap-2">
//           <Input
//             placeholder="Ask me anything..."
//             value={input}
//             onChange={(e) => {
//                           console.log("value →", e.target.value);   // should print each keystroke
//                           setInput(e.target.value);
//                         }}
//             disabled={isLoading}
//             className="flex-1"
//           />
//           <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
//             <SendIcon className="h-4 w-4" />
//             <span className="sr-only">Send message</span>
//           </Button>
//         </form>
//       </CardFooter>
//     </Card>
//   );
// }
