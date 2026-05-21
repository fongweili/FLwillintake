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
import { generateFirstWillDraft, type WillIntakeInput } from '@/ai/flows/generate-first-will-draft';
import { Scale, ArrowLeft, ArrowRight, Loader2, Info, Plus, Trash2, CalendarIcon, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const selectChildAsBeneficiary = (index: number, childIndex: number) => {
    const child = formData.children?.[childIndex];
    if (!child) return;
    
    const d = [...formData.residuaryDistribution];
    d[index] = { ...d[index], name: child.name, nric: child.nric };
    setFormData({ ...formData, residuaryDistribution: d });
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
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex items-center ml-1 text-accent hover:text-accent/80 transition-colors">
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-primary text-white p-4 shadow-xl border-none">
          <p className="font-bold mb-1 text-sm border-b border-white/20 pb-1">{title}</p>
          <div className="text-xs leading-relaxed opacity-90">{children}</div>
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
              <h2 className="text-xl font-headline text-primary leading-none uppercase">FORWARD LEGAL</h2>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Will Intake Portal</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-primary">Step {step} of {totalSteps}</span>
            <Progress value={(step / totalSteps) * 100} className="w-32 h-2 mt-1" />
          </div>
        </div>

        <Card className="shadow-2xl border-none overflow-hidden bg-white">
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
                  <Label>Full Name (as per NRIC/Passport) <LegalNote title="Testator">The person who makes the Will. They must be over 21 and of sound mind.</LegalNote></Label>
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
                    placeholder="Enter your full Singapore address" 
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
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Children <LegalNote title="Guardianship">If your children are under 21, you must appoint a Guardian in the next step to care for them.</LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, children: [...(formData.children || []), { name: '', nric: '', dob: '' }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Child
                    </Button>
                  </div>
                  {(formData.children || []).map((child, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg relative">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase">Name</Label>
                        <Input placeholder="Full Name" value={child.name} onChange={(e) => {
                          const kids = [...(formData.children || [])];
                          kids[i].name = e.target.value;
                          setFormData({...formData, children: kids});
                        }} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase">NRIC</Label>
                        <Input placeholder="NRIC" value={child.nric} onChange={(e) => {
                          const kids = [...(formData.children || [])];
                          kids[i].nric = e.target.value;
                          setFormData({...formData, children: kids});
                        }} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground uppercase">Date of Birth</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-white",
                                !child.dob && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {child.dob ? format(new Date(child.dob), "PPP") : <span>Select date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={child.dob ? new Date(child.dob) : undefined}
                              onSelect={(date) => {
                                const kids = [...(formData.children || [])];
                                kids[i].dob = date ? date.toISOString() : '';
                                setFormData({...formData, children: kids});
                              }}
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white shadow-sm border text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          const kids = [...(formData.children || [])];
                          kids.splice(i, 1);
                          setFormData({...formData, children: kids});
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Executors & Trustees <LegalNote title="Executor/Trustee">Executors handle the administration of your estate. Trustees manage assets held for beneficiaries over time.</LegalNote></Label>
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
                  <div className="flex justify-between items-center">
                    <Label className="text-lg">Residuary Estate <LegalNote title="Residue">The "rest" of your estate after paying debts and specific gifts. This is usually the main part of your Will.</LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, residuaryDistribution: [...formData.residuaryDistribution, { name: '', nric: '', percentage: '' }]})}>
                      <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
                    </Button>
                  </div>
                  {formData.residuaryDistribution.map((dist, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border rounded-lg relative">
                      <div className="md:col-span-5 space-y-2">
                        <Label className="text-[10px] uppercase block">Beneficiary Name</Label>
                        <div className="flex gap-2">
                          <Input className="flex-1" value={dist.name} onChange={(e) => {
                            const d = [...formData.residuaryDistribution];
                            d[i].name = e.target.value;
                            setFormData({...formData, residuaryDistribution: d});
                          }} />
                          {formData.children && formData.children.length > 0 && (
                            <Select onValueChange={(val) => selectChildAsBeneficiary(i, parseInt(val))}>
                              <SelectTrigger className="w-10 px-2" title="Select from children">
                                <Users className="h-4 w-4" />
                              </SelectTrigger>
                              <SelectContent>
                                {formData.children.map((c, idx) => (
                                  <SelectItem key={idx} value={idx.toString()}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <Label className="text-[10px] uppercase block">NRIC</Label>
                        <Input value={dist.nric} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].nric = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-[10px] uppercase block">Share (%)</Label>
                        <Input value={dist.percentage} onChange={(e) => {
                          const d = [...formData.residuaryDistribution];
                          d[i].percentage = e.target.value;
                          setFormData({...formData, residuaryDistribution: d});
                        }} />
                      </div>
                      {i > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -right-2 -top-2 h-6 w-6 bg-white border rounded-full hover:text-destructive"
                          onClick={() => {
                            const d = [...formData.residuaryDistribution];
                            d.splice(i, 1);
                            setFormData({...formData, residuaryDistribution: d});
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-lg">Specific Bequests <LegalNote title="Specific Legacy">A gift of a specific item, such as a named property, piece of jewelry, or a specific sum of money.</LegalNote></Label>
                  {(formData.specificBequests || []).map((b, i) => (
                    <div key={i} className="p-4 bg-muted/20 rounded-lg space-y-3 relative">
                      <Input placeholder="Description (e.g. My HDB Flat, Rolex Watch)" value={b.item} onChange={(e) => {
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
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => {
                         const bq = [...(formData.specificBequests || [])];
                         bq.splice(i, 1);
                         setFormData({...formData, specificBequests: bq});
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                  <Label>Funeral Wishes <LegalNote title="Optional Instructions">Wishes about burial, cremation, or rites. While usually not binding, they provide peace of mind to your family.</LegalNote></Label>
                  <Textarea 
                    value={formData.funeralWishes || ''} 
                    onChange={(e) => setFormData({...formData, funeralWishes: e.target.value})} 
                    placeholder="e.g. Cremation at Mandai, specific religious rites at CCK..." 
                    rows={4}
                  />
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4" /> Legal Acknowledgement
                  </h4>
                  <p className="text-xs text-primary/80 leading-relaxed">
                    By submitting this digital questionnaire, I confirm that the details provided are accurate. 
                    I understand this information will be used by **FORWARD LEGAL** to draft my Last Will and Testament 
                    under the Singapore Wills Act, which will be vetted by a solicitor.
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
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting Will...</>
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
