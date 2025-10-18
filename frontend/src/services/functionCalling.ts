/**
 * Function Calling Service for LLM Integration
 * This service handles function calls from the LLM to interact with the app
 */

export interface FunctionCall {
  name: string;
  parameters?: Record<string, any>;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
  handler: (params?: any) => any | Promise<any>;
}

// Function registry
const functionRegistry: Map<string, FunctionDefinition> = new Map();

/**
 * Register a function that can be called by the LLM
 */
export function registerFunction(func: FunctionDefinition) {
  functionRegistry.set(func.name, func);
  console.log(`[FunctionCalling] Registered function: ${func.name}`);
}

/**
 * Execute a function call from the LLM
 */
export async function executeFunction(call: FunctionCall): Promise<any> {
  const func = functionRegistry.get(call.name);

  if (!func) {
    throw new Error(`Function "${call.name}" not found in registry`);
  }

  console.log(`[FunctionCalling] Executing: ${call.name}`, call.parameters);

  try {
    const result = await func.handler(call.parameters);
    console.log(`[FunctionCalling] Success: ${call.name}`, result);
    return result;
  } catch (error) {
    console.error(`[FunctionCalling] Error executing ${call.name}:`, error);
    throw error;
  }
}

/**
 * Get all registered function definitions for LLM
 */
export function getFunctionDefinitions(): Array<Omit<FunctionDefinition, 'handler'>> {
  return Array.from(functionRegistry.values()).map(({ handler, ...def }) => def);
}

/**
 * Expose function calling to window for external access
 */
export function initializeFunctionCalling() {
  (window as any).executeLLMFunction = executeFunction;
  (window as any).getLLMFunctions = getFunctionDefinitions;
  console.log('[FunctionCalling] Initialized - Functions available via window.executeLLMFunction()');
}
