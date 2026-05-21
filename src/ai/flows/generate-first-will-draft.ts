'use server';
/**
 * @fileOverview A professional lawyer engine for generating a first draft of a legal Will.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssetDetailSchema = z.object({
  type: z.string(),
  // Structured details for better legal drafting
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  address: z.string().optional(),
  ownershipShare: z.string().optional(),
  plateNumber: z.string().optional(),
  description: z.string().optional(), // For "Others" or general details
});

const WillIntakeInputSchema = z.object({
  clientName: z.string().describe('The full legal name of the testator.'),
  nric: z.string().describe('The NRIC or Passport number of the testator.'),
  clientAddress: z.string().describe('The full residential address of the testator.'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).describe('The current marital status.'),
  spouseName: z.string().optional(),
  spouseNric: z.string().optional(),
  children: z.array(
    z.object({
      name: z.string(),
      nric: z.string(),
      dob: z.string(),
    })
  ).optional(),
  executors: z.array(
    z.object({
      name: z.string(),
      nric: z.string(),
      relationship: z.string(),
      isSubstitute: z.boolean().default(false),
    })
  ).describe('List of primary and substitute executors.'),
  guardianName: z.string().optional().describe('Guardian for minor children.'),
  guardianNric: z.string().optional(),
  specificBequests: z.array(
    z.object({
      item: AssetDetailSchema.describe('Description of the specific asset/gift.'),
      beneficiaryName: z.string(),
      beneficiaryNric: z.string(),
    })
  ).optional(),
  residuaryDistribution: z.array(
    z.object({
      name: z.string(),
      nric: z.string(),
      percentage: z.string().describe('Percentage share of the residue (e.g. "50%").'),
    })
  ).describe('How the remaining estate is distributed.'),
  assetSchedule: z.array(AssetDetailSchema).optional().describe('A non-mandatory list of assets for the executor.'),
  funeralWishes: z.string().optional(),
});

export type WillIntakeInput = z.infer<typeof WillIntakeInputSchema>;

const WillDraftOutputSchema = z.string();
export type WillDraftOutput = z.infer<typeof WillDraftOutputSchema>;

export async function generateFirstWillDraft(input: WillIntakeInput): Promise<WillDraftOutput> {
  return willDraftFlow(input);
}

const willDraftPrompt = ai.definePrompt({
  name: 'willDraftPrompt',
  input: { schema: WillIntakeInputSchema },
  output: { schema: WillDraftOutputSchema },
  prompt: `You are an expert lawyer at FORWARD LEGAL. 
Draft a professional "Last Will and Testament" suitable for the Singapore context.

Use the following data:
Testator: {{{clientName}}} (NRIC: {{{nric}}})
Address: {{{clientAddress}}}
Marital: {{{maritalStatus}}} {{#if spouseName}}(Spouse: {{{spouseName}}}){{/if}}

{{#if children}}
Children:
{{#each children}}
- {{{this.name}}} ({{{this.nric}}})
{{/each}}
{{/if}}

Executors:
{{#each executors}}
- {{#if this.isSubstitute}}Substitute: {{else}}Primary: {{/if}}{{{this.name}}} ({{{this.nric}}})
{{/each}}

{{#if guardianName}}
Guardian: {{{guardianName}}} (NRIC: {{{guardianNric}}})
{{/if}}

Specific Gifts:
{{#each specificBequests}}
- Gift: {{#if this.item.address}}Property at {{{this.item.address}}} (Share: {{{this.item.ownershipShare}}}){{else if this.item.bankName}}Bank Account at {{{this.item.bankName}}} (A/C: {{{this.item.accountNumber}}}){{else if this.item.plateNumber}}Vehicle {{{this.item.plateNumber}}}{{else}}{{{this.item.description}}}{{/if}} to {{{this.beneficiaryName}}} ({{{this.beneficiaryNric}}})
{{/each}}

Residue (everything else):
{{#each residuaryDistribution}}
- {{{this.name}}} ({{{this.nric}}}): {{{this.percentage}}}
{{/each}}

{{#if assetSchedule}}
Schedule of Assets (For reference of the Executor):
{{#each assetSchedule}}
- {{{this.type}}}: {{#if this.address}}{{{this.address}}} (Share: {{{this.ownershipShare}}}){{else if this.bankName}}{{{this.bankName}}} (A/C: {{{this.accountNumber}}}){{else if this.plateNumber}}Vehicle {{{this.plateNumber}}}{{else}}{{{this.description}}}{{/if}}
{{/each}}
{{/if}}

STRUCTURE:
1. Preamble & Revocation of previous wills.
2. Appointment of Executors and Trustees.
3. Appointment of Guardians (if applicable).
4. Specific Legacies (incorporate the specific gifts listed).
5. Distribution of Residuary Estate (incorporate the percentage splits).
6. Funeral Wishes (if applicable).
7. Execution Clause (Witness signatures).

Provide a polished, legally robust draft for review by the Forward Legal team. Ensure clarity on the roles of Executors and Trustees.`,
});

const willDraftFlow = ai.defineFlow(
  {
    name: 'willDraftFlow',
    inputSchema: WillIntakeInputSchema,
    outputSchema: WillDraftOutputSchema,
  },
  async (input) => {
    const { output } = await willDraftPrompt(input);
    return output!;
  }
);
