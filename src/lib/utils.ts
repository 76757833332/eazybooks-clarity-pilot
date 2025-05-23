
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currencyCode: string = "USD"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(amount);
}

export function getCurrencySymbol(currencyCode: string): string {
  try {
    const symbol = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol'
    })
    .formatToParts(0)
    .find(part => part.type === 'currency')?.value;
    
    return symbol || currencyCode;
  } catch (error) {
    console.error(`Error getting currency symbol for ${currencyCode}:`, error);
    return currencyCode;
  }
}

// New hook for currency formatting that uses the business currency if available
export function useCurrency() {
  // This is a placeholder for a hook that would fetch the user's currency from context
  // Will be implemented in the auth context
  return {
    formatCurrency,
    getCurrencySymbol
  };
}
