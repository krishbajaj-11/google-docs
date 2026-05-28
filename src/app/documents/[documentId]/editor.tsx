"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension, FloatingToolbar } from "@liveblocks/react-tiptap";
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Image } from '@tiptap/extension-image';
import ImageResize from "tiptap-extension-resize-image";
import { useEditorStore } from "@/store/use-editor-store";
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import {useStorage} from "@liveblocks/react";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import {FontSizeExtension} from "@/extensions/font-size";
import{LineHeightExtension} from "@/extensions/line-height";
import dynamic from "next/dynamic";
const Ruler = dynamic(() => import("./ruler").then((m) => m.Ruler), {
    ssr: false,
    loading: () => <div className="h-6" />,
});
const Threads = dynamic(() => import("./threads").then((m) => m.Threads), {
    ssr: false,
    loading: () => <div className="w-0" />,
});


interface EditorProps {
  initialContent?: string|undefined;
}






export const Editor = ({ initialContent }: EditorProps) => {
    const leftMargin = useStorage((root) => root.leftMargin);
    const rightMargin = useStorage((root) => root.rightMargin);
    const liveblocks = useLiveblocksExtension({
        initialContent: initialContent ?? "",
    }) as any;
    const {setEditor} = useEditorStore();
  const editor = useEditor({
immediatelyRender: false,

    onCreate({editor}){
        setEditor(editor);

    },

    onDestroy(){
        setEditor(null);
    },

    onUpdate({editor}){
        setEditor(editor);
    },

    onSelectionUpdate({editor}){
        setEditor(editor);
    },

    onTransaction({editor}){
        setEditor(editor);
    },
    onFocus({editor}){
        setEditor(editor);
    },
    onBlur({editor}){
        setEditor(editor);
    },
    onContentError({editor}){
        setEditor(editor);
    },
    editorProps: {
      attributes: {
        style:`padding-left:${leftMargin}px; padding-right:${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1050px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
       liveblocks,
        StarterKit.configure({
            undoRedo: false,
        }) ,
        LineHeightExtension.configure({
            types: ['paragraph', 'heading'],
            defaultLineHeight: 'normal',
        }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',

        }),
        Underline,
        TextStyle,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Color,
        Highlight.configure({
            multicolor: true,
        }),
        FontFamily,
        ImageResize,
        FontSizeExtension,
        Image,
        Table,
        TableRow,
        TableHeader,
        TableCell,
        TaskItem.configure({
            nested: true,
        }),
        TaskList,
    ],
        // Content is initialized by Liveblocks extension to ensure
        // collaborative state is seeded correctly. Do not set `content`
        // here when using Liveblocks.
  });

   return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
        <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor}/>
      </div>
    </div>
  );
};