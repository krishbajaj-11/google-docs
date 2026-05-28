"use client";

import Image from "next/image";
import Link from "next/link";
import { BsFilePdf } from "react-icons/bs";
import { DocumentInput } from "./document-input";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import dynamic from "next/dynamic";
const Avatars = dynamic(() => import("./avatars").then((m) => m.Avatars), {
  ssr: false,
  loading: () => <div className="h-8 w-8 rounded-full bg-neutral-200" />,
});

import { RenameDialog } from "@/components/rename-dialog";
import { RemoveDialog } from "@/components/remove-dialog";

import {
  BoldIcon,
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  ItalicIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  TextIcon,
  TrashIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
const Inbox = dynamic(() => import("./inbox").then((m) => m.Inbox), {
  ssr: false,
  loading: () => <div className="h-8 w-8" />,
});

import { useEditorStore } from "@/store/use-editor-store";
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { useMutation, usePreloadedQuery } from "convex/react";
import {Doc} from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";

interface NavbarProps {
  data: Doc<"documents">;
}

export const Navbar = ({ data }: NavbarProps) => {

    const router = useRouter();

const { editor } = useEditorStore();

const mutation = useMutation(api.documents.create);

const onNewDocument = () => {
  mutation({
    title: "Untitled document",
    initialContent: "",
  }).then((id) => {
    router.push(`/documents/${id}`);
  });
};

    const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
  editor
    ?.chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: false })
    .run();
};

// DOWNLOAD HELPER
const onDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

// SAVE JSON
const onSaveJSON = () => {
  if (!editor) return;

  const content = editor.getJSON();

  const blob = new Blob([JSON.stringify(content)], {
    type: "application/json",
  });

  onDownload(blob, "${data.title}.json");
};

// SAVE HTML
const onSaveHTML = () => {
  if (!editor) return;

  const content = editor.getHTML();

  const blob = new Blob([content], {
    type: "text/html",
  });

  onDownload(blob, "${data.title}.html");
};

// SAVE TEXT
const onSaveText = () => {
  if (!editor) return;

  const content = editor.getText();

  const blob = new Blob([content], {
    type: "text/plain",
  });

  onDownload(blob, "${data.title}.txt");
};


  return (
    <nav className="flex items-center justify-between relative z-50">
      <div className="flex gap-2 items-center flex-1 min-w-0">
        {/* LOGO */}
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>

        {/* TITLE + MENUBAR */}
        <div className="flex flex-col gap-1 min-w-0">
          <DocumentInput title={data.title} id={data._id} />

          <Menubar className="border-none bg-transparent shadow-none h-auto p-0 gap-x-1">

            {/* FILE */}
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 text-sm rounded-sm hover:bg-neutral-200 data-[state=open]:bg-neutral-200">
                File
              </MenubarTrigger>

              <MenubarContent className="bg-white border shadow-md rounded-md z-[999] min-w-[220px]">
                <MenubarSub>
                  <MenubarSubTrigger>
                    <FileIcon className="size-4 mr-2" />
                    Save
                  </MenubarSubTrigger>

                  <MenubarSubContent className="bg-white border shadow-md rounded-md z-[999]">
                    <MenubarItem onClick={onSaveJSON}>
                      <FileJsonIcon className="size-4 mr-2" />
                      JSON
                    </MenubarItem>
                    <MenubarItem onClick={onSaveHTML}>
                      <GlobeIcon className="size-4 mr-2" />
                      HTML
                    </MenubarItem>
                    <MenubarItem onClick={()=>window.print()}>
                      <BsFilePdf className="size-4 mr-2" />
                      PDF
                    </MenubarItem>
                    <MenubarItem onClick={onSaveText}>
                      <FileTextIcon className="size-4 mr-2" />
                      Text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarSeparator />

                <MenubarItem onClick={onNewDocument}>
                  <FilePlusIcon className="size-4 mr-2" />
                  New Document
                </MenubarItem>



                <RenameDialog documentId={data._id} initialTitle={data.title}>
                <MenubarItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
                >
                  <FilePenIcon className="size-4 mr-2" />
                  Rename
                </MenubarItem>
                </RenameDialog>

                <RemoveDialog documentId={data._id}>
                <MenubarItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
                >
                  <TrashIcon className="size-4 mr-2" />
                  Remove
                </MenubarItem>
                </RemoveDialog>

                <MenubarSeparator />

                <MenubarItem onClick={() => window.print()}>
                  <PrinterIcon className="size-4 mr-2" />
                  Print <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* EDIT */}
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 text-sm rounded-sm hover:bg-neutral-200 data-[state=open]:bg-neutral-200">
                Edit
              </MenubarTrigger>

              <MenubarContent className="bg-white border shadow-md rounded-md z-[999]">
                <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                  <Undo2Icon className="size-4 mr-2" />
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>

                <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                  <Redo2Icon className="size-4 mr-2" />
                  Redo <MenubarShortcut>⌘Y</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* INSERT */}
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 text-sm rounded-sm hover:bg-neutral-200 data-[state=open]:bg-neutral-200">
                Insert
              </MenubarTrigger>

              <MenubarContent className="bg-white border shadow-md rounded-md z-[999]">
                <MenubarSub>
                  <MenubarSubTrigger>Table</MenubarSubTrigger>

                  <MenubarSubContent className="bg-white border shadow-md rounded-md z-[999]">
                    <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>
                      1 x 1
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>
                      2 x 2
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>
                      3 x 3
                    </MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>
                      4 x 4
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            {/* FORMAT */}
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 text-sm rounded-sm hover:bg-neutral-200 data-[state=open]:bg-neutral-200">
                Format
              </MenubarTrigger>

              <MenubarContent className="bg-white border shadow-md rounded-md z-[999]">
                <MenubarSub>
                  <MenubarSubTrigger>
                    <TextIcon className="size-4 mr-2" />
                    Text
                  </MenubarSubTrigger>

                  <MenubarSubContent className="bg-white border shadow-md rounded-md z-[999]">
                    <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                      <BoldIcon className="size-4 mr-2" />
                      Bold
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                      <ItalicIcon className="size-4 mr-2" />
                      Italic
                    </MenubarItem>
                    <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                      <UnderlineIcon className="size-4 mr-2" />
                      Underline
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                  <RemoveFormattingIcon className="size-4 mr-2" />
                  Clear Formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

          </Menubar>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-2">
        <Avatars />
        <Inbox />
        {/* Show stable controls to avoid unmounting during Clerk initialization */}
        <StableControls />
      </div>
    </nav>
  );
};

function StableControls() {
  return (
    <div className="flex items-center gap-2">
      <ClerkLoading>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-md bg-neutral-200 animate-pulse" />
          <div className="h-8 w-8 rounded-full bg-neutral-200 animate-pulse" />
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton>
            <button className="px-3 py-1 rounded-md border border-neutral-300 bg-white text-sm hover:bg-neutral-50">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/"
            afterLeaveOrganizationUrl="/"
            afterSelectOrganizationUrl="/"
            afterSelectPersonalUrl="/"
          />
          <UserButton />
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}


