/**
 * Update Insurance Function - Allows agent to change the insurance option
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateInsurance (case-sensitive!)
 *    - Description: "Update the insurance option based on user preferences. Use this when the user wants to change the insurance coverage level."
 *    - Parameters:
 *      - insurance (String, required): Insurance ID. Options: "none" (No Insurance, included), "basic" (Basic Coverage, +$1,200), "premium" (Premium Coverage, +$2,400)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want premium insurance" → updateInsurance({insurance: "premium"})
 * - User: "Add basic coverage" → updateInsurance({insurance: "basic"})
 * - User: "No insurance needed" → updateInsurance({insurance: "none"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateInsuranceFunction: FunctionDefinition = {
  name: 'updateInsurance',
  description: 'Update the insurance option based on user preferences. Use this when the user wants to change the insurance coverage level.',
  parameters: {
    type: 'object',
    properties: {
      insurance: {
        type: 'string',
        description: 'Insurance ID. Options: "none" (No Insurance, included), "basic" (Basic Coverage, +$1,200), "premium" (Premium Coverage, +$2,400)',
      },
    },
    required: ['insurance'],
  },
  handler: async (params?: { insurance: string }) => {
    if (!params?.insurance) {
      return 'No insurance option specified. Please provide an insurance ID.';
    }

    console.log('[updateInsurance] Updating insurance to:', params.insurance);

    try {
      const result = updateConfiguration({ insurance: params.insurance });

      if (!result.success) {
        console.error('[updateInsurance] Update failed:', result.errors);
        return `Failed to update insurance: ${result.errors?.join(', ')}`;
      }

      console.log('[updateInsurance] Successfully updated insurance');

      const summary = getConfigurationSummary(result.config);

      return `✓ Insurance updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateInsurance] Error:', error);
      return `An error occurred while updating the insurance: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
