/**
 * Update Autopilot Function - Allows agent to change the autopilot option
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateAutopilot (case-sensitive!)
 *    - Description: "Update the autopilot option based on user preferences. Use this when the user wants to change the autopilot or self-driving capability."
 *    - Parameters:
 *      - autopilot (String, required): Autopilot ID. Options: "basic" (Basic Autopilot, included), "enhanced" (Enhanced Autopilot, +$6,000), "fsd" (Full Self-Driving Capability, +$15,000)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want full self-driving" → updateAutopilot({autopilot: "fsd"})
 * - User: "Add enhanced autopilot" → updateAutopilot({autopilot: "enhanced"})
 * - User: "Just basic autopilot is fine" → updateAutopilot({autopilot: "basic"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateAutopilotFunction: FunctionDefinition = {
  name: 'updateAutopilot',
  description: 'Update the autopilot option based on user preferences. Use this when the user wants to change the autopilot or self-driving capability.',
  parameters: {
    type: 'object',
    properties: {
      autopilot: {
        type: 'string',
        description: 'Autopilot ID. Options: "basic" (Basic Autopilot, included), "enhanced" (Enhanced Autopilot, +$6,000), "fsd" (Full Self-Driving Capability, +$15,000)',
      },
    },
    required: ['autopilot'],
  },
  handler: async (params?: { autopilot: string }) => {
    if (!params?.autopilot) {
      return 'No autopilot option specified. Please provide an autopilot ID.';
    }

    console.log('[updateAutopilot] Updating autopilot to:', params.autopilot);

    try {
      const result = updateConfiguration({ autopilot: params.autopilot });

      if (!result.success) {
        console.error('[updateAutopilot] Update failed:', result.errors);
        return `Failed to update autopilot: ${result.errors?.join(', ')}`;
      }

      console.log('[updateAutopilot] Successfully updated autopilot');

      const summary = getConfigurationSummary(result.config);

      return `✓ Autopilot updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateAutopilot] Error:', error);
      return `An error occurred while updating the autopilot: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
