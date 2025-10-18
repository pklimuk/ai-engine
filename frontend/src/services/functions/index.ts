/**
 * Export all available functions for LLM integration
 */

export { orderNowFunction } from './orderNow';
export { requestHumanHelpFunction } from './requestHumanHelp';
export { updateModelFunction } from './updateModel';
export { updatePaintFunction } from './updatePaint';
export { updateWheelsFunction } from './updateWheels';
export { updateInteriorFunction } from './updateInterior';
export { updateAutopilotFunction } from './updateAutopilot';
export { updateChargingFunction } from './updateCharging';
export { updateInsuranceFunction } from './updateInsurance';

// Import all functions here as you add more
import { orderNowFunction } from './orderNow';
import { requestHumanHelpFunction } from './requestHumanHelp';
import { updateModelFunction } from './updateModel';
import { updatePaintFunction } from './updatePaint';
import { updateWheelsFunction } from './updateWheels';
import { updateInteriorFunction } from './updateInterior';
import { updateAutopilotFunction } from './updateAutopilot';
import { updateChargingFunction } from './updateCharging';
import { updateInsuranceFunction } from './updateInsurance';

export const availableFunctions = [
  orderNowFunction,
  requestHumanHelpFunction,
  updateModelFunction,
  updatePaintFunction,
  updateWheelsFunction,
  updateInteriorFunction,
  updateAutopilotFunction,
  updateChargingFunction,
  updateInsuranceFunction,
];
