/**
 * Update Model Function - Allows agent to change the car model
 *
 * ElevenLabs Configuration:
 * 1. In ElevenLabs UI, create a client tool with:
 *    - Tool name: updateModel (case-sensitive!)
 *    - Description: "Update the car model based on user preferences. Use this when the user wants to change to a different Edison model (Model 3, Model Y, Model S, or Model X)."
 *    - Parameters:
 *      - model (String, required): Car model ID. Options: "model-3" (Edison Model 3, $40,240), "model-y" (Edison Model Y, $43,990), "model-s" (Edison Model S, $74,990), "model-x" (Edison Model X, $79,990)
 *    - Type: Client Tool
 *    - Wait for response: Optional (enable if you want confirmation)
 *
 * Usage Examples:
 * - User: "I want the Model X" → updateModel({model: "model-x"})
 * - User: "Switch to Model 3" → updateModel({model: "model-3"})
 * - User: "Can I get the Model S?" → updateModel({model: "model-s"})
 */

import type { FunctionDefinition } from '../functionCalling';
import {
  updateConfiguration,
  getConfigurationSummary,
} from '../configurationService';

export const updateModelFunction: FunctionDefinition = {
  name: 'updateModel',
  description: 'Update the car model based on user preferences. Use this when the user wants to change to a different Edison model (Model 3, Model Y, Model S, or Model X).',
  parameters: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        description: 'Car model ID. Options: "model-3" (Edison Model 3, $40,240), "model-y" (Edison Model Y, $43,990), "model-s" (Edison Model S, $74,990), "model-x" (Edison Model X, $79,990)',
      },
    },
    required: ['model'],
  },
  handler: async (params?: { model: string }) => {
    if (!params?.model) {
      return 'No model specified. Please provide a model ID.';
    }

    console.log('[updateModel] Updating model to:', params.model);

    try {
      const result = updateConfiguration({ model: params.model });

      if (!result.success) {
        console.error('[updateModel] Update failed:', result.errors);
        return `Failed to update model: ${result.errors?.join(', ')}`;
      }

      console.log('[updateModel] Successfully updated model');

      const summary = getConfigurationSummary(result.config);

      return `✓ Model updated successfully!\n\nCurrent configuration: ${summary}`;
    } catch (error) {
      console.error('[updateModel] Error:', error);
      return `An error occurred while updating the model: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
};
