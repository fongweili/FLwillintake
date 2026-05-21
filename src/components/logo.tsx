
'use client';

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0 leading-none", className)}>
      <div className="flex flex-col items-start font-headline font-bold tracking-tighter">
        <span className="text-[#555555] text-xl">FORW<span className="text-[#F59E0B]">A</span>RD</span>
        <span className="text-[#555555] text-xl">LEG<span className="text-[#F59E0B]">A</span>L</span>
      </div>
      <div className="ml-1">
        <svg width="24" height="42" viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L22 12L2 22L22 32L2 40" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
