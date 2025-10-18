/**
 * Update Interior Function - Allows agent to change the interior
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateInterior (case-sensitive!)
 *    - Description: "Update the interior based on user preferences. Use this when the user wants to change the interior color or style."
 *    - Parameters:
 *      - interior (String, required): Interior ID. Options: "all-black" (All Black, included), "black-white" (Black and White, +$2,000), "cream" (Cream, +$2,000)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want cream interior" → updateInterior({interior: "cream"})
 * - User: "Change to black and white interior" → updateInterior({interior: "black-white"})
 * - User: "Make it all black" → updateInterior({interior: "all-black"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateInteriorFunction: FunctionDefinition = {
  name: 'updateInterior',
  description: 'Update the interior based on user preferences. Use this when the user wants to change the interior color or style.',
  parameters: {
    type: 'object',
    properties: {
      interior: {
        type: 'string',
        description: 'Interior ID. Options: "all-black" (All Black, included), "black-white" (Black and White, +$2,000), "cream" (Cream, +$2,000)',
      },
    },
    required: ['interior'],
  },
  handler: async (params?: { interior: string }) => {
    if (!params?.interior) {
      return 'No interior specified. Please provide an interior ID.';
    }

    console.log('[updateInterior] Updating interior to:', params.interior);

    try {
      const result = updateConfiguration({ interior: params.interior });

      if (!result.success) {
        console.error('[updateInterior] Update failed:', result.errors);
        return `Failed to update interior: ${result.errors?.join(', ')}`;
      }

      console.log('[updateInterior] Successfully updated interior');

      const summary = getConfigurationSummary(result.config);

      return `✓ Interior updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateInterior] Error:', error);
      return `An error occurred while updating the interior: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
