/**
 * Update Charging Function - Allows agent to change the charging option
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateCharging (case-sensitive!)
 *    - Description: "Update the charging option based on user preferences. Use this when the user wants to change the charging equipment."
 *    - Parameters:
 *      - charging (String, required): Charging option ID. Options: "mobile" (Mobile Connector, included), "wall-connector" (Wall Connector, +$475)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want the wall connector" → updateCharging({charging: "wall-connector"})
 * - User: "Add the home charging station" → updateCharging({charging: "wall-connector"})
 * - User: "Just the mobile charger is fine" → updateCharging({charging: "mobile"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateChargingFunction: FunctionDefinition = {
  name: 'updateCharging',
  description: 'Update the charging option based on user preferences. Use this when the user wants to change the charging equipment.',
  parameters: {
    type: 'object',
    properties: {
      charging: {
        type: 'string',
        description: 'Charging option ID. Options: "mobile" (Mobile Connector, included), "wall-connector" (Wall Connector, +$475)',
      },
    },
    required: ['charging'],
  },
  handler: async (params?: { charging: string }) => {
    if (!params?.charging) {
      return 'No charging option specified. Please provide a charging option ID.';
    }

    console.log('[updateCharging] Updating charging to:', params.charging);

    try {
      const result = updateConfiguration({ charging: params.charging });

      if (!result.success) {
        console.error('[updateCharging] Update failed:', result.errors);
        return `Failed to update charging option: ${result.errors?.join(', ')}`;
      }

      console.log('[updateCharging] Successfully updated charging option');

      const summary = getConfigurationSummary(result.config);

      return `✓ Charging option updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateCharging] Error:', error);
      return `An error occurred while updating the charging option: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
