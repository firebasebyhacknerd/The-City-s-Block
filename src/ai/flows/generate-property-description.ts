'use server';
/**
 * @fileOverview An AI agent that generates engaging property descriptions.
 *
 * - generatePropertyDescription - A function that handles the property description generation process.
 * - GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * - GeneratePropertyDescriptionOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z
    .string()
    .describe('The type of property, e.g., "Apartment", "House", "Condo".'),
  bedrooms: z.number().describe('The number of bedrooms.'),
  bathrooms: z.number().describe('The number of bathrooms.'),
  squareFootage: z
    .number()
    .optional()
    .describe('The total square footage of the property.'),
  location: z.string().describe('The general location or neighborhood of the property.'),
  price: z.string().describe('The listing price or price range of the property.'),
  amenities: z
    .array(z.string())
    .describe('A list of key amenities, e.g., "Swimming pool", "Gym", "Parking".'),
  uniqueFeatures: z
    .string()
    .optional()
    .describe(
      'Any unique or special features of the property, e.g., "Recently renovated kitchen", "Large backyard".'
    ),
});
export type GeneratePropertyDescriptionInput = z.infer<
  typeof GeneratePropertyDescriptionInputSchema
>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated engaging property description.'),
});
export type GeneratePropertyDescriptionOutput = z.infer<
  typeof GeneratePropertyDescriptionOutputSchema
>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are an expert real estate copywriter. Your goal is to write a concise (max 150 words) and engaging property description for a real estate listing.

Here are the property details:

Property Type: {{{propertyType}}}
Bedrooms: {{{bedrooms}}}
Bathrooms: {{{bathrooms}}}
Location: {{{location}}}
Price: {{{price}}}
Amenities: {{{amenities}}}
{{#if squareFootage}}
Square Footage: {{{squareFootage}}} sq ft
{{/if}}
{{#if uniqueFeatures}}
Unique Features: {{{uniqueFeatures}}}
{{/if}}

Craft a captivating description that highlights the property's best features and appeals to potential buyers/renters. Ensure it is persuasive and professional.`,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
