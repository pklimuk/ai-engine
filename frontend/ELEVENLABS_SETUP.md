# ElevenLabs ConvAI Client Tools Setup Guide

## Quick Start

Your app is already configured to work with ElevenLabs client tools! You just need to configure the tools in the ElevenLabs UI.

## How to Configure Client Tools in ElevenLabs

### 1. Access Your Agent Settings

1. Go to [ElevenLabs](https://elevenlabs.io)
2. Navigate to your Conversational AI agent (ID: `agent_6701k7v7hw5hebfsyk6nm81nnh0g`)
3. Go to the "Tools" or "Client Tools" section

### 2. Add the `orderNow` Client Tool

Click "Add Tool" and configure:

```
Tool Type: Client Tool
Tool Name: orderNow

Description:
Navigate to the order/configuration page to start customizing and ordering a vehicle. Use this when the user wants to order, buy, configure, or customize a car.

Parameters: (Leave empty - no parameters needed)

Wait for response: ✅ Enabled
```

### 3. Save and Test

That's it! Your agent can now use the `orderNow` function.

## Testing the Integration

### Test Phrases

Try saying these to your agent:
- "I want to order a car"
- "Show me the configurator"
- "I'd like to buy a Model S"
- "Take me to the order page"
- "Let's customize a vehicle"

### Expected Behavior

When the agent recognizes the intent to order, it will:
1. Call the `orderNow` client tool
2. The page will navigate to `/cart` (the configurator)
3. The agent receives confirmation: "Successfully navigating to the order configuration page"

## How It Works

```
User speaks → Agent understands intent → Agent calls orderNow tool
                                              ↓
Widget fires 'orderNow' event → Our integration catches it
                                              ↓
Function executes → Navigate to /cart → Return success message
                                              ↓
                                    Agent receives confirmation
```

## Adding More Client Tools

See `src/services/README.md` for instructions on adding additional client tools.

## Debugging

Open browser console to see logs:
- `[ElevenLabs] Widget found, setting up client tool listeners`
- `[ElevenLabs] Registered listener for: orderNow`
- `[ElevenLabs] Client tool called: orderNow`
- `[orderNow] Navigating to configurator page...`

## Troubleshooting

### Widget not connecting
- Check that the widget element is present: `document.querySelector('elevenlabs-convai')`
- Verify the agent ID matches: `agent_6701k7v7hw5hebfsyk6nm81nnh0g`

### Tool not being called
- Ensure the tool name in ElevenLabs UI exactly matches: `orderNow` (case-sensitive)
- Check that the description clearly indicates when to use the tool
- Try using a more explicit phrase like "please call the order now function"

### Function not executing
- Open browser console and check for error messages
- Verify the function is registered: `window.getLLMFunctions()`
- Manually test: `window.executeLLMFunction({ name: 'orderNow' })`

## Best Practices

1. **Use high intelligence models** - GPT-4o mini or Claude 3.5 Sonnet recommended
2. **Clear descriptions** - Be explicit about when the agent should use each tool
3. **Enable "Wait for response"** - Allows the agent to confirm actions
4. **Test thoroughly** - Try various phrasings to ensure reliable triggering
