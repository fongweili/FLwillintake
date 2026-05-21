
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Brain, Server, ShieldCheck, AlertCircle } from 'lucide-react';

export default function MonitoringPage() {
  const [activeTasks] = useState([
    { id: 'T1', client: 'Alice Johnson', progress: 100, status: 'Completed', agent: 'Will Collator v2.1' },
    { id: 'T2', client: 'Robert Smith', progress: 65, status: 'Extracting Assets', agent: 'Trust Builder v1.0' },
    { id: 'T3', client: 'Sarah Lee', progress: 12, status: 'Parsing Family Profile', agent: 'General Intake Agent' },
  ]);

  return (
    <div className="min-h-screen bg-secondary/20 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-headline">AI Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time oversight of background autonomous processing.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-primary text-white">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5" />
                <span className="text-sm font-medium">Core Intelligence</span>
              </div>
              <div className="text-2xl font-bold">Optimal</div>
              <p className="text-xs text-white/70">LLM Latency: 420ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Task Throughput</span>
              </div>
              <div className="text-2xl font-bold">14.2 / hr</div>
              <p className="text-xs text-muted-foreground">Standardized drafting</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Privacy Guard</span>
              </div>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Zero-data leakage</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Manual Interventions</span>
              </div>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-lg border-none bg-white">
            <CardHeader>
              <CardTitle className="font-headline">Active Processing Queue</CardTitle>
              <CardDescription>Live tracking of autonomous draft generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {activeTasks.map((task) => (
                <div key={task.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-primary">{task.client}</span>
                      <span className="text-xs text-muted-foreground ml-2">[{task.id}]</span>
                    </div>
                    <Badge variant={task.status === 'Completed' ? 'secondary' : 'default'} className={task.status !== 'Completed' ? 'bg-accent' : ''}>
                      {task.status}
                    </Badge>
                  </div>
                  <div className="ai-scanning h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${task.progress}%` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Engine: {task.agent}</span>
                    <span>{task.progress}% Complete</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">System Pulses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="status-pulse h-2 w-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Auth Verification Pulse</p>
                    <p className="text-[10px] text-muted-foreground">Success at {10 + i}:05 AM</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
