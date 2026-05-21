
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { ShieldCheck, Zap, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Firm Profile</Link>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Lawyer Access</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-white to-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 py-1 px-4 text-primary border-primary/20">Professional Estate Planning</Badge>
            <h1 className="text-5xl md:text-7xl font-headline mb-6 max-w-4xl mx-auto leading-tight text-[#333333]">
              Modern Will Drafting for <span className="text-primary">Singapore</span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body">
              A high-precision intake system by Forward Legal. Secure, comprehensive, and lawyer-prepared.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary text-white text-lg px-8 h-14 hover:bg-primary/90" asChild>
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
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-headline text-[#333333]">Smart Intake</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our digital questionnaire captures NRIC details, family dynamics, and asset distributions with absolute precision.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-headline text-[#333333]">Lawyer Review</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every document is prepared and vetted by our qualified lawyers before finalization and signing.
                </p>
              </div>
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-headline text-[#333333]">Singapore Compliant</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Engineered specifically for the Wills Act of Singapore and local estate planning requirements.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <Logo />
          <div className="text-muted-foreground text-sm">
            © 2024 Forward Legal LLC. Singapore. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
