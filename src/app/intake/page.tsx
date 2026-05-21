
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateFirstWillDraft, type WillIntakeInput } from '@/ai/flows/generate-first-will-draft';
import { Scale, ArrowLeft, ArrowRight, Loader2, Info, Plus, Trash2 } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const addExecutor = () => {
    setFormData({
      ...formData,
      executors: [...formData.executors, { name: '', nric: '', relationship: '', isSubstitute: true }]
    });
  };

  const removeExecutor = (index: number) => {
    const newExecs = [...formData.executors];
    newExecs.splice(index, 1);
    setFormData({ ...formData, executors: newExecs });
  };

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
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center ml-1 text-accent hover:text-accent/80">
            <Info className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-primary text-white p-3">
          <p className="font-bold mb-1">{title}</p>
          <div className="text-xs leading-relaxed">{children}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-xl font-headline text-primary leading-none">FORWARD LEGAL</h2>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Will Intake Portal</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-primary">Step {step} of {totalSteps}</span>
            <Progress value={(step / totalSteps) * 100} className="w-32 h-2 mt-1" />
          </div>
        </div>

        <Card className="shadow-2xl border-none overflow-hidden">
          <div className="bg-primary h-2" />
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-headline">
              {step === 1 && "The Testator"}
              {step === 2 && "Family & Dependents"}
              {step === 3 && "Appointments"}
              {step === 4 && "Bequests & Residue"}
              {step === 5 && "Final Instructions"}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 1 && "Standard personal details required for Singapore identification."}
              {step === 2 && "Listing your spouse and children to ensure they are provided for."}
              {step === 3 && "Appointing people to manage your estate and care for children."}
              {step === 4 && "Deciding how your money, property, and assets are distributed."}
              {step === 5 && "Any additional wishes for funeral or specific legacies."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Full Name (as per NRIC/Passport) <LegalNote title="Testator">The Testator is the person making the Will.</LegalNote></Label>
                  <Input 
                    value={formData.clientName} 
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})} 
                    placeholder="Enter your full legal name" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Enter your full address" 
                  />
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
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label>Spouse Name</Label>
                      <Input 
                        value={formData.spouseName || ''} 
                        onChange={(e) => setFormData({...formData, spouseName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Spouse NRIC</Label>
                      <Input 
                        value={formData.spouseNric || ''} 
                        onChange={(e) => setFormData({...formData, spouseNric: e.target.value})} 
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Children <LegalNote title="Guardianship">If your children are under 21, you must appoint a Guardian in the next step.</LegalNote></Label>
                  <Button variant="outline" size="sm" onClick={() => setFormData({...formData, children: [...(formData.children || []), { name: '', nric: '', dob: '' }]})}>
                    <Plus className="h-4 w-4 mr-2" /> Add Child
                  </Button>
                  {(formData.children || []).map((child, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg relative">
                      <Input placeholder="Name" value={child.name} onChange={(e) => {
                        const kids = [...(formData.children || [])];
                        kids[i].name = e.target.value;
                        setFormData({...formData, children: kids});
                      }} />
                      <Input placeholder="NRIC" value={child.nric} onChange={(e) => {
                        const kids = [...(formData.children || [])];
                        kids[i].nric = e.target.value;
                        setFormData({...formData, children: kids});
                      }} />
                      <Input placeholder="DOB (YYYY-MM-DD)" value={child.dob} onChange={(e) => {
                        const kids = [...(formData.children || [])];
                        kids[i].dob = e.target.value;
                        setFormData({...formData, children: kids});
                      }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Executors & Trustees <LegalNote title="Executor/Trustee">An Executor carries out your instructions. A Trustee manages assets held for beneficiaries (e.g. for children under 21).</LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={addExecutor}>
                      <Plus className="h-4 w-4 mr-2" /> Add Substitute
                    </Button>
                  </div>
                  {formData.executors.map((exec, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-4 relative group">
                      <div className="flex justify-between">
                        <Badge variant={exec.isSubstitute ? "outline" : "default"}>{exec.isSubstitute ? "Substitute" : "Primary"}</Badge>
                        {exec.isSubstitute && <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => removeExecutor(i)} />}
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
                  <Label className="text-lg">Guardian <LegalNote title="Legal Guardian">The person responsible for your children's upbringing if they are under 21 at the time of your passing.</LegalNote></Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Guardian Name" value={formData.guardianName || ''} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
                    <Input placeholder="Guardian NRIC" value={formData.guardianNric || ''} onChange={(e) => setFormData({...formData, guardianNric: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg">Residuary Estate <LegalNote title="Residue">Everything remaining after debts, taxes, and specific gifts are paid. Most people leave 100% to their spouse or children.</LegalNote></Label>
                  {formData.residuaryDistribution.map((dist, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 items-end">
                      <div className="col-span-1">
                        <Label className="text-[10px] mb-1 block">Beneficiary Name</Label>
                        <Input value={dist.name} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].name = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-[10px] mb-1 block">NRIC</Label>
                        <Input value={dist.nric} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].nric = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-[10px] mb-1 block">Share (%)</Label>
                        <Input value={dist.percentage} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].percentage = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => setFormData({...formData, residuaryDistribution: [...formData.residuaryDistribution, { name: '', nric: '', percentage: '' }]})}>
                    <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-lg">Specific Bequests <LegalNote title="Bequests">Gifts of specific items (e.g. 'my Rolex watch' or 'my property at 123 Orchard Rd').</LegalNote></Label>
                  {(formData.specificBequests || []).map((b, i) => (
                    <div key={i} className="p-4 bg-muted/20 rounded-lg space-y-3">
                      <Input placeholder="Description of Gift" value={b.item} onChange={(e) => {
                        const bq = [...(formData.specificBequests || [])];
                        bq[i].item = e.target.value;
                        setFormData({...formData, specificBequests: bq});
                      }} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="To Beneficiary" value={b.beneficiaryName} onChange={(e) => {
                          const bq = [...(formData.specificBequests || [])];
                          bq[i].beneficiaryName = e.target.value;
                          setFormData({...formData, specificBequests: bq});
                        }} />
                        <Input placeholder="Beneficiary NRIC" value={b.beneficiaryNric} onChange={(e) => {
                          const bq = [...(formData.specificBequests || [])];
                          bq[i].beneficiaryNric = e.target.value;
                          setFormData({...formData, specificBequests: bq});
                        }} />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setFormData({...formData, specificBequests: [...(formData.specificBequests || []), { item: '', beneficiaryName: '', beneficiaryNric: '' }]})}>
                    <Plus className="h-4 w-4 mr-2" /> Add Specific Gift
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Funeral Wishes <LegalNote title="Optional">These instructions are generally not legally binding but serve as a guide for your family.</LegalNote></Label>
                  <Textarea 
                    value={formData.funeralWishes || ''} 
                    onChange={(e) => setFormData({...formData, funeralWishes: e.target.value})} 
                    placeholder="e.g. Burial at CCK, Cremation at Mandai, specific religious rites..." 
                    rows={4}
                  />
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-primary mb-2">Acknowledgement</h4>
                  <p className="text-xs text-primary/80 leading-relaxed">
                    By submitting this questionnaire, I confirm that the information provided is accurate. 
                    I understand that this digital intake will be used by **Forward Legal** to generate a first draft of my Last Will and Testament, 
                    which will then be reviewed and finalized by a qualified solicitor.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1 || loading}
                className="hover:bg-primary/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < totalSteps ? (
                <Button 
                  className="bg-primary text-white min-w-[140px]" 
                  onClick={nextStep}
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  className="bg-accent hover:bg-accent/90 text-white min-w-[200px]" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting Case...</>
                  ) : (
                    "Submit to Solicitor"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
