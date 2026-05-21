
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateFirstWillDraft, type WillIntakeInput } from '@/ai/flows/generate-first-will-draft';
import { Logo } from '@/components/logo';
import { ArrowLeft, ArrowRight, Loader2, Info, Plus, Trash2, CalendarIcon, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [appointDifferentTrustees, setAppointDifferentTrustees] = useState(false);
  const totalSteps = 5;

  const [formData, setFormData] = useState<WillIntakeInput>({
    clientName: '',
    nric: '',
    clientAddress: '',
    maritalStatus: 'Single',
    executors: [{ name: '', nric: '', relationship: '', isSubstitute: false }],
    residuaryDistribution: [{ name: '', nric: '', percentage: '100%' }],
    specificBequests: [],
    children: [],
  });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const draft = await generateFirstWillDraft(formData);
      localStorage.setItem('last_draft_data', JSON.stringify({ input: formData, draft }));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const LegalNote = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex items-center ml-1 text-primary hover:text-primary/80 transition-colors">
            <Info className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white text-foreground p-4 shadow-2xl border border-primary/20">
          <p className="font-bold mb-2 text-sm text-primary border-b border-primary/10 pb-1">{title}</p>
          <div className="text-xs leading-relaxed space-y-2">{children}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <div className="text-right">
            <span className="text-sm font-bold text-primary">Step {step} of {totalSteps}</span>
            <Progress value={(step / totalSteps) * 100} className="w-32 h-2 mt-1" />
          </div>
        </div>

        <Card className="shadow-2xl border-none overflow-hidden bg-white">
          <div className="bg-primary h-2" />
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-headline text-[#555555]">
              {step === 1 && "Welcome & Identification"}
              {step === 2 && "Family & Dependents"}
              {step === 3 && "Appointments"}
              {step === 4 && "Bequests & Residue"}
              {step === 5 && "Final Instructions"}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 1 && "Let's begin with your personal details for your Singapore Will."}
              {step === 2 && "Listing your loved ones to ensure they are provided for."}
              {step === 3 && "Choosing who will handle your affairs and care for your children."}
              {step === 4 && "Deciding how your money and property will be distributed."}
              {step === 5 && "Reviewing final clauses and funeral wishes."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-3">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> A Warm Welcome from Forward Legal
                  </h3>
                  <p className="text-sm text-[#555555] leading-relaxed">
                    We are honored to assist you with your estate planning. This questionnaire is designed to capture all necessary details to draft a robust Will under the <strong>Singapore Wills Act</strong>. 
                  </p>
                  <ul className="text-xs text-[#666666] space-y-1 list-disc pl-4">
                    <li>Your data is encrypted and kept strictly confidential.</li>
                    <li>The info provided will be used to generate a draft for solicitor review.</li>
                    <li>Once vetted, we will contact you to finalize the document for signing.</li>
                  </ul>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Full Name (as per NRIC/Passport) <LegalNote title="Testator">The person who makes the Will. <strong>Tip:</strong> Ensure the name matches your NRIC exactly to avoid probate delays later.</LegalNote></Label>
                    <Input 
                      value={formData.clientName} 
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})} 
                      placeholder="Enter your full legal name" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NRIC / Passport No.</Label>
                      <Input 
                        value={formData.nric} 
                        onChange={(e) => setFormData({...formData, nric: e.target.value})} 
                        placeholder="e.g. S1234567A" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Residential Address (Singapore)</Label>
                    <Textarea 
                      value={formData.clientAddress} 
                      onChange={(e) => setFormData({...formData, clientAddress: e.target.value})} 
                      placeholder="Full Singapore residential address" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Marital Status</Label>
                  <RadioGroup 
                    value={formData.maritalStatus} 
                    onValueChange={(val) => setFormData({...formData, maritalStatus: val as any})}
                    className="flex flex-wrap gap-4"
                  >
                    {['Single', 'Married', 'Divorced', 'Widowed'].map((status) => (
                      <div key={status} className="flex items-center space-x-2 border p-3 rounded-lg flex-1 min-w-[120px]">
                        <RadioGroupItem value={status} id={status} />
                        <Label htmlFor={status} className="cursor-pointer">{status}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {formData.maritalStatus === 'Married' && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                    <div className="space-y-2">
                      <Label>Spouse Name</Label>
                      <Input value={formData.spouseName || ''} onChange={(e) => setFormData({...formData, spouseName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Spouse NRIC</Label>
                      <Input value={formData.spouseNric || ''} onChange={(e) => setFormData({...formData, spouseNric: e.target.value})} />
                    </div>
                  </div>
                )}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Children</Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, children: [...(formData.children || []), { name: '', nric: '', dob: '' }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Child
                    </Button>
                  </div>
                  {(formData.children || []).map((child, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg relative">
                      <Input placeholder="Full Name" value={child.name} onChange={(e) => {
                        const kids = [...(formData.children || [])];
                        kids[i].name = e.target.value;
                        setFormData({...formData, children: kids});
                      }} />
                      <Input placeholder="NRIC" value={child.nric} onChange={(e) => {
                        const kids = [...(formData.children || [])];
                        kids[i].nric = e.target.value;
                        setFormData({...formData, children: kids});
                      }} />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-white">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {child.dob ? format(new Date(child.dob), "PPP") : "DOB"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={child.dob ? new Date(child.dob) : undefined} onSelect={(d) => {
                          const kids = [...(formData.children || [])];
                          kids[i].dob = d ? d.toISOString() : '';
                          setFormData({...formData, children: kids});
                        }} initialFocus /></PopoverContent>
                      </Popover>
                      <Button variant="ghost" size="icon" className="absolute -right-2 -top-2" onClick={() => {
                        const kids = [...(formData.children || [])];
                        kids.splice(i, 1);
                        setFormData({...formData, children: kids});
                      }}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Executors <LegalNote title="Executor Selection">
                      <p><strong>Definition:</strong> The person who gathers your assets, pays your debts, and distributes your estate after death.</p>
                      <p><strong>Tips:</strong> Choose someone you trust implicitly, who is responsible, and likely to be around. Most people choose their spouse or adult children.</p>
                    </LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, executors: [...formData.executors, { name: '', nric: '', relationship: '', isSubstitute: true }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Substitute
                    </Button>
                  </div>
                  {formData.executors.map((exec, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-4 relative">
                      <div className="flex justify-between items-center">
                        <Badge variant={exec.isSubstitute ? "outline" : "default"}>{exec.isSubstitute ? "Substitute Executor" : "Primary Executor"}</Badge>
                        {exec.isSubstitute && <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => {
                          const ex = [...formData.executors];
                          ex.splice(i, 1);
                          setFormData({...formData, executors: ex});
                        }} />}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Full Name" value={exec.name} onChange={(e) => {
                          const ex = [...formData.executors];
                          ex[i].name = e.target.value;
                          setFormData({...formData, executors: ex});
                        }} />
                        <Input placeholder="NRIC" value={exec.nric} onChange={(e) => {
                          const ex = [...formData.executors];
                          ex[i].nric = e.target.value;
                          setFormData({...formData, executors: ex});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Trustees <LegalNote title="Trustee vs Executor">
                      <p><strong>Executor:</strong> Handles immediate administrative tasks (probate, paying debts).</p>
                      <p><strong>Trustee:</strong> Manages assets over the long-term (e.g. if you have minor children who can't receive their inheritance until age 21).</p>
                      <p><strong>Tip:</strong> Usually, the Executor and Trustee are the <strong>same person</strong>. You only need different people if you want one person to do the paperwork and another to manage the money for your kids.</p>
                    </LegalNote></Label>
                    <div className="flex items-center space-x-2">
                      <Switch checked={appointDifferentTrustees} onCheckedChange={setAppointDifferentTrustees} />
                      <span className="text-xs font-medium">Appoint different Trustees?</span>
                    </div>
                  </div>
                  
                  {!appointDifferentTrustees ? (
                    <p className="text-xs text-[#666666] italic bg-secondary/50 p-3 rounded">
                      The Executors listed above will also act as your Trustees for any long-term asset management.
                    </p>
                  ) : (
                    <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground text-xs">
                      [Trustee management fields enabled - Solicitors will contact you for these details]
                    </div>
                  )}
                </div>

                {(formData.children || []).length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg">Guardian <LegalNote title="Legal Guardian">
                      <p>The person who will have legal custody and responsibility for raising your children if both parents pass away before they reach 21.</p>
                      <p><strong>Tip:</strong> Choose someone who shares your values and has a good relationship with your children.</p>
                    </LegalNote></Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Guardian Name" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
                      <Input placeholder="Guardian NRIC" value={formData.guardianNric || ''} onChange={(e) => setFormData({...formData, guardianNric: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Residuary Estate <LegalNote title="The Residue">
                      <p>The "Residue" is everything you own that hasn't been specifically gifted elsewhere. This usually includes your bank accounts, investments, and property.</p>
                    </LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, residuaryDistribution: [...formData.residuaryDistribution, { name: '', nric: '', percentage: '' }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
                    </Button>
                  </div>
                  {formData.residuaryDistribution.map((dist, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border rounded-lg relative">
                      <div className="md:col-span-5 space-y-2">
                        <Label className="text-[10px] uppercase">Beneficiary Name</Label>
                        <div className="flex gap-2">
                          <Input className="flex-1" value={dist.name} onChange={(e) => {
                            const d = [...formData.residuaryDistribution];
                            d[i].name = e.target.value;
                            setFormData({...formData, residuaryDistribution: d});
                          }} />
                          {formData.children && formData.children.length > 0 && (
                            <Select onValueChange={(val) => {
                              const child = formData.children?.[parseInt(val)];
                              if (!child) return;
                              const d = [...formData.residuaryDistribution];
                              d[i] = { ...d[i], name: child.name, nric: child.nric };
                              setFormData({ ...formData, residuaryDistribution: d });
                            }}>
                              <SelectTrigger className="w-10 px-2" title="Select child"><Users className="h-4 w-4" /></SelectTrigger>
                              <SelectContent>{formData.children.map((c, idx) => (<SelectItem key={idx} value={idx.toString()}>{c.name}</SelectItem>))}</SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <Label className="text-[10px] uppercase">NRIC</Label>
                        <Input value={dist.nric} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].nric = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-[10px] uppercase">Share (%)</Label>
                        <Input value={dist.percentage} placeholder="e.g. 50%" onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].percentage = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Funeral Wishes <LegalNote title="Optional">Funeral wishes are not legally binding in a Will, but they provide critical guidance for your family during a difficult time.</LegalNote></Label>
                  <Textarea value={formData.funeralWishes || ''} onChange={(e) => setFormData({...formData, funeralWishes: e.target.value})} placeholder="e.g. Cremation at Mandai, specific religious rites..." rows={4} />
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-primary mb-2 flex items-center gap-2">Legal Acknowledgement</h4>
                  <p className="text-xs text-[#555555] leading-relaxed">
                    By submitting, I confirm these details are accurate. I understand Forward Legal will use this to draft my Will under Singapore law, which must be signed in the presence of two witnesses.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < totalSteps ? (
                <Button className="bg-primary hover:bg-primary/90 text-white min-w-[140px]" onClick={nextStep}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="bg-primary hover:bg-primary/90 text-white min-w-[200px]" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing Draft...</> : "Submit to Forward Legal"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
