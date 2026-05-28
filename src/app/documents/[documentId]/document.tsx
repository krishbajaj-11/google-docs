"use client";

import dynamic from 'next/dynamic';
import { Navbar } from './navbar';
import { Room } from './room';
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const Editor = dynamic(() => import("./editor").then((m) => m.Editor), {
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center">Loading editor…</div>,
});

const Toolbar = dynamic(() => import('./toolbar').then(m => m.default || m), {
  ssr: false,
  loading: () => <div className="h-10" />,
});

interface DocumentProps {

    preloadedDocument:Preloaded<typeof api.documents.getById>
};




export const Document =  ({preloadedDocument}:DocumentProps) => {
    const document=usePreloadedQuery(preloadedDocument);
    // console.log('Loaded document initialContent:', document.initialContent?.slice?.(0,200));
 
    return (
      <Room>
  <div className="min-h-screen bg-[#FAFBFD]">
    <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
      <Navbar data={document} />
      <Toolbar />
    </div>

    <div className="pt-[114px] print:pt-0">
      
       <Editor initialContent={document.initialContent} /> 
      
      
    </div>
  </div>
  </Room>
);
}
 
