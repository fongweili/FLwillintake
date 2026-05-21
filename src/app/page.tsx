
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
            <span className="text-2xl font-headline text-primary">LegisDraft</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="/vault" className="text-sm font-medium hover:text-primary transition-colors">Case Vault</Link>
            <Link href="/monitoring" className="text-sm font-medium hover:text-primary transition-colors">AI Monitoring</Link>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/dashboard">Lawyer Portal</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-white to-secondary/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-headline mb-6 max-w-4xl mx-auto leading-tight">
              The Future of Legal Drafting is <span className="text-accent">Intelligent</span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Automate the intake, refine with professional precision, and execute secure legal documents with LegisDraft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary text-lg px-8 h-14" asChild>
                <Link href="/intake">Start Client Intake</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link href="/dashboard">View Lawyer Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg bg-secondary/20">
                <CardContent className="pt-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline mb-3">AI Draft Collator</h3>
                  <p className="text-muted-foreground">
                    Instant generation of first-cut legal drafts based on structured client intake data.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-secondary/20">
                <CardContent className="pt-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline mb-3">Secure Case Vault</h3>
                  <p className="text-muted-foreground">
                    Bank-grade encryption for all sensitive client responses and document versions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-secondary/20">
                <CardContent className="pt-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-headline mb-3">Iterative Refinement</h3>
                  <p className="text-muted-foreground">
                    A lawyer-first refinement loop powered by AI reasoning for precise amendments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-headline text-white mb-6">Ready to streamline your firm's drafting process?</h2>
              <p className="text-white/80 text-lg mb-8">
                Empower your associates with AI tools and ensure every document meets your highest standards of quality.
              </p>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary h-12 px-8">
                Request a Demo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-20 w-full bg-accent/10 rounded border border-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm font-medium">AI Agent Processing...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 LegisDraft. Built for the modern legal professional.</p>
        </div>
      </footer>
    </div>
  );
}
