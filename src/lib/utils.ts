
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Get the user's locale and currency code based on browser settings
export function getUserLocaleInfo() {
  // Default to EUR if detection fails
  let locale = 'en-US';
  let currencyCode = 'EUR';
  
  try {
    // Try to get the user's browser language
    const browserLocale = navigator.language;
    locale = browserLocale || 'en-US';
    
    // Try to determine currency based on locale
    // This is a simple mapping of common locales to currencies
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'es-ES': 'EUR',
      'it-IT': 'EUR',
      'ja-JP': 'JPY',
      'zh-CN': 'CNY',
      'ru-RU': 'RUB',
      'pt-BR': 'BRL',
      'hi-IN': 'INR',
      'tr-TR': 'TRY',
      'ko-KR': 'KRW',
    };
    
    // Check if we have a direct match for the locale
    if (browserLocale && currencyMap[browserLocale]) {
      currencyCode = currencyMap[browserLocale];
    } else if (browserLocale) {
      // Try to match just the country code part (e.g., 'en-ZA' -> 'ZA')
      const countryCode = browserLocale.split('-')[1];
      if (countryCode) {
        // Map some common country codes to currencies
        const countryCurrencyMap: Record<string, string> = {
          'US': 'USD',
          'GB': 'GBP',
          'CA': 'CAD',
          'AU': 'AUD',
          'NZ': 'NZD',
          'DE': 'EUR',
          'FR': 'EUR',
          'IT': 'EUR',
          'ES': 'EUR',
          'JP': 'JPY',
          'CN': 'CNY',
          'IN': 'INR',
          'BR': 'BRL',
          'RU': 'RUB',
          'ZA': 'ZAR',
          'MX': 'MXN',
          'KR': 'KRW',
          'TR': 'TRY',
          'CH': 'CHF',
          'SE': 'SEK',
          'NO': 'NOK',
          'DK': 'DKK',
        };
        if (countryCurrencyMap[countryCode]) {
          currencyCode = countryCurrencyMap[countryCode];
        }
      }
    }
  } catch (error) {
    console.error("Error detecting user locale or currency:", error);
  }
  
  return { locale, currencyCode };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const { locale, currencyCode } = getUserLocaleInfo();
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2
  }).format(amount);
}

// Demo data for the dashboard
export const recentTransactions = [
  {
    id: '1',
    name: 'Client Payment',
    date: 'Today, 14:35',
    amount: 350.00,
    type: 'income' as const,
  },
  {
    id: '2',
    name: 'Office Supplies',
    date: 'Yesterday, 10:20',
    amount: 42.50,
    type: 'expense' as const,
  },
  {
    id: '3',
    name: 'Freelance Work',
    date: '20 Oct, 09:15',
    amount: 275.00,
    type: 'income' as const,
  },
  {
    id: '4',
    name: 'Software Subscription',
    date: '18 Oct, 11:45',
    amount: 29.99,
    type: 'expense' as const,
  },
  {
    id: '5',
    name: 'Consulting Fee',
    date: '15 Oct, 16:30',
    amount: 500.00,
    type: 'income' as const,
  },
];
