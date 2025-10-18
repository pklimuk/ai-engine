/**
 * Update Paint Function - Allows agent to change the paint color
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updatePaint (case-sensitive!)
 *    - Description: "Update the paint color based on user preferences. Use this when the user wants to change the car's paint color."
 *    - Parameters:
 *      - paint (String, required): Paint color ID. Options: "pearl-white" (Pearl White Multi-Coat, included), "solid-black" (Solid Black, included), "midnight-silver" (Midnight Silver Metallic, +$1,500), "deep-blue" (Deep Blue Metallic, +$1,500), "red-multi-coat" (Red Multi-Coat, +$2,500)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want red paint" → updatePaint({paint: "red-multi-coat"})
 * - User: "Change to midnight silver" → updatePaint({paint: "midnight-silver"})
 * - User: "Make it black" → updatePaint({paint: "solid-black"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updatePaintFunction: FunctionDefinition = {
  name: 'updatePaint',
  description: 'Update the paint color based on user preferences. Use this when the user wants to change the car\'s paint color.',
  parameters: {
    type: 'object',
    properties: {
      paint: {
        type: 'string',
        description: 'Paint color ID. Options: "pearl-white" (Pearl White Multi-Coat, included), "solid-black" (Solid Black, included), "midnight-silver" (Midnight Silver Metallic, +$1,500), "deep-blue" (Deep Blue Metallic, +$1,500), "red-multi-coat" (Red Multi-Coat, +$2,500)',
      },
    },
    required: ['paint'],
  },
  handler: async (params?: { paint: string }) => {
    if (!params?.paint) {
      return 'No paint color specified. Please provide a paint color ID.';
    }

    console.log('[updatePaint] Updating paint to:', params.paint);

    try {
      const result = updateConfiguration({ paint: params.paint });

      if (!result.success) {
        console.error('[updatePaint] Update failed:', result.errors);
        return `Failed to update paint: ${result.errors?.join(', ')}`;
      }

      console.log('[updatePaint] Successfully updated paint');

      const summary = getConfigurationSummary(result.config);

      return `✓ Paint color updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updatePaint] Error:', error);
      return `An error occurred while updating the paint color: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
