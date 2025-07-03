"use client";

import cn from "classnames";
import Markdown from "react-markdown";
import { markdownComponents } from "@/components/markdown-components";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SpinnerIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { chatConfig } from "@/config/chat";
import { ErrorHandlers } from "@/lib/error-handling";
import type { UIMessage } from "ai";
import type {
  ReasoningMessagePartProps,
  TextMessagePartProps,
  MessagesProps,
} from "@/types/components";

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  useEffect(() => {
    if (!isReasoning) {
      setIsExpanded(false);
    }
  }, [isReasoning]);

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              }
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {part.details.map((detail, detailIndex) =>
              detail.type === "text" ? (
                <Markdown key={detailIndex} components={markdownComponents}>
                  {detail.text}
                </Markdown>
              ) : (
                "<redacted>"
              )
            )}

            {/* <Markdown components={markdownComponents}>{reasoning}</Markdown> */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Copied to clipboard");

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      ErrorHandlers.componentError("Failed to copy text to clipboard", error, {
        component: "CopyButton",
        action: "handleCopy",
      });
      toast.error("Failed to copy text");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-6 w-6 p-0"
      aria-label="Copy message"
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="h-3 w-3 text-green-600" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3 w-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return <Markdown components={markdownComponents}>{text}</Markdown>;
}

export function Messages({ messages, status, onEditMessage }: MessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(
    null
  );
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  const handleStartEdit = (messageIndex: number, currentContent: string) => {
    setEditingMessageIndex(messageIndex);
    setEditContent(currentContent);
  };

  const handleSaveEdit = () => {
    if (editingMessageIndex !== null && onEditMessage) {
      onEditMessage(editingMessageIndex, editContent.trim());
      setEditingMessageIndex(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageIndex(null);
    setEditContent("");
  };

  const getMessageText = (message: UIMessage): string => {
    return message.parts
      .filter(
        (part): part is { type: "text"; text: string } => part.type === "text"
      )
      .map((part) => part.text)
      .join("");
  };

  // Find the index of the last user message
  const lastUserMessageIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        return i;
      }
    }
    return -1;
  }, [messages]);

  return (
    <div
      className="flex flex-col gap-8 overflow-y-auto items-center w-full px-6 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      ref={messagesRef}
    >
      {messages.map((message, messageIndex) => {
        const isLastUserMessage =
          chatConfig.enableMessageEditing &&
          message.role === "user" &&
          messageIndex === lastUserMessageIndex;

        const isEditing = editingMessageIndex === messageIndex;
        const messageText = getMessageText(message);

        return (
          <div
            key={message.id}
            className={cn(
              "group flex flex-col gap-4 last-of-type:mb-12 first-of-type:mt-16 w-full"
            )}
          >
            <div
              className={cn({
                "dark:bg-zinc-800 bg-zinc-200 p-2 rounded-xl w-fit ml-auto":
                  message.role === "user",
              })}
            >
              {isEditing ? (
                <div className="flex flex-col gap-2 w-full">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                    placeholder="Edit your message..."
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {message.parts.map((part, partIndex) => {
                    if (part.type === "text") {
                      return (
                        <TextMessagePart
                          key={`${message.id}-${partIndex}`}
                          text={part.text}
                        />
                      );
                    }

                    if (part.type === "reasoning") {
                      return (
                        <ReasoningMessagePart
                          key={`${message.id}-${partIndex}`}
                          part={part}
                          isReasoning={
                            status === "streaming" &&
                            partIndex === message.parts.length - 1
                          }
                        />
                      );
                    }

                    return null;
                  })}

                  {/* Action buttons - positioned below content */}
                  {!isEditing &&
                    (message.role === "assistant" || isLastUserMessage) && (
                      <div className="flex justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {message.role === "assistant" && (
                          <CopyButton text={messageText} />
                        )}
                        {isLastUserMessage && onEditMessage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStartEdit(messageIndex, messageText)
                            }
                            className="h-6 w-6 p-0"
                            aria-label="Edit message"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {status === "submitted" && (
        <div className="text-zinc-500 mb-12 w-full">Hmm...</div>
      )}
    </div>
  );
}
