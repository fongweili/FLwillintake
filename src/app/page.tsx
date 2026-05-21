
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, ShieldCheck, Zap, FileText, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-headline text-primary">FORWARD LEGAL</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Firm Profile</Link>
            <Link href="/vault" className="text-sm font-medium hover:text-primary transition-colors">Secure Vault</Link>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Solicitor Access</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-white to-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 py-1 px-4 text-primary border-primary/20">Singapore Legal Excellence</Badge>
            <h1 className="text-5xl md:text-7xl font-headline mb-6 max-w-4xl mx-auto leading-tight">
              Professional Will Drafting <span className="text-accent">Redefined</span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body">
              A high-precision intake system for Forward Legal clients. Secure, comprehensive, and legally sound.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary text-lg px-8 h-14" asChild>
                <Link href="/intake">Start Digital Questionnaire</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link href="/dashboard">Lawyer Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-headline">Smart Intake</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our digital questionnaire captures NRIC details, family dynamics, and asset distributions with absolute precision.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-headline">Solicitor Review</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every AI-generated draft undergoes a rigorous vetting process by our qualified solicitors before finalization.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-headline">Singapore Compliant</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Engineered specifically for the Wills Act of Singapore and local estate planning requirements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-headline font-bold text-primary">FORWARD LEGAL</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2024 Forward Legal LLC. All Rights Reserved. Singapore.
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
