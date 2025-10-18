/**
 * Configuration Service
 * Manages car configuration stored in localStorage
 */

import {
  models,
  paintColors,
  wheels,
  interiors,
  autopilotOptions,
  chargingOptions,
  insuranceOptions,
} from '../data/carOptions';

export interface CarConfiguration {
  model?: string;
  paint?: string;
  wheels?: string;
  interior?: string;
  autopilot?: string;
  charging?: string;
  insurance?: string;
}

const STORAGE_KEY = 'car_configuration';
const DEFAULT_CONFIG: CarConfiguration = {
  model: 'model-3',
  paint: 'pearl-white',
  wheels: '19-tempest',
  interior: 'all-black',
  autopilot: 'basic',
  charging: 'mobile',
  insurance: 'none',
};

/**
 * Validate configuration option IDs
 */
export function validateConfiguration(config: Partial<CarConfiguration>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (config.model && !models.find(m => m.id === config.model)) {
    errors.push(`Invalid model ID: ${config.model}. Valid options: ${models.map(m => m.id).join(', ')}`);
  }

  if (config.paint && !paintColors.find(p => p.id === config.paint)) {
    errors.push(`Invalid paint ID: ${config.paint}. Valid options: ${paintColors.map(p => p.id).join(', ')}`);
  }

  if (config.wheels && !wheels.find(w => w.id === config.wheels)) {
    errors.push(`Invalid wheels ID: ${config.wheels}. Valid options: ${wheels.map(w => w.id).join(', ')}`);
  }

  if (config.interior && !interiors.find(i => i.id === config.interior)) {
    errors.push(`Invalid interior ID: ${config.interior}. Valid options: ${interiors.map(i => i.id).join(', ')}`);
  }

  if (config.autopilot && !autopilotOptions.find(a => a.id === config.autopilot)) {
    errors.push(`Invalid autopilot ID: ${config.autopilot}. Valid options: ${autopilotOptions.map(a => a.id).join(', ')}`);
  }

  if (config.charging && !chargingOptions.find(c => c.id === config.charging)) {
    errors.push(`Invalid charging ID: ${config.charging}. Valid options: ${chargingOptions.map(c => c.id).join(', ')}`);
  }

  if (config.insurance && !insuranceOptions.find(i => i.id === config.insurance)) {
    errors.push(`Invalid insurance ID: ${config.insurance}. Valid options: ${insuranceOptions.map(i => i.id).join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get the current configuration
 */
export function getConfiguration(): CarConfiguration {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { ...DEFAULT_CONFIG };
    }

    const config = JSON.parse(data) as CarConfiguration;
    // Merge with defaults to ensure all fields exist
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error('Error reading configuration:', error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Update configuration (partial update)
 */
export function updateConfiguration(updates: Partial<CarConfiguration>): {
  success: boolean;
  config?: CarConfiguration;
  errors?: string[];
} {
  // Validate updates
  const validation = validateConfiguration(updates);
  if (!validation.valid) {
    console.error('[Configuration] Validation failed:', validation.errors);
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Get current config
  const currentConfig = getConfiguration();

  // Merge updates
  const newConfig = { ...currentConfig, ...updates };

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    console.log('[Configuration] Updated:', updates);

    return {
      success: true,
      config: newConfig,
    };
  } catch (error) {
    console.error('Error saving configuration:', error);
    return {
      success: false,
      errors: ['Failed to save configuration'],
    };
  }
}

/**
 * Set entire configuration (replaces current config)
 */
export function setConfiguration(config: CarConfiguration): {
  success: boolean;
  config?: CarConfiguration;
  errors?: string[];
} {
  // Validate entire config
  const validation = validateConfiguration(config);
  if (!validation.valid) {
    console.error('[Configuration] Validation failed:', validation.errors);
    return {
      success: false,
      errors: validation.errors,
    };
  }

  // Merge with defaults
  const completeConfig = { ...DEFAULT_CONFIG, ...config };

  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completeConfig));
    console.log('[Configuration] Set:', completeConfig);

    return {
      success: true,
      config: completeConfig,
    };
  } catch (error) {
    console.error('Error saving configuration:', error);
    return {
      success: false,
      errors: ['Failed to save configuration'],
    };
  }
}

/**
 * Reset configuration to defaults
 */
export function resetConfiguration(): CarConfiguration {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
    console.log('[Configuration] Reset to defaults');
    return { ...DEFAULT_CONFIG };
  } catch (error) {
    console.error('Error resetting configuration:', error);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Get human-readable configuration summary
 */
export function getConfigurationSummary(config?: CarConfiguration): string {
  const currentConfig = config || getConfiguration();

  const modelName = models.find(m => m.id === currentConfig.model)?.name || currentConfig.model;
  const paintName = paintColors.find(p => p.id === currentConfig.paint)?.name || currentConfig.paint;
  const wheelsName = wheels.find(w => w.id === currentConfig.wheels)?.name || currentConfig.wheels;
  const interiorName = interiors.find(i => i.id === currentConfig.interior)?.name || currentConfig.interior;
  const autopilotName = autopilotOptions.find(a => a.id === currentConfig.autopilot)?.name || currentConfig.autopilot;
  const chargingName = chargingOptions.find(c => c.id === currentConfig.charging)?.name || currentConfig.charging;
  const insuranceName = insuranceOptions.find(i => i.id === currentConfig.insurance)?.name || currentConfig.insurance;

  return `${modelName} with ${paintName} paint, ${wheelsName}, ${interiorName} interior, ${autopilotName}, ${chargingName}, ${insuranceName}`;
}
