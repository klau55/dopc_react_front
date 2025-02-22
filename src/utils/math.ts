export const calculateDistanceMeters = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371000; // Earth radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const toRadians = (value: number): number => {
  return (value * Math.PI) / 180;
};

interface DistanceRange {
  min: number;
  max: number;
  a: number;
  b: number;
}

/**
 * Returns { a, b } if found, or null if the distance is not deliverable
 */
export const findDistanceRange = (
  distance: number,
  distanceRanges: DistanceRange[],
): { a: number; b: number } | null => {
  for (const range of distanceRanges) {
    if (range.max === 0) {
      if (distance >= range.min) {
        return null;
      }
    }
    if (distance >= range.min && distance < range.max) {
      return { a: range.a, b: range.b };
    }
  }
  return null;
};

/**
 *   basePrice + a + (b * distance / 10), round to nearest int
 */
export const calculateDeliveryFee = (
  basePrice: number,
  a: number,
  b: number,
  distance: number,
): number => {
  const distanceComponent = Math.round((b * distance) / 10);
  return basePrice + a + distanceComponent;
};

/**
 * Small order surcharge = order_minimum_no_surcharge - cartValue (never below 0!)
 */
export const calculateSmallOrderSurcharge = (
  cartValue: number,
  minNoSurcharge: number,
): number => {
  const diff = minNoSurcharge - cartValue;
  return diff > 0 ? diff : 0;
};

/**
 * Operations for converting outputs
 */
export const centsToEuros = (cents: number): number => cents / 100;

export const formatEuros = (euros: number): string => euros.toFixed(2);

export const formatCentsAsEuros = (cents: number): string => {
  return formatEuros(centsToEuros(cents));
};

export const eurosToCents = (euros: string): number => {
  return Math.round(parseFloat(euros) * 100);
};
