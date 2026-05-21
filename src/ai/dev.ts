import { config } from 'dotenv';
config();

import '@/ai/flows/generate-first-will-draft.ts';
import '@/ai/flows/refine-will-draft-with-ai.ts';