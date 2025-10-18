import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeFunctionCalling, registerFunction } from './services/functionCalling'
import { availableFunctions } from './services/functions'
import { initializeElevenLabsIntegration } from './services/elevenlabsIntegration'

// Initialize function calling for LLM integration
initializeFunctionCalling()

// Register all available functions
availableFunctions.forEach(func => registerFunction(func))
console.log(availableFunctions)

// Initialize ElevenLabs widget integration
initializeElevenLabsIntegration()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
