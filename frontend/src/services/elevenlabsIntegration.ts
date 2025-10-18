/**
 * ElevenLabs ConvAI Widget Integration
 *
 * This module integrates our function calling system with ElevenLabs ConvAI widget.
 * The widget fires events when the agent wants to call client tools.
 */

import { executeFunction, getFunctionDefinitions } from './functionCalling';

/**
 * Initialize ElevenLabs widget event listeners
 */
export function initializeElevenLabsIntegration() {
  // Wait for the widget element to be available
  const waitForWidget = setInterval(() => {
    const widget = document.querySelector('elevenlabs-convai');

    if (widget) {
      clearInterval(waitForWidget);
      setupWidgetListeners(widget);
    }
  }, 100);

  // Clear interval after 10 seconds if widget not found
  setTimeout(() => clearInterval(waitForWidget), 10000);
}

/**
 * Setup event listeners on the widget
 */
function setupWidgetListeners(widget: Element) {
  console.log('[ElevenLabs] Widget found, setting up client tool listeners');

  // Listen for the 'elevenlabs-convai:call' event to configure client tools
  widget.addEventListener('elevenlabs-convai:call', (event: any) => {
    console.log('[ElevenLabs] Widget call event received, configuring client tools');

    // Get all registered functions
    const functions = getFunctionDefinitions();

    // Build the clientTools object dynamically from registered functions
    const clientTools: Record<string, (params: any) => any> = {};

    functions.forEach(func => {
      // Create a wrapper function for each registered function
      clientTools[func.name] = async (params: any) => {
        console.log(`[ElevenLabs] Client tool called: ${func.name}`, params);

        try {
          // Execute the function with parameters
          const result = await executeFunction({
            name: func.name,
            parameters: params || {}
          });
          console.log(`[ElevenLabs] Client tool executed: ${func.name}`, result);
          return result;
        } catch (error) {
          console.error(`[ElevenLabs] Error executing ${func.name}:`, error);
          throw error;
        }
      };

      console.log(`[ElevenLabs] Registered client tool: ${func.name}`);
    });

    // Set the clientTools on the widget config
    event.detail.config.clientTools = clientTools;

    console.log(`[ElevenLabs] Setup complete. ${functions.length} client tools configured.`);
  });
}

/**
 * Get client tools configuration for ElevenLabs
 * This returns the format needed for ElevenLabs UI configuration
 */
export function getElevenLabsToolsConfig() {
  return getFunctionDefinitions().map(func => ({
    name: func.name,
    description: func.description,
    parameters: func.parameters,
    type: 'client',
  }));
}
