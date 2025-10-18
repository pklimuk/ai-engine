export const models = [
  {
    id: 'model-3',
    name: 'Edison Model 3',
    price: 40240,
    description: 'Rear-Wheel Drive',
    range: '272 miles',
    topSpeed: '140 mph',
    acceleration: '5.8s 0-60 mph'
  },
  {
    id: 'model-y',
    name: 'Edison Model Y',
    price: 43990,
    description: 'Rear-Wheel Drive',
    range: '260 miles',
    topSpeed: '135 mph',
    acceleration: '6.6s 0-60 mph'
  },
  {
    id: 'model-s',
    name: 'Edison Model S',
    price: 74990,
    description: 'Dual Motor All-Wheel Drive',
    range: '405 miles',
    topSpeed: '149 mph',
    acceleration: '3.1s 0-60 mph'
  },
  {
    id: 'model-x',
    name: 'Edison Model X',
    price: 79990,
    description: 'Dual Motor All-Wheel Drive',
    range: '348 miles',
    topSpeed: '149 mph',
    acceleration: '3.8s 0-60 mph'
  },
];

export const paintColors = [
  { id: 'pearl-white', name: 'Pearl White Multi-Coat', price: 0 },
  { id: 'solid-black', name: 'Solid Black', price: 0 },
  { id: 'midnight-silver', name: 'Midnight Silver Metallic', price: 1500 },
  { id: 'deep-blue', name: 'Deep Blue Metallic', price: 1500 },
  { id: 'red-multi-coat', name: 'Red Multi-Coat', price: 2500 },
];

export const wheels = [
  { id: '19-tempest', name: '19" Tempest Wheels', price: 0 },
  { id: '21-arachnid', name: '21" Arachnid Wheels', price: 4500 },
];

export const interiors = [
  { id: 'all-black', name: 'All Black', price: 0 },
  { id: 'black-white', name: 'Black and White', price: 2000 },
  { id: 'cream', name: 'Cream', price: 2000 },
];

export const autopilotOptions = [
  {
    id: 'basic',
    name: 'Basic Autopilot',
    price: 0,
    description: 'Included'
  },
  {
    id: 'enhanced',
    name: 'Enhanced Autopilot',
    price: 6000,
    description: 'Navigate on Autopilot, Auto Lane Change, Autopark, Summon'
  },
  {
    id: 'fsd',
    name: 'Full Self-Driving Capability',
    price: 15000,
    description: 'All Enhanced Autopilot features plus Traffic Light and Stop Sign Control'
  },
];

export const chargingOptions = [
  { id: 'mobile', name: 'Mobile Connector', price: 0 },
  { id: 'wall-connector', name: 'Wall Connector', price: 475 },
];

export const insuranceOptions = [
  { id: 'none', name: 'No Insurance', price: 0 },
  { id: 'basic', name: 'Basic Coverage', price: 1200 },
  { id: 'premium', name: 'Premium Coverage', price: 2400 },
];
