"use client";

import {
  EllipsisIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  UserRoundIcon,
  UserRoundPenIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { TextShimmer } from "@/components/text-shimmer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function DesktopDropdownMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="size-6 overflow-visible border">
              {isPending ? (
                <Skeleton className="size-full rounded-full" />
              ) : (
                <AvatarFallback className="bg-background text-xs uppercase">
                  {session?.user?.email?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>

            <span className="truncate">
              {isPending ? (
                <TextShimmer>Loading...</TextShimmer>
              ) : (
                session?.user?.email
              )}
            </span>
          </div>

          <div className="flex size-6 items-center justify-center opacity-80 group-hover/button:opacity-100">
            <EllipsisIcon size={16} />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 min-w-0">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserRoundPenIcon
              size={16}
              className="opacity-80 group-hover/item:opacity-100"
            />
            My profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="justify-between"
        >
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <SunIcon
                size={16}
                className="opacity-80 group-hover/item:opacity-100"
              />
            ) : (
              <MoonIcon
                size={16}
                className="opacity-80 group-hover/item:opacity-100"
              />
            )}
            Toggle theme
          </div>
          <DropdownMenuShortcut>M</DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/home">
            <HomeIcon
              size={16}
              className="opacity-80 group-hover/item:opacity-100"
            />
            Home page
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/sign-in");
                },
              },
            });
          }}
        >
          <LogOutIcon
            size={16}
            className="opacity-80 group-hover/item:opacity-100"
          />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
