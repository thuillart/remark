"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  CheckIcon,
  ClipboardCheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useState } from "react";

import { useApiKeyStore } from "@/api-keys/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn, toast } from "@/lib/utils";

export function ViewDialog() {
  const { open, setOpen, apiKey, setApiKey } = useApiKeyStore();

  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  async function handleCopy() {
    setIsCopied(true);
    await navigator.clipboard.writeText(apiKey ?? "");

    toast({
      Icon: ClipboardCheckIcon,
      title: "Copied to clipboard",
      description: "Paste it into your .env file",
    });

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }

  return (
    <Dialog
      open={open === "view"}
      onOpenChange={() => {
        setOpen(null);
        setApiKey(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View API Key </DialogTitle>
        </DialogHeader>

        <VisuallyHidden>
          <DialogDescription>
            View the API key so you can paste it in your .env.
          </DialogDescription>
        </VisuallyHidden>

        <Alert variant="destructive">
          <TriangleAlertIcon size={16} />
          <AlertDescription>You can only view it once.</AlertDescription>
        </Alert>

        <div className="relative">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey ?? ""}
            readOnly
            className="pr-20 font-mono"
          />

          <div className="-translate-y-1/2 absolute top-1/2 right-1.5 flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="size-7 rounded"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="size-7 rounded"
            >
              {isCopied ? (
                <CheckIcon
                  size={16}
                  className={cn(
                    isCopied ? "fade-in animate-in" : "fade-out animate-out",
                  )}
                />
              ) : (
                <CopyIcon
                  size={16}
                  className={cn(
                    isCopied ? "fade-out animate-out" : "fade-in animate-in",
                  )}
                />
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(null)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
