
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { refineWillDraftWithAI } from '@/ai/flows/refine-will-draft-with-ai';
import { Scale, ArrowLeft, Send, Sparkles, CheckCircle, Loader2, Save } from 'lucide-react';

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [draft, setDraft] = useState<string>('');
  const [inputData, setInputData] = useState<any>(null);
  const [amendments, setAmendments] = useState<string>('');
  const [refining, setRefining] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Attempt to load the draft data
    const lastDraft = localStorage.getItem('last_draft_data');
    if (lastDraft) {
      const parsed = JSON.parse(lastDraft);
      setDraft(parsed.draft);
      setInputData(parsed.input);
    } else {
      // Dummy data fallback
      setDraft("LAST WILL AND TESTAMENT\n\nI, Alice Johnson, residing at 456 Oak St, specify my distribution...");
    }
  }, []);

  const handleRefine = async () => {
    if (!amendments.trim()) return;
    setRefining(true);
    try {
      const result = await refineWillDraftWithAI({
        originalDraft: draft,
        amendments: amendments
      });
      setDraft(result.refinedDraft);
      setAmendments('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setRefining(false);
    }
  };

  const handleFinalize = () => {
    // In a real app, save the final version to the vault
    localStorage.setItem('vetted_document', draft);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-white border-b h-16 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <h1 className="font-headline text-lg">Case Review: {inputData?.clientName || 'Loading...'}</h1>
            </div>
            <Badge variant="outline" className="ml-2">Draft Version 1.2</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/monitoring')}>
              View Logic Flow
            </Button>
            <Button className="bg-primary text-white" onClick={handleFinalize}>
              <CheckCircle className="mr-2 h-4 w-4" /> Finalize & Send
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Left: Intake Data (Context) */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="h-[calc(100vh-140px)] overflow-auto bg-white border-none shadow-md">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-sm font-headline uppercase tracking-wider text-muted-foreground">Client Intake Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {inputData ? (
                <>
                  <section>
                    <h3 className="text-xs font-bold text-primary mb-2">IDENTIFICATION</h3>
                    <div className="grid gap-2">
                      <div className="text-sm"><span className="text-muted-foreground">Full Name:</span> {inputData.clientName}</div>
                      <div className="text-sm"><span className="text-muted-foreground">Address:</span> {inputData.clientAddress}</div>
                      <div className="text-sm"><span className="text-muted-foreground">Marital:</span> {inputData.maritalStatus}</div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold text-primary mb-2">FAMILY</h3>
                    <div className="text-sm"><span className="text-muted-foreground">Spouse:</span> {inputData.spouseName || 'None'}</div>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold text-primary mb-2">EXECUTOR</h3>
                    <div className="text-sm"><span className="text-muted-foreground">Primary:</span> {inputData.executorName} ({inputData.executorRelationship})</div>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold text-primary mb-2">BENEFICIARIES</h3>
                    {inputData.beneficiaries.map((b: any, i: number) => (
                      <div key={i} className="text-sm mb-1">
                        <span className="text-muted-foreground">{b.name}:</span> {b.share}
                      </div>
                    ))}
                  </section>
                  <section>
                    <h3 className="text-xs font-bold text-primary mb-2">PROVISIONS</h3>
                    <p className="text-sm italic text-muted-foreground">{inputData.additionalProvisions || 'None provided'}</p>
                  </section>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No intake data found for this case.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: AI Editor & Draft */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="flex-1 flex flex-col gap-6">
            <Card className="flex-1 overflow-auto document-column border-none shadow-xl bg-white relative">
              <div className="absolute top-4 right-4 z-10">
                {isSuccess && <Badge className="bg-green-500 text-white animate-bounce">Update Applied!</Badge>}
              </div>
              <CardContent className="p-12 whitespace-pre-wrap font-body text-[16px] leading-relaxed text-primary/80">
                {draft}
              </CardContent>
            </Card>

            <Card className="border-accent/20 border bg-accent/5">
              <CardHeader className="py-4">
                <CardTitle className="text-sm flex items-center gap-2 text-accent font-headline">
                  <Sparkles className="h-4 w-4" /> AI Refinement Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Enter amendments (e.g., 'Change the executor name' or 'Add a clause about trust distribution for minors')..."
                    className="flex-1 bg-white"
                    value={amendments}
                    onChange={(e) => setAmendments(e.target.value)}
                  />
                  <Button 
                    className="h-auto bg-accent text-white px-6" 
                    onClick={handleRefine}
                    disabled={refining || !amendments.trim()}
                  >
                    {refining ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                </div>
                <p className="text-[10px] text-accent/70 mt-2">
                  AI will precisely interpret your instructions to update the draft above while maintaining legal formatting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
