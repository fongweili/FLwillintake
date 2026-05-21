'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateFirstWillDraft, type WillIntakeInput } from '@/ai/flows/generate-first-will-draft';
import { ArrowLeft, ArrowRight, Loader2, Info, Plus, Trash2, Users, CheckCircle2, Gift, Percent, Layers, User, Briefcase } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [appointDifferentTrustees, setAppointDifferentTrustees] = useState(false);
  const [distributionStrategy, setDistributionStrategy] = useState<'percentage' | 'specific' | 'hybrid' | null>(null);
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
    assetSchedule: [],
  });

  const nextStep = () => {
    if (step === 4 && !distributionStrategy) return;
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSmartDate = (value: string, index: number) => {
    const kids = [...(formData.children || [])];
    kids[index].dob = value;
    setFormData({...formData, children: kids});
  };

  const finalizeDate = (index: number) => {
    const kids = [...(formData.children || [])];
    const val = kids[index].dob;
    if (!val) return;

    const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'dd.MM.yyyy', 'yyyy-MM-dd'];
    for (const f of formats) {
      try {
        const parsed = parse(val, f, new Date());
        if (!isNaN(parsed.getTime())) {
          kids[index].dob = format(parsed, 'dd-MM-yyyy');
          setFormData({...formData, children: kids});
          return;
        }
      } catch (e) {}
    }
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

  const familyMembers = [
    ...(formData.spouseName ? [{ name: formData.spouseName, nric: formData.spouseNric || '', relationship: 'Spouse' }] : []),
    ...(formData.children || []).map(c => ({ name: c.name, nric: c.nric, relationship: 'Child' }))
  ];

  const addAssetToSchedule = () => {
    setFormData({
      ...formData,
      assetSchedule: [...(formData.assetSchedule || []), { type: 'Bank Account' }]
    });
  };

  const removeAssetFromSchedule = (index: number) => {
    const assets = [...(formData.assetSchedule || [])];
    assets.splice(index, 1);
    setFormData({ ...formData, assetSchedule: assets });
  };

  const updateAssetInSchedule = (index: number, field: string, value: string) => {
    const assets = [...(formData.assetSchedule || [])];
    // @ts-ignore
    assets[index][field] = value;
    setFormData({ ...formData, assetSchedule: assets });
  };

  const addSpecificGift = () => {
    setFormData({
      ...formData,
      specificBequests: [...(formData.specificBequests || []), { 
        item: { type: 'Personal Items' }, 
        beneficiaryName: '', 
        beneficiaryNric: '' 
      }]
    });
  };

  const updateSpecificGiftItem = (index: number, field: string, value: string) => {
    const gifts = [...(formData.specificBequests || [])];
    // @ts-ignore
    gifts[index].item[field] = value;
    setFormData({ ...formData, specificBequests: gifts });
  };

  const AssetFields = ({ asset, onUpdate }: { asset: any, onUpdate: (field: string, val: string) => void }) => {
    return (
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase">Category</Label>
            <Select value={asset.type} onValueChange={(val) => onUpdate('type', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Account">Bank Account</SelectItem>
                <SelectItem value="Property (HDB)">Property (HDB)</SelectItem>
                <SelectItem value="Property (Private)">Property (Private)</SelectItem>
                <SelectItem value="Insurance Policy">Insurance Policy</SelectItem>
                <SelectItem value="Financial Products">Financial Products</SelectItem>
                <SelectItem value="Vehicle">Vehicle</SelectItem>
                <SelectItem value="Personal Items">Personal Items (e.g. Jewelry)</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {asset.type === 'Bank Account' && (
            <>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase">Bank Name</Label>
                <Input placeholder="e.g. DBS, OCBC" value={asset.bankName || ''} onChange={(e) => onUpdate('bankName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase">Account Number</Label>
                <Input placeholder="e.g. 123-45678-9" value={asset.accountNumber || ''} onChange={(e) => onUpdate('accountNumber', e.target.value)} />
              </div>
            </>
          )}

          {asset.type?.includes('Property') && (
            <>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] uppercase">Property Address</Label>
                <Input placeholder="Full address in Singapore" value={asset.address || ''} onChange={(e) => onUpdate('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase">Ownership Share (%)</Label>
                <Input placeholder="e.g. 50% or 100%" value={asset.ownershipShare || ''} onChange={(e) => onUpdate('ownershipShare', e.target.value)} />
              </div>
            </>
          )}

          {asset.type === 'Vehicle' && (
            <div className="space-y-2">
              <Label className="text-[10px] uppercase">Car Plate Number</Label>
              <Input placeholder="e.g. SBA1234A" value={asset.plateNumber || ''} onChange={(e) => onUpdate('plateNumber', e.target.value)} />
            </div>
          )}

          {(asset.type === 'Others' || asset.type === 'Personal Items' || asset.type === 'Insurance Policy' || asset.type === 'Financial Products') && (
            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] uppercase">Description / Details</Label>
              <Input placeholder="Provide identifying details..." value={asset.description || ''} onChange={(e) => onUpdate('description', e.target.value)} />
            </div>
          )}
        </div>
      </div>
    );
  };

  const SpecificGiftsSection = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <Label className="text-lg">Specific Gifts <LegalNote title="Specific Legacies">
          <p>Gifting specific items (e.g. "My gold watch") to specific people. These are given out BEFORE the remaining estate is split.</p>
        </LegalNote></Label>
        <Button variant="outline" size="sm" onClick={addSpecificGift}>
          <Plus className="h-4 w-4 mr-2" /> Add Gift
        </Button>
      </div>
      {(formData.specificBequests || []).map((gift, i) => (
        <div key={i} className="p-6 border rounded-lg bg-muted/10 space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-white">Gift #{i+1}</Badge>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" onClick={() => {
              const g = [...(formData.specificBequests || [])];
              g.splice(i, 1);
              setFormData({...formData, specificBequests: g});
            }} />
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1">Asset Details</h4>
            <AssetFields asset={gift.item} onUpdate={(f, v) => updateSpecificGiftItem(i, f, v)} />
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1">Beneficiary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase">Name</Label>
                <Input value={gift.beneficiaryName} onChange={(e) => {
                  const g = [...(formData.specificBequests || [])];
                  g[i].beneficiaryName = e.target.value;
                  setFormData({...formData, specificBequests: g});
                }} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase">NRIC</Label>
                <Input value={gift.beneficiaryNric} onChange={(e) => {
                  const g = [...(formData.specificBequests || [])];
                  g[i].beneficiaryNric = e.target.value;
                  setFormData({...formData, specificBequests: g});
                }} />
              </div>
              <div className="flex items-end md:col-span-2">
                {familyMembers.length > 0 && (
                  <Select onValueChange={(val) => {
                    const member = familyMembers[parseInt(val)];
                    if (!member) return;
                    const g = [...(formData.specificBequests || [])];
                    g[i] = { ...g[i], beneficiaryName: member.name, beneficiaryNric: member.nric };
                    setFormData({ ...formData, specificBequests: g });
                  }}>
                    <SelectTrigger className="w-full bg-primary/10 border-primary/20 text-primary font-bold shadow-sm h-11">
                      <Users className="h-4 w-4 mr-2" /> <SelectValue placeholder="Quick Pick from Family Members" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map((m, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>{m.name} ({m.relationship})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {(formData.specificBequests || []).length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground text-sm italic">
          No specific gifts added yet. Click "Add Gift" to start.
        </div>
      )}
    </div>
  );

  const ResiduarySection = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      <div className="flex justify-between items-center">
        <Label className="text-lg">
          {distributionStrategy === 'percentage' ? "All my assets will go to the following beneficiaries" : "The Residue (Remainder)"}
          <LegalNote title={distributionStrategy === 'percentage' ? "Full Distribution" : "Residuary Estate"}>
            <p><strong>Definition:</strong> This refers to everything you own that has not been specifically gifted elsewhere in the Will, after all your debts, funeral expenses, and taxes have been paid.</p>
          </LegalNote>
        </Label>
        <Button variant="outline" size="sm" onClick={() => setFormData({...formData, residuaryDistribution: [...formData.residuaryDistribution, { name: '', nric: '', percentage: '' }]})}>
          <Plus className="h-4 w-4 mr-2" /> Add Beneficiary
        </Button>
      </div>
      {formData.residuaryDistribution.map((dist, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Beneficiary #{i+1}</span>
            {i > 0 && <Button variant="ghost" size="icon" onClick={() => {
              const d = [...formData.residuaryDistribution];
              d.splice(i, 1);
              setFormData({...formData, residuaryDistribution: d});
            }}><Trash2 className="h-4 w-4" /></Button>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase">Name</Label>
              <Input value={dist.name} onChange={(e) => {
                const d = [...formData.residuaryDistribution];
                d[i].name = e.target.value;
                setFormData({...formData, residuaryDistribution: d});
              }} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase">NRIC</Label>
              <Input value={dist.nric} onChange={(e) => {
                const d = [...formData.residuaryDistribution];
                d[i].nric = e.target.value;
                setFormData({...formData, residuaryDistribution: d});
              }} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase">Share (%)</Label>
              <Input value={dist.percentage} placeholder="e.g. 50%" onChange={(e) => {
                const d = [...formData.residuaryDistribution];
                d[i].percentage = e.target.value;
                setFormData({...formData, residuaryDistribution: d});
              }} />
            </div>
            <div className="flex items-end">
              {familyMembers.length > 0 && (
                <Select onValueChange={(val) => {
                  const member = familyMembers[parseInt(val)];
                  if (!member) return;
                  const d = [...formData.residuaryDistribution];
                  d[i] = { ...d[i], name: member.name, nric: member.nric };
                  setFormData({ ...formData, residuaryDistribution: d });
                }}>
                  <SelectTrigger className="w-full bg-primary/10 border-primary/20 text-primary font-bold shadow-sm h-11">
                    <Users className="h-4 w-4 mr-2" /> <SelectValue placeholder="Quick Pick from Family" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((m, idx) => (
                      <SelectItem key={idx} value={idx.toString()}>{m.name} ({m.relationship})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-10">
           <h1 className="text-2xl font-headline font-bold text-[#555555] tracking-tight text-center">
             FORWARD LEGAL WILL INTAKE QUESTIONNAIRE
           </h1>
           <div className="w-full mt-6">
             <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-bold text-primary uppercase">Progress: Step {step} of {totalSteps}</span>
             </div>
             <Progress value={(step / totalSteps) * 100} className="w-full h-1.5" />
           </div>
        </div>

        <Card className="shadow-2xl border-none overflow-hidden bg-white">
          <div className="bg-primary h-2" />
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-headline text-[#555555]">
              {step === 1 && "Welcome and Identification"}
              {step === 2 && "Family and Dependents"}
              {step === 3 && "Appointments"}
              {step === 4 && "Distribution of Assets"}
              {step === 5 && "Final Instructions"}
            </CardTitle>
            <CardDescription className="text-sm">
              {step === 1 && "Let's begin with your personal details for your legal will."}
              {step === 2 && "List your loved ones to ensure they are provided for."}
              {step === 3 && "Choose who will handle your affairs and care for your children."}
              {step === 4 && "Decide how your property and gifts will be handled."}
              {step === 5 && "Review final clauses and funeral wishes."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 space-y-3">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Welcome to Forward Legal
                  </h3>
                  <p className="text-sm text-[#555555] font-medium leading-relaxed">
                    We are pleased to assist you. This questionnaire captures the details our lawyers need to prepare a professional Will.
                  </p>
                  <ul className="text-xs text-[#666666] space-y-1 list-disc pl-4">
                    <li>Your data is encrypted and kept strictly confidential.</li>
                    <li>The information provided will be forwarded to our lawyers who will prepare a draft for your review.</li>
                    <li>We will contact you to finalize the document and arrange for legal signing.</li>
                  </ul>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Full Name (as per NRIC/Passport) <LegalNote title="Testator">The person who makes the Will. Ensure the name matches your NRIC exactly to avoid probate delays later.</LegalNote></Label>
                    <Input value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} placeholder="Enter your full legal name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>NRIC / Passport No.</Label>
                      <Input value={formData.nric} onChange={(e) => setFormData({...formData, nric: e.target.value})} placeholder="e.g. S1234567A" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Residential Address</Label>
                    <Textarea value={formData.clientAddress} onChange={(e) => setFormData({...formData, clientAddress: e.target.value})} placeholder="Full residential address" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Marital Status</Label>
                  <RadioGroup value={formData.maritalStatus} onValueChange={(val) => setFormData({...formData, maritalStatus: val as any})} className="flex flex-wrap gap-4">
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
                      <div className="space-y-1">
                        <Input placeholder="DOB (e.g. 12 Jan 1990)" value={child.dob} onChange={(e) => handleSmartDate(e.target.value, i)} onBlur={() => finalizeDate(i)} />
                        <p className="text-[10px] text-muted-foreground px-1">Smart format: DD-MM-YYYY</p>
                      </div>
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
                      <p><strong>Tips:</strong> Choose someone you trust implicitly, who is likely to survive you. Most people choose their spouse or adult children.</p>
                    </LegalNote></Label>
                    <Button variant="outline" size="sm" onClick={() => setFormData({...formData, executors: [...formData.executors, { name: '', nric: '', relationship: '', isSubstitute: false }]})}>
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
                      <p><strong>Executor:</strong> Handles administrative tasks (debts, legal paperwork).</p>
                      <p><strong>Trustee:</strong> Manages assets for long-term (e.g., holding money for children until they reach 21).</p>
                      <p><strong>Tip:</strong> Usually, the executor and trustee are the <strong>same person</strong>.</p>
                    </LegalNote></Label>
                    <div className="flex items-center space-x-2">
                      <Switch checked={appointDifferentTrustees} onCheckedChange={setAppointDifferentTrustees} />
                      <span className="text-xs font-medium">Appoint different trustees?</span>
                    </div>
                  </div>
                  {!appointDifferentTrustees && <p className="text-xs text-[#666666] italic bg-secondary/50 p-3 rounded">Executors listed above will also act as your trustees.</p>}
                </div>

                {(formData.children || []).length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-lg">Guardian <LegalNote title="Legal Guardian">
                      <p>The person responsible for raising minor children if both parents pass away before they reach 21.</p>
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
              <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 mb-6">
                  <h3 className="font-bold text-primary mb-2">How would you like to distribute your assets?</h3>
                  <p className="text-xs text-[#555555] leading-relaxed mb-4">Choose the strategy that best fits your needs.</p>
                  <RadioGroup value={distributionStrategy || ''} onValueChange={(val) => setDistributionStrategy(val as any)} className="grid grid-cols-1 gap-4">
                    <Label htmlFor="perc" className={`flex flex-col md:flex-row items-center gap-6 p-6 border rounded-xl cursor-pointer transition-all ${distributionStrategy === 'percentage' ? 'border-primary bg-white shadow-md ring-2 ring-primary/20' : 'bg-muted/20 hover:bg-white'}`}>
                      <RadioGroupItem value="percentage" id="perc" className="sr-only" />
                      <Percent className={`h-8 w-8 ${distributionStrategy === 'percentage' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <span className="font-bold block mb-1">Simple Percentage Split</span>
                        <span className="text-xs text-muted-foreground leading-snug block">Best for those who want a simple distribution without listing every single item. Everything is split by percentages.</span>
                      </div>
                    </Label>
                    <Label htmlFor="spec" className={`flex flex-col md:flex-row items-center gap-6 p-6 border rounded-xl cursor-pointer transition-all ${distributionStrategy === 'specific' ? 'border-primary bg-white shadow-md ring-2 ring-primary/20' : 'bg-muted/20 hover:bg-white'}`}>
                      <RadioGroupItem value="specific" id="spec" className="sr-only" />
                      <Gift className={`h-8 w-8 ${distributionStrategy === 'specific' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <span className="font-bold block mb-1">Specific Gifts Only</span>
                        <span className="text-xs text-muted-foreground leading-snug block">Best for ensuring specific items (heirlooms, etc.) go to certain people. *Requires manual tracking of all items.</span>
                      </div>
                    </Label>
                    <Label htmlFor="hyb" className={`flex flex-col md:flex-row items-center gap-6 p-6 border rounded-xl cursor-pointer transition-all ${distributionStrategy === 'hybrid' ? 'border-primary bg-white shadow-md ring-2 ring-primary/20' : 'bg-muted/20 hover:bg-white'}`}>
                      <RadioGroupItem value="hybrid" id="hyb" className="sr-only" />
                      <Layers className={`h-8 w-8 ${distributionStrategy === 'hybrid' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <span className="font-bold block mb-1">Hybrid Approach</span>
                        <span className="text-xs text-muted-foreground leading-snug block">Best of both worlds: Make some specific gifts, while the rest of your assets are divided by percentage.</span>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {(distributionStrategy === 'specific' || distributionStrategy === 'hybrid') && (
                  <SpecificGiftsSection />
                )}

                {(distributionStrategy === 'percentage' || distributionStrategy === 'hybrid') && (
                  <ResiduarySection />
                )}

                {(distributionStrategy === 'percentage' || distributionStrategy === 'hybrid') && (
                  <div className="space-y-6 pt-8 border-t">
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-primary flex items-center gap-2">
                          <Briefcase className="h-5 w-5" /> Schedule of Assets (Recommended)
                        </h3>
                        <Button variant="outline" size="sm" onClick={addAssetToSchedule} className="bg-white">
                          <Plus className="h-4 w-4 mr-2" /> Add Asset
                        </Button>
                      </div>
                      <p className="text-xs text-[#555555] leading-relaxed mb-6 italic"> You may include a Schedule of Assets in the will to help your executor identify your holdings. This list can be updated in the future by updating the Will.</p>

                      <div className="space-y-6">
                        {(formData.assetSchedule || []).map((asset, i) => (
                          <div key={i} className="bg-white p-6 rounded-lg border shadow-sm relative group">
                            <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeAssetFromSchedule(i)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <AssetFields asset={asset} onUpdate={(f, v) => updateAssetInSchedule(i, f, v)} />
                          </div>
                        ))}
                        {(formData.assetSchedule || []).length === 0 && <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground text-xs italic">No assets listed yet.</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Funeral Wishes <LegalNote title="Optional">Guides your family during a difficult time.</LegalNote></Label>
                  <Textarea value={formData.funeralWishes || ''} onChange={(e) => setFormData({...formData, funeralWishes: e.target.value})} placeholder="e.g. Cremation at Mandai..." rows={4} />
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-primary mb-2">Legal Acknowledgement</h4>
                  <p className="text-xs text-[#555555] leading-relaxed">By submitting, I confirm these details are accurate. I understand Forward Legal lawyers will use this to prepare my Will.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < totalSteps ? (
                <Button className="bg-primary hover:bg-primary/90 text-white min-w-[140px]" onClick={nextStep}>Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button className="bg-primary hover:bg-primary/90 text-white min-w-[200px]" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Forwarding to Lawyers...</> : "Submit to Forward Legal"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
