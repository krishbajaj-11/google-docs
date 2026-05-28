"use client";

import { BellIcon } from "lucide-react";
import { ClientSideSuspense } from "@liveblocks/react";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import {
  InboxNotification,
  InboxNotificationList,
} from "@liveblocks/react-ui";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Inbox = () => {
  return (
    <InboxMenuShell />
  );
};

const InboxMenuShell = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="relative border border-neutral-200 bg-white text-neutral-800"
          size="icon"
        >
          <BellIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <ClientSideSuspense fallback={<div className="p-4">Loading...</div>}>
          <InboxMenuContent />
        </ClientSideSuspense>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const InboxMenuContent = () => {
  const { inboxNotifications } = useInboxNotifications();

  return (
    <InboxNotificationList>
      {inboxNotifications && inboxNotifications.length > 0 ? (
        inboxNotifications.map((notification) => (
          <InboxNotification key={notification.id} inboxNotification={notification} />
        ))
      ) : (
        <div className="p-4 text-sm text-muted-foreground">No notifications</div>
      )}
    </InboxNotificationList>
  );
};

export default Inbox;