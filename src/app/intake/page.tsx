
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
import { generateFirstWillDraft, type WillIntakeInput } from '@/ai/flows/generate-first-will-draft';
import { Scale, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<WillIntakeInput>({
    clientName: '',
    clientAddress: '',
    maritalStatus: 'Single',
    executorName: '',
    executorRelationship: '',
    beneficiaries: [{ name: '', relationship: '', share: '' }],
    assets: [],
    additionalProvisions: '',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // In a real app, we'd save the input to a DB first
      const draft = await generateFirstWillDraft(formData);
      // Simulate saving and redirecting to the lawyer review with data
      localStorage.setItem('last_draft_data', JSON.stringify({ input: formData, draft }));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="document-column">
        <div className="flex items-center justify-center mb-8 gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-headline text-primary">Intake Portal</span>
        </div>

        <Progress value={(step / totalSteps) * 100} className="mb-8" />

        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle className="font-headline">
              {step === 1 && "Personal Information"}
              {step === 2 && "Marital & Family Status"}
              {step === 3 && "Executor & Beneficiaries"}
              {step === 4 && "Assets & Provisions"}
            </CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Legal Name</Label>
                  <Input 
                    id="name" 
                    value={formData.clientName} 
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})} 
                    placeholder="John Quinton Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea 
                    id="address" 
                    value={formData.clientAddress} 
                    onChange={(e) => setFormData({...formData, clientAddress: e.target.value})} 
                    placeholder="123 Legal Ave, Juristown, JT 10101" 
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Label>Current Marital Status</Label>
                <RadioGroup 
                  value={formData.maritalStatus} 
                  onValueChange={(val) => setFormData({...formData, maritalStatus: val as any})}
                >
                  {['Single', 'Married', 'Divorced', 'Widowed'].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status} id={status} />
                      <Label htmlFor={status}>{status}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {formData.maritalStatus === 'Married' && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="spouse">Spouse's Full Name</Label>
                    <Input 
                      id="spouse" 
                      value={formData.spouseName || ''} 
                      onChange={(e) => setFormData({...formData, spouseName: e.target.value})} 
                      placeholder="Jane Doe" 
                    />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="executor">Primary Executor Name</Label>
                  <Input 
                    id="executor" 
                    value={formData.executorName} 
                    onChange={(e) => setFormData({...formData, executorName: e.target.value})} 
                    placeholder="Legal Representative Name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rel">Relationship to You</Label>
                  <Input 
                    id="rel" 
                    value={formData.executorRelationship} 
                    onChange={(e) => setFormData({...formData, executorRelationship: e.target.value})} 
                    placeholder="e.g. Spouse, Sibling, Friend" 
                  />
                </div>
                <div className="pt-4 space-y-2">
                  <Label>Primary Beneficiary</Label>
                  <Input 
                    placeholder="Name" 
                    value={formData.beneficiaries[0].name}
                    onChange={(e) => {
                      const b = [...formData.beneficiaries];
                      b[0].name = e.target.value;
                      setFormData({...formData, beneficiaries: b});
                    }}
                  />
                  <Input 
                    placeholder="Share (e.g. 100% of Estate)" 
                    value={formData.beneficiaries[0].share}
                    onChange={(e) => {
                      const b = [...formData.beneficiaries];
                      b[0].share = e.target.value;
                      setFormData({...formData, beneficiaries: b});
                    }}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provisions">Additional Instructions</Label>
                  <Textarea 
                    id="provisions" 
                    value={formData.additionalProvisions} 
                    onChange={(e) => setFormData({...formData, additionalProvisions: e.target.value})} 
                    placeholder="Burial wishes, specific gifts to charity, etc." 
                    rows={6}
                  />
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm text-primary">
                    Review your information carefully. Our AI Draft Collator will generate a professional draft for your attorney to review immediately upon submission.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={step === 1 || loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < totalSteps ? (
                <Button 
                  className="bg-primary text-white" 
                  onClick={nextStep}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  className="bg-accent hover:bg-accent/90 text-white" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Collating Draft...</>
                  ) : (
                    "Submit for Review"
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
