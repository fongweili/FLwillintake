'use server';
/**
 * @fileOverview A Genkit flow for generating a first draft of a legal Will based on client intake data.
 *
 * - generateFirstWillDraft - A function that handles the generation of the first Will draft.
 * - WillIntakeInput - The input type for the generateFirstWillDraft function.
 * - WillDraftOutput - The return type for the generateFirstWillDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WillIntakeInputSchema = z.object({
  clientName: z.string().describe('The full legal name of the client.'),
  clientAddress: z.string().describe('The full residential address of the client.'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).describe('The current marital status of the client.'),
  spouseName: z.string().optional().describe('The full legal name of the client\u0027s spouse, if married.'),
  children: z.array(
    z.object({
      name: z.string().describe('The full legal name of the child.'),
      dob: z.string().describe('The date of birth of the child in YYYY-MM-DD format.'),
    })
  ).optional().describe('A list of the client\u0027s children, including their names and dates of birth.'),
  executorName: z.string().describe('The full legal name of the primary executor.'),
  executorRelationship: z.string().describe('The relationship of the primary executor to the client (e.g., "Brother", "Friend", "Spouse").'),
  beneficiaries: z.array(
    z.object({
      name: z.string().describe('The full legal name of the beneficiary.'),
      relationship: z.string().describe('The relationship of the beneficiary to the client.'),
      share: z.string().describe('A description of the share or specific item to be bequeathed to this beneficiary (e.g., "50% of residue", "my car", "$10,000").'),
    })
  ).describe('A list of beneficiaries and their respective inheritances.'),
  assets: z.array(
    z.object({
      description: z.string().describe('A brief description of the asset (e.g., "House at 123 Main St", "Savings account at Bank A", "Jewelry collection").'),
      disposition: z.string().describe('How the asset should be disposed of (e.g., "to my spouse", "divided equally among children", "to my friend John Doe").'),
    })
  ).optional().describe('A list of significant assets and instructions for their disposition.'),
  additionalProvisions: z.string().optional().describe('Any additional specific instructions or provisions the client wishes to include in the Will.'),
});

export type WillIntakeInput = z.infer<typeof WillIntakeInputSchema>;

const WillDraftOutputSchema = z.string().describe('The generated legal Will draft as a string.');

export type WillDraftOutput = z.infer<typeof WillDraftOutputSchema>;

export async function generateFirstWillDraft(input: WillIntakeInput): Promise<WillDraftOutput> {
  return willDraftFlow(input);
}

const willDraftPrompt = ai.definePrompt({
  name: 'willDraftPrompt',
  input: { schema: WillIntakeInputSchema },
  output: { schema: WillDraftOutputSchema },
  prompt: `You are an expert legal assistant specializing in drafting Last Will and Testaments.
Your task is to create a structured first draft of a legal Will based on the provided client intake data.

Use formal, precise legal language. Include standard clauses for identification, declaration, revocation of prior wills, appointment of executor, distribution of assets, and any specific bequests.

Client Information:
Name: {{{clientName}}}
Address: {{{clientAddress}}}
Marital Status: {{{maritalStatus}}}
{{#if spouseName}}
Spouse: {{{spouseName}}}
{{/if}}

{{#if children}}
Children:
{{#each children}}
- Name: {{{this.name}}}, DOB: {{{this.dob}}}
{{/each}}
{{/if}}

Executor:
Name: {{{executorName}}}
Relationship: {{{executorRelationship}}}

Beneficiaries and Bequests:
{{#each beneficiaries}}
- Name: {{{this.name}}}, Relationship: {{{this.relationship}}}, Bequest: {{{this.share}}}
{{/each}}

{{#if assets}}
Specific Assets and Dispositions:
{{#each assets}}
- Asset: {{{this.description}}}, Disposition: {{{this.disposition}}}
{{/each}}
{{/if}}

{{#if additionalProvisions}}
Additional Provisions:
{{{additionalProvisions}}}
{{/if}}

Draft the Last Will and Testament incorporating all the above details. Ensure it is a complete, coherent, and legally sound first draft.

LAST WILL AND TESTAMENT

I, {{{clientName}}}, residing at {{{clientAddress}}}, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking any and all former Wills and Codicils made by me.

ARTICLE I: DECLARATION
I declare that I am {{{maritalStatus}}}.{{#if spouseName}} My spouse's name is {{{spouseName}}}.{{/if}}
{{#if children}}
I have the following children:
{{#each children}}
- {{{this.name}}}, born on {{{this.dob}}}
{{/each}}
{{/if}}

ARTICLE II: APPOINTMENT OF EXECUTOR
I hereby nominate, constitute, and appoint {{{executorName}}}, whose relationship to me is {{{executorRelationship}}}, to serve as the Executor of this my Last Will and Testament. If {{{executorName}}} is unable or unwilling to serve, I appoint [Alternate Executor Name] as Successor Executor.

ARTICLE III: PAYMENT OF DEBTS AND EXPENSES
I direct my Executor to pay all my just debts, funeral expenses, and expenses of administration of my estate as soon after my death as practicable.

ARTICLE IV: SPECIFIC BEQUESTS
{{#each beneficiaries}}
I give, devise, and bequeath to {{{this.name}}}, whose relationship to me is {{{this.relationship}}}, the following: {{{this.share}}}.
{{/each}}

{{#if assets}}
{{#each assets}}
I give, devise, and bequeath {{{this.description}}} to {{{this.disposition}}}.
{{/each}}
{{/if}}

ARTICLE V: RESIDUARY ESTATE
I give, devise, and bequeath all the rest, residue, and remainder of my estate, both real and personal, of whatever kind and wherever located, to [Residuary Beneficiary/Beneficiaries and their respective shares].

{{#if additionalProvisions}}
ARTICLE VI: ADDITIONAL PROVISIONS
{{{additionalProvisions}}}
{{/if}}

IN WITNESS WHEREOF, I have hereunto set my hand and seal this [Day] day of [Month], [Year].

_____________________________
{{{clientName}}}


`,
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
