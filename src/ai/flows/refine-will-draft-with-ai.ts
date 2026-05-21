'use server';
/**
 * @fileOverview An AI agent for refining legal Will drafts based on lawyer amendments.
 *
 * - refineWillDraftWithAI - A function that refines an AI-generated Will draft with lawyer's amendments.
 * - RefineWillDraftWithAIInput - The input type for the refineWillDraftWithAI function.
 * - RefineWillDraftWithAIOutput - The return type for the refineWillDraftWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineWillDraftWithAIInputSchema = z.object({
  originalDraft: z.string().describe('The original AI-generated Will draft that needs refinement.'),
  amendments: z.string().describe('Specific instructions from the lawyer detailing the changes to be made to the draft.'),
});
export type RefineWillDraftWithAIInput = z.infer<typeof RefineWillDraftWithAIInputSchema>;

const RefineWillDraftWithAIOutputSchema = z.object({
  refinedDraft: z.string().describe('The updated Will draft after precisely applying the lawyer\'s amendments.'),
});
export type RefineWillDraftWithAIOutput = z.infer<typeof RefineWillDraftWithAIOutputSchema>;

const refineWillDraftWithAIPrompt = ai.definePrompt({
  name: 'refineWillDraftWithAIPrompt',
  input: {schema: RefineWillDraftWithAIInputSchema},
  output: {schema: RefineWillDraftWithAIOutputSchema},
  prompt: `You are an expert legal document editor. Your task is to precisely apply the provided amendments to the original Will draft. Ensure all instructions are followed carefully and that the legal integrity and formatting of the document are maintained.

Original Will Draft:
{{{originalDraft}}}

Lawyer's Amendments:
{{{amendments}}}

Please provide the updated Will draft.`,
});

const refineWillDraftWithAIFlow = ai.defineFlow(
  {
    name: 'refineWillDraftWithAIFlow',
    inputSchema: RefineWillDraftWithAIInputSchema,
    outputSchema: RefineWillDraftWithAIOutputSchema,
  },
  async input => {
    const {output} = await refineWillDraftWithAIPrompt(input);
    return output!;
  }
);

export async function refineWillDraftWithAI(input: RefineWillDraftWithAIInput): Promise<RefineWillDraftWithAIOutput> {
  return refineWillDraftWithAIFlow(input);
}
