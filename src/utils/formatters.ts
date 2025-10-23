/**
 * Safe number formatting utilities
 * Handles undefined, null, NaN, and Infinity values gracefully
 */

/**
 * Check if a value is a valid finite number
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Ensure a value is valid for calculations
 */
export const ensureValidNumber = (value: any, fallback: number = 0): number => {
  return isValidNumber(value) ? value : fallback;
};

/**
 * Safe wrapper for toFixed() with fallback value
 */
export const safeToFixed = (
  value: any,
  decimals: number = 0,
  fallback: number = 0
): string => {
  const validValue = ensureValidNumber(value, fallback);
  return validValue.toFixed(decimals);
};

/**
 * Format currency values safely
 */
export const safeCurrency = (
  value: any,
  decimals: number = 0,
  fallback: number = 0
): string => {
  const validValue = ensureValidNumber(value, fallback);
  return `$${validValue.toFixed(decimals)}`;
};

/**
 * Format percentage values safely
 */
export const safePercentage = (
  value: any,
  decimals: number = 1,
  fallback: number = 0
): string => {
  const validValue = ensureValidNumber(value, fallback);
  return `${validValue.toFixed(decimals)}%`;
};

/**
 * Format values in thousands (k) safely
 */
export const safeThousands = (
  value: any,
  decimals: number = 0,
  fallback: number = 0
): string => {
  const validValue = ensureValidNumber(value, fallback);
  const thousands = validValue / 1000;
  return `${thousands.toFixed(decimals)}k`;
};

/**
 * Format large numbers with abbreviations (k, M, B)
 */
export const formatLargeNumber = (
  value: any,
  decimals: number = 1,
  fallback: number = 0
): string => {
  const validValue = ensureValidNumber(value, fallback);
  
  if (Math.abs(validValue) >= 1e9) {
    return `${(validValue / 1e9).toFixed(decimals)}B`;
  } else if (Math.abs(validValue) >= 1e6) {
    return `${(validValue / 1e6).toFixed(decimals)}M`;
  } else if (Math.abs(validValue) >= 1e3) {
    return `${(validValue / 1e3).toFixed(decimals)}k`;
  }
  
  return validValue.toFixed(decimals);
};