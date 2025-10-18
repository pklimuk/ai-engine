/**
 * Request Human Help Function - Allows agent to request human approval for discounts
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: requestHumanHelp (case-sensitive!)
 *    - Description: "ONLY use this when the user explicitly asks for a discount, price reduction, or special offer. Request human admin approval for any discount requests. Do NOT use this for any other questions or uncertainties."
 *    - Parameters:
 *      - question (String, required): "The discount request from the user. Include what discount they are asking for and any relevant context."
 *    - Type: Client Tool
 *    - Wait for response: YES (must be enabled - this makes the agent wait for admin response)
 */

import type { FunctionDefinition } from '../functionCalling';
import { createHelpRequest, pollForResponse } from '../helpRequestService';
import { parseDiscountFromText, setDiscount } from '../discountService';

export const requestHumanHelpFunction: FunctionDefinition = {
  name: 'requestHumanHelp',
  description: 'ONLY use this when the user explicitly asks for a discount, price reduction, or special offer. Request human admin approval for any discount requests. Do NOT use this for any other questions or uncertainties.',
  parameters: {
    type: 'object',
    properties: {
      question: {
        type: 'string',
        description: 'The discount request from the user. Include what discount they are asking for and any relevant context.',
      },
    },
    required: ['question'],
  },
  handler: async (params?: { question?: string }) => {
    const question = params?.question;

    if (!question || question.trim() === '') {
      throw new Error('Question parameter is required');
    }

    console.log('[requestHumanHelp] Agent is requesting help:', question);

    try {
      // Create the help request
      const request = createHelpRequest(question);
      console.log('[requestHumanHelp] Help request created:', request.id);

      // Wait for admin response (this will poll until answered or timeout)
      console.log('[requestHumanHelp] Waiting for admin response...');
      const response = await pollForResponse(request.id);

      console.log('[requestHumanHelp] Received admin response:', response);

      // Try to parse discount percentage from admin response
      const discountPercentage = parseDiscountFromText(response);
      if (discountPercentage !== null) {
        console.log(`[requestHumanHelp] Discount approved: ${discountPercentage}%`);
        setDiscount(discountPercentage, question);

        // Return response with discount confirmation
        return `${response}\n\n[System: ${discountPercentage}% discount has been applied to the order]`;
      }

      // Return the admin's answer to the agent
      return response;
    } catch (error) {
      console.error('[requestHumanHelp] Error:', error);

      // If timeout or error, return a helpful message
      if (error instanceof Error) {
        return `Unable to get human assistance at this time: ${error.message}. Please try to help the user based on your best judgment.`;
      }

      return 'Unable to get human assistance at this time. Please try to help the user based on your best judgment.';
    }
  },
};
