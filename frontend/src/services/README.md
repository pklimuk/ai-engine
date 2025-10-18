# LLM Function Calling Integration

This system enables LLM integration with your app through function calling, with built-in support for ElevenLabs ConvAI.

## Available Functions

### `orderNow`
Navigates to the order/configuration page.

**Description:** Use when the user wants to order, buy, configure, or customize a vehicle.

**Parameters:** None

**Example:**
```javascript
window.executeLLMFunction({ name: 'orderNow' })
```

## ElevenLabs ConvAI Setup

### Step 1: Configure Client Tool in ElevenLabs UI

1. Go to your ElevenLabs agent settings
2. Navigate to "Tools" section
3. Click "Add Tool" and select "Client Tool"
4. Configure the tool:
   - **Tool name:** `orderNow`
   - **Description:** "Navigate to the order/configuration page to start customizing and ordering a vehicle. Use this when the user wants to order, buy, configure, or customize a car."
   - **Parameters:** Leave empty (no parameters needed)
   - **Wait for response:** ✅ Enable this if you want the agent to receive confirmation

### Step 2: The Integration Works Automatically

The widget integration is already set up! When the ElevenLabs agent decides to call the `orderNow` tool:

1. The widget fires an event with the tool name
2. Our integration listens for this event
3. The corresponding function is executed
4. If "Wait for response" is enabled, the result is sent back to the agent

### Step 3: Test It

Talk to your agent and say things like:
- "I want to order a car"
- "Take me to the configurator"
- "I'd like to customize a vehicle"

The agent should call the `orderNow` tool, which will navigate to `/cart`.

## Usage

### From Browser Console (Testing)
```javascript
// Get all available functions
window.getLLMFunctions()

// Execute the orderNow function
window.executeLLMFunction({ name: 'orderNow' })
```

### From Your LLM (e.g., ElevenLabs ConvAI)

The LLM should receive the function definitions from `window.getLLMFunctions()` and can call them via:

```javascript
window.executeLLMFunction({
  name: 'orderNow',
  parameters: {}
})
```

## Adding New Functions

1. Create a new file in `src/services/functions/yourFunction.ts`:

```typescript
import { FunctionDefinition } from '../functionCalling';

export const yourFunction: FunctionDefinition = {
  name: 'yourFunctionName',
  description: 'Description for the LLM to understand when to use this',
  parameters: {
    type: 'object',
    properties: {
      paramName: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['paramName'],
  },
  handler: async (params) => {
    // Your function logic here
    console.log('[yourFunction]', params);
    return { success: true };
  },
};
```

2. Export it in `src/services/functions/index.ts`:

```typescript
export { yourFunction } from './yourFunction';
import { yourFunction } from './yourFunction';

export const availableFunctions = [
  orderNowFunction,
  yourFunction, // Add here
];
```

3. The function will be automatically registered on app startup!

## Function Definition Schema

Functions follow the OpenAI function calling format:

```typescript
{
  name: string;              // Function name
  description: string;       // When/why to use this function
  parameters: {              // JSON Schema for parameters
    type: 'object',
    properties: { ... },
    required: string[]
  };
  handler: (params) => any;  // Your implementation
}
```
