
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scale, Plus, GitMerge, Settings, Play, Trash2 } from 'lucide-react';

export default function DesignerPage() {
  const steps = [
    { title: 'Personal Info', type: 'Input', connections: 1 },
    { title: 'Marital Status', type: 'Decision', connections: 2 },
    { title: 'Family Profile', type: 'Conditional', connections: 3 },
    { title: 'Asset Audit', type: 'Iteration', connections: 1 },
  ];

  return (
    <div className="min-h-screen bg-secondary/20 flex flex-col">
      <header className="bg-white border-b h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="font-headline text-lg">Logic Flow Designer</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Play className="h-4 w-4 mr-2" /> Test Flow</Button>
          <Button className="bg-primary text-white" size="sm">Save Changes</Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <aside className="w-64 bg-white border-r p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">Node Toolbox</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 border-dashed h-12">
                <Plus className="h-4 w-4" /> Text Input
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-dashed h-12">
                <GitMerge className="h-4 w-4" /> Logic Branch
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-dashed h-12">
                <Settings className="h-4 w-4" /> Variable Setter
              </Button>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 p-12 bg-secondary/10 flex flex-col items-center gap-12 overflow-auto relative">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center group">
              <Card className="w-64 border-2 hover:border-accent transition-colors shadow-md z-10">
                <CardHeader className="py-3 bg-muted/20 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-headline">{step.title}</CardTitle>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-[10px] text-muted-foreground mb-2">TYPE: {step.type}</div>
                  <div className="h-2 w-full bg-secondary rounded" />
                </CardContent>
              </Card>
              
              {i < steps.length - 1 && (
                <div className="h-12 w-0.5 bg-primary/20 relative">
                  <div className="absolute bottom-0 -left-1 text-primary/40">▼</div>
                </div>
              )}
            </div>
          ))}

          <Button variant="ghost" className="mt-4 border-2 border-dashed border-primary/20 text-primary/60 hover:text-primary hover:border-primary px-12 h-16">
            <Plus className="h-6 w-6 mr-2" /> Append Logic Block
          </Button>
        </div>
      </main>
    </div>
  );
}
