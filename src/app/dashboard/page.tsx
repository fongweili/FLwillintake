
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Logo } from '@/components/logo';
import { Clock, CheckCircle, LayoutDashboard, Database, Activity, UserPlus } from 'lucide-react';

const MOCK_CASES = [
  { id: '1', client: 'Tan Ah Kow', status: 'Ready for Review', date: '2024-05-20', type: 'Simple Will' },
  { id: '2', client: 'Siti Aminah', status: 'Processing', date: '2024-05-21', type: 'Complex Trust' },
  { id: '3', client: 'Rajesh Kumar', status: 'Completed', date: '2024-05-18', type: 'Simple Will' },
];

export default function DashboardPage() {
  const [cases, setCases] = useState(MOCK_CASES);

  useEffect(() => {
    const lastDraft = localStorage.getItem('last_draft_data');
    if (lastDraft) {
      const parsed = JSON.parse(lastDraft);
      setCases(prev => [
        { id: 'new', client: parsed.input.clientName, status: 'Ready for Review', date: new Date().toISOString().split('T')[0], type: 'Intake Completed' },
        ...prev
      ]);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-[#333333]">
      <aside className="w-64 border-r bg-white flex flex-col hidden lg:flex">
        <div className="p-6 border-b flex items-center justify-center">
          <Logo className="scale-90" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 bg-primary/5 text-primary" asChild>
            <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/vault"><Database className="h-4 w-4" /> Case Vault</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/monitoring"><Activity className="h-4 w-4" /> Engine Status</Link>
          </Button>
        </nav>
        <div className="p-4 border-t">
          <div className="bg-primary/5 p-4 rounded-lg">
            <p className="text-[10px] font-bold text-primary uppercase mb-1">Lawyer Mode</p>
            <p className="text-sm font-medium">Partner Portal</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-headline text-[#333333]">Partner Dashboard</h1>
            <p className="text-muted-foreground font-body">Reviewing digital intakes for Forward Legal Singapore.</p>
          </div>
          <Button className="bg-primary text-white hover:bg-primary/90" asChild>
            <Link href="/intake"><UserPlus className="mr-2 h-4 w-4" /> New Intake</Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Action required</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed (May)</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Standardized wills executed</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafting Accuracy</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Validation score</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-headline">Client Name</TableHead>
                <TableHead className="font-headline">Case Type</TableHead>
                <TableHead className="font-headline">Submitted</TableHead>
                <TableHead className="font-headline">Status</TableHead>
                <TableHead className="text-right font-headline">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.client}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'Ready for Review' ? 'default' : 'secondary'} className={c.status === 'Ready for Review' ? 'bg-primary text-white' : ''}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cases/${c.id}/review`}>PREPARE DRAFT</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
