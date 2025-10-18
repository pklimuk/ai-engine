import { useState, useEffect } from 'react';
import { Check, Tag } from 'lucide-react';
import {
  models,
  paintColors,
  wheels,
  interiors,
  autopilotOptions,
  chargingOptions,
  insuranceOptions
} from '../data/carOptions';
import {
  getDiscount,
  applyDiscount,
  getDiscountAmount,
} from '../services/discountService';
import { getConfiguration, updateConfiguration as saveConfiguration } from '../services/configurationService';

const Configurator = () => {
  // Load initial config from localStorage or use defaults
  const initialConfig = getConfiguration();
  const [config, setConfig] = useState({
    model: initialConfig.model || models[0].id,
    paint: initialConfig.paint || paintColors[0].id,
    wheels: initialConfig.wheels || wheels[0].id,
    interior: initialConfig.interior || interiors[0].id,
    autopilot: initialConfig.autopilot || autopilotOptions[0].id,
    charging: initialConfig.charging || chargingOptions[0].id,
    insurance: initialConfig.insurance || insuranceOptions[0].id,
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscountState] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    const selectedModel = models.find(m => m.id === config.model);
    const selectedPaint = paintColors.find(p => p.id === config.paint);
    const selectedWheels = wheels.find(w => w.id === config.wheels);
    const selectedInterior = interiors.find(i => i.id === config.interior);
    const selectedAutopilot = autopilotOptions.find(a => a.id === config.autopilot);
    const selectedCharging = chargingOptions.find(c => c.id === config.charging);
    const selectedInsurance = insuranceOptions.find(i => i.id === config.insurance);

    const total =
      (selectedModel?.price || 0) +
      (selectedPaint?.price || 0) +
      (selectedWheels?.price || 0) +
      (selectedInterior?.price || 0) +
      (selectedAutopilot?.price || 0) +
      (selectedCharging?.price || 0) +
      (selectedInsurance?.price || 0);

    setTotalPrice(total);

    // Check for active discount
    const activeDiscount = getDiscount();
    setDiscountState(activeDiscount);

    // Calculate final price with discount
    if (activeDiscount) {
      const discountedPrice = applyDiscount(total, activeDiscount.percentage);
      setFinalPrice(discountedPrice);
    } else {
      setFinalPrice(total);
    }
  }, [config]);

  // Poll for discount updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      const activeDiscount = getDiscount();
      setDiscountState(activeDiscount);

      if (activeDiscount) {
        const discountedPrice = applyDiscount(totalPrice, activeDiscount.percentage);
        setFinalPrice(discountedPrice);
      } else {
        setFinalPrice(totalPrice);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalPrice]);

  // Poll for configuration updates from agent (every 500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedConfig = getConfiguration();

      // Check if any config value changed
      if (
        storedConfig.model !== config.model ||
        storedConfig.paint !== config.paint ||
        storedConfig.wheels !== config.wheels ||
        storedConfig.interior !== config.interior ||
        storedConfig.autopilot !== config.autopilot ||
        storedConfig.charging !== config.charging ||
        storedConfig.insurance !== config.insurance
      ) {
        console.log('[Configurator] Configuration updated by agent:', storedConfig);
        setConfig({
          model: storedConfig.model || config.model,
          paint: storedConfig.paint || config.paint,
          wheels: storedConfig.wheels || config.wheels,
          interior: storedConfig.interior || config.interior,
          autopilot: storedConfig.autopilot || config.autopilot,
          charging: storedConfig.charging || config.charging,
          insurance: storedConfig.insurance || config.insurance,
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [config]);

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    // Save to localStorage so agent can read current state
    saveConfiguration({ [key]: value });
  };

  const selectedModel = models.find(m => m.id === config.model);

  const OptionCard = ({ option, selectedId, onSelect, showPrice = true }) => {
    const isSelected = option.id === selectedId;
    return (
      <button
        onClick={() => onSelect(option.id)}
        className={`relative w-full p-4 rounded-lg border-2 transition-all text-left ${
          isSelected
            ? 'border-black bg-gray-50'
            : 'border-gray-200 hover:border-gray-400'
        }`}
      >
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>
        )}
        <div className="pr-8">
          <h3 className="font-semibold text-lg">{option.name}</h3>
          {option.description && (
            <p className="text-sm text-gray-600 mt-1">{option.description}</p>
          )}
          {showPrice && (
            <p className="text-sm font-medium mt-2">
              {option.price === 0 ? 'Included' : `+$${option.price.toLocaleString()}`}
            </p>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-semibold mb-2">Design Your Edison</h1>
        <p className="text-gray-600 mb-12">
          Configure your Model S with your preferred options
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Configuration Options */}
          <div className="lg:col-span-2 space-y-12">
            {/* Model Selection */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Model</h2>
              <div className="grid grid-cols-1 gap-4">
                {models.map(model => (
                  <OptionCard
                    key={model.id}
                    option={model}
                    selectedId={config.model}
                    onSelect={(id) => updateConfig('model', id)}
                  />
                ))}
              </div>
            </section>

            {/* Paint Colors */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Paint</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paintColors.map(paint => (
                  <OptionCard
                    key={paint.id}
                    option={paint}
                    selectedId={config.paint}
                    onSelect={(id) => updateConfig('paint', id)}
                  />
                ))}
              </div>
            </section>

            {/* Wheels */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Wheels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wheels.map(wheel => (
                  <OptionCard
                    key={wheel.id}
                    option={wheel}
                    selectedId={config.wheels}
                    onSelect={(id) => updateConfig('wheels', id)}
                  />
                ))}
              </div>
            </section>

            {/* Interior */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Interior</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interiors.map(interior => (
                  <OptionCard
                    key={interior.id}
                    option={interior}
                    selectedId={config.interior}
                    onSelect={(id) => updateConfig('interior', id)}
                  />
                ))}
              </div>
            </section>

            {/* Autopilot */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Autopilot</h2>
              <div className="grid grid-cols-1 gap-4">
                {autopilotOptions.map(autopilot => (
                  <OptionCard
                    key={autopilot.id}
                    option={autopilot}
                    selectedId={config.autopilot}
                    onSelect={(id) => updateConfig('autopilot', id)}
                  />
                ))}
              </div>
            </section>

            {/* Charging */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Charging</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chargingOptions.map(charging => (
                  <OptionCard
                    key={charging.id}
                    option={charging}
                    selectedId={config.charging}
                    onSelect={(id) => updateConfig('charging', id)}
                  />
                ))}
              </div>
            </section>

            {/* Insurance */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Insurance</h2>
              <div className="grid grid-cols-1 gap-4">
                {insuranceOptions.map(insurance => (
                  <OptionCard
                    key={insurance.id}
                    option={insurance}
                    selectedId={config.insurance}
                    onSelect={(id) => updateConfig('insurance', id)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Price Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedModel?.name}</h2>
                <p className="text-gray-600">{selectedModel?.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">${selectedModel?.price.toLocaleString()}</span>
                </div>

                {paintColors.find(p => p.id === config.paint)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {paintColors.find(p => p.id === config.paint)?.name}
                    </span>
                    <span className="font-medium">
                      +${paintColors.find(p => p.id === config.paint)?.price.toLocaleString()}
                    </span>
                  </div>
                )}

                {wheels.find(w => w.id === config.wheels)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {wheels.find(w => w.id === config.wheels)?.name}
                    </span>
                    <span className="font-medium">
                      +${wheels.find(w => w.id === config.wheels)?.price.toLocaleString()}
                    </span>
                  </div>
                )}

                {interiors.find(i => i.id === config.interior)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {interiors.find(i => i.id === config.interior)?.name}
                    </span>
                    <span className="font-medium">
                      +${interiors.find(i => i.id === config.interior)?.price.toLocaleString()}
                    </span>
                  </div>
                )}

                {autopilotOptions.find(a => a.id === config.autopilot)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {autopilotOptions.find(a => a.id === config.autopilot)?.name}
                    </span>
                    <span className="font-medium">
                      +${autopilotOptions.find(a => a.id === config.autopilot)?.price.toLocaleString()}
                    </span>
                  </div>
                )}

                {chargingOptions.find(c => c.id === config.charging)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {chargingOptions.find(c => c.id === config.charging)?.name}
                    </span>
                    <span className="font-medium">
                      +${chargingOptions.find(c => c.id === config.charging)?.price.toLocaleString()}
                    </span>
                  </div>
                )}

                {insuranceOptions.find(i => i.id === config.insurance)?.price > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {insuranceOptions.find(i => i.id === config.insurance)?.name}
                    </span>
                    <span className="font-medium">
                      +${insuranceOptions.find(i => i.id === config.insurance)?.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 border-gray-300">
                {discount && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="text-green-600" size={16} />
                      <span className="text-sm font-semibold text-green-700">
                        Discount Applied: {discount.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Original Price:</span>
                      <span className="line-through">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-700 font-medium">
                      <span>You Save:</span>
                      <span>-${getDiscountAmount(totalPrice, discount.percentage).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">
                    {discount ? 'Final Price' : 'Total Price'}
                  </span>
                  <span className={`text-2xl font-bold ${discount ? 'text-green-600' : ''}`}>
                    ${finalPrice.toLocaleString()}
                  </span>
                </div>

                <button className="w-full cta-button cta-primary pt-4">
                  Order Now
                </button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>* Price excludes taxes and fees</p>
                <p>Est. Delivery: 4-8 weeks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
