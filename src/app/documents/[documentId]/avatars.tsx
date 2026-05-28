"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

import { Separator } from "@/components/ui/separator";

const AVATAR_SIZE = 36;

interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ src, name }: AvatarProps) => {
  return (
    <div
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
      className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400"
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
        {name}
      </div>

      <img
        alt={name}
        src={src}
        className="size-full rounded-full"
      />
    </div>
  );
};

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();

  // Show at least the current user's avatar even if there are no other users.
  if (!currentUser && users.length === 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      {currentUser && (
        <Avatar
          src={currentUser.info.avatar}
          name="You"
        />
      )}

      {users.map(({ connectionId, info }) => (
        <Avatar
          key={connectionId}
          src={info.avatar}
          name={info.name}
        />
      ))}

      <Separator orientation="vertical" className="h-6" />
    </div>
  );
};

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};