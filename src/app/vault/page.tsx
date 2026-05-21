
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Search, FileText, Download, History } from 'lucide-react';

export default function VaultPage() {
  const archives = [
    { name: 'Johnson_Alice_Will_v2.pdf', date: '2024-05-18', size: '1.2 MB', encrypted: true },
    { name: 'Smith_Robert_Draft_v1.pdf', date: '2024-05-20', size: '0.8 MB', encrypted: true },
    { name: 'Davis_Emily_Final.pdf', date: '2024-05-15', size: '2.1 MB', encrypted: true },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-headline flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" /> Secure Case Vault
            </h1>
            <p className="text-muted-foreground">Bank-grade repository for all client assets and versioned documents.</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Lock className="h-4 w-4" /> End-to-End Encrypted
          </div>
        </header>

        <Card className="mb-8 border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input className="pl-10 h-12" placeholder="Search by client name, document ID, or date..." />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((doc, idx) => (
            <Card key={idx} className="hover:shadow-xl transition-shadow border-none bg-white">
              <CardHeader className="pb-2">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-md font-headline truncate">{doc.name}</CardTitle>
                <CardDescription>Created: {doc.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Size: {doc.size}</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700">AES-256</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><Download className="h-3 w-3 mr-1" /> Download</Button>
                  <Button variant="outline" size="sm" className="flex-1"><History className="h-3 w-3 mr-1" /> History</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
