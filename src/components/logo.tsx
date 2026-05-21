
'use client';

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <div className="font-headline font-bold tracking-tight">
        <span className="text-[#555555] text-xl">FORW<span className="text-[#F59E0B]">A</span>RD</span>
        <span className="text-[#555555] text-xl"> LEG<span className="text-[#F59E0B]">A</span>L</span>
      </div>
    </div>
  );
}
