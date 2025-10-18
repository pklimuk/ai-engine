/**
 * Discount Service
 * Manages approved discounts stored in localStorage
 */

export interface Discount {
  percentage: number;
  approvedAt: number;
  approvedBy?: string;
  reason?: string;
}

const STORAGE_KEY = 'active_discount';

/**
 * Parse discount percentage from text
 * Matches patterns like: "20%", "20% discount", "discount of 20%", etc.
 */
export function parseDiscountFromText(text: string): number | null {
  // Try to find percentage patterns
  const percentagePatterns = [
    /(\d+)%/,                           // "20%"
    /(\d+)\s*percent/i,                 // "20 percent"
    /discount\s*(?:of\s*)?(\d+)/i,      // "discount of 20"
  ];

  for (const pattern of percentagePatterns) {
    const match = text.match(pattern);
    if (match) {
      const percentage = parseInt(match[1], 10);
      if (percentage > 0 && percentage <= 100) {
        return percentage;
      }
    }
  }

  return null;
}

/**
 * Get the currently active discount
 */
export function getDiscount(): Discount | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const discount = JSON.parse(data) as Discount;

    // Validate discount structure
    if (typeof discount.percentage !== 'number' || discount.percentage <= 0) {
      return null;
    }

    return discount;
  } catch (error) {
    console.error('Error reading discount:', error);
    return null;
  }
}

/**
 * Set an active discount
 */
export function setDiscount(percentage: number, reason?: string): Discount {
  const discount: Discount = {
    percentage,
    approvedAt: Date.now(),
    approvedBy: 'admin',
    reason,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(discount));
    console.log(`[Discount] Set ${percentage}% discount`, discount);
  } catch (error) {
    console.error('Error saving discount:', error);
  }

  return discount;
}

/**
 * Clear the active discount
 */
export function clearDiscount(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Discount] Cleared active discount');
  } catch (error) {
    console.error('Error clearing discount:', error);
  }
}

/**
 * Calculate discounted price
 */
export function applyDiscount(originalPrice: number, percentage: number): number {
  if (percentage <= 0 || percentage > 100) {
    return originalPrice;
  }

  const discountAmount = originalPrice * (percentage / 100);
  return Math.round((originalPrice - discountAmount) * 100) / 100;
}

/**
 * Get discount amount
 */
export function getDiscountAmount(originalPrice: number, percentage: number): number {
  if (percentage <= 0 || percentage > 100) {
    return 0;
  }

  return Math.round(originalPrice * (percentage / 100) * 100) / 100;
}

/**
 * Check if a discount is currently active
 */
export function hasActiveDiscount(): boolean {
  return getDiscount() !== null;
}
