
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Scale, Clock, CheckCircle, FileText, LayoutDashboard, Database, Activity } from 'lucide-react';

const MOCK_CASES = [
  { id: '1', client: 'Alice Johnson', status: 'Ready for Review', date: '2024-05-20', type: 'Simple Will' },
  { id: '2', client: 'Robert Smith', status: 'AI Processing', date: '2024-05-21', type: 'Complex Trust' },
  { id: '3', client: 'Emily Davis', status: 'Completed', date: '2024-05-18', type: 'Simple Will' },
  { id: '4', client: 'Michael Brown', status: 'Waiting on Client', date: '2024-05-15', type: 'Estate Plan' },
];

export default function DashboardPage() {
  const [cases, setCases] = useState(MOCK_CASES);

  useEffect(() => {
    const lastDraft = localStorage.getItem('last_draft_data');
    if (lastDraft) {
      const parsed = JSON.parse(lastDraft);
      setCases(prev => [
        { id: 'new', client: parsed.input.clientName, status: 'Ready for Review', date: new Date().toISOString().split('T')[0], type: 'Will Draft' },
        ...prev
      ]);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white flex flex-col hidden lg:flex">
        <div className="p-6 flex items-center gap-2 border-b">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg text-primary">LegisDraft</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-secondary/50" asChild>
            <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/vault"><Database className="h-4 w-4" /> Case Vault</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/monitoring"><Activity className="h-4 w-4" /> AI Monitoring</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/designer"><FileText className="h-4 w-4" /> Logic Designer</Link>
          </Button>
        </nav>
        <div className="p-4 border-t">
          <div className="bg-secondary/20 p-4 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground uppercase mb-1">AI Performance</p>
            <p className="text-sm text-primary font-bold">98.4% Accuracy</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-headline">Case Dashboard</h1>
            <p className="text-muted-foreground">Manage and review drafts collated by AI.</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">Refresh Status</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Load</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Normal</div>
              <p className="text-xs text-muted-foreground">Average wait: 45s</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.client}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.date}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'Ready for Review' ? 'default' : 'secondary'} className={c.status === 'Ready for Review' ? 'bg-accent' : ''}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/cases/${c.id}/review`}>Review Case</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Card>
      </main>
    </div>
  );
}
