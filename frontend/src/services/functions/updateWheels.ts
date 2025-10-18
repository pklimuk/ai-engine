/**
 * Update Wheels Function - Allows agent to change the wheels
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateWheels (case-sensitive!)
 *    - Description: "Update the wheels based on user preferences. Use this when the user wants to change the wheel size or style."
 *    - Parameters:
 *      - wheels (String, required): Wheels ID. Options: "19-tempest" (19" Tempest Wheels, included), "21-arachnid" (21" Arachnid Wheels, +$4,500)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want the bigger wheels" → updateWheels({wheels: "21-arachnid"})
 * - User: "Give me the 21 inch wheels" → updateWheels({wheels: "21-arachnid"})
 * - User: "Switch to standard wheels" → updateWheels({wheels: "19-tempest"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateWheelsFunction: FunctionDefinition = {
  name: 'updateWheels',
  description: 'Update the wheels based on user preferences. Use this when the user wants to change the wheel size or style.',
  parameters: {
    type: 'object',
    properties: {
      wheels: {
        type: 'string',
        description: 'Wheels ID. Options: "19-tempest" (19" Tempest Wheels, included), "21-arachnid" (21" Arachnid Wheels, +$4,500)',
      },
    },
    required: ['wheels'],
  },
  handler: async (params?: { wheels: string }) => {
    if (!params?.wheels) {
      return 'No wheels specified. Please provide a wheels ID.';
    }

    console.log('[updateWheels] Updating wheels to:', params.wheels);

    try {
      const result = updateConfiguration({ wheels: params.wheels });

      if (!result.success) {
        console.error('[updateWheels] Update failed:', result.errors);
        return `Failed to update wheels: ${result.errors?.join(', ')}`;
      }

      console.log('[updateWheels] Successfully updated wheels');

      const summary = getConfigurationSummary(result.config);

      return `✓ Wheels updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateWheels] Error:', error);
      return `An error occurred while updating the wheels: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
