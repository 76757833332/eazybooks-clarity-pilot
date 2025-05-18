
// Function to get badge color based on subscription tier
export const getSubscriptionBadgeColor = (tier: string) => {
  switch (tier) {
    case 'premium':
      return 'bg-amber-500';
    case 'enterprise':
      return 'bg-purple-600';
    default:
      return 'bg-gray-500';
  }
};

// Function to format address parts
export const formatBusinessAddress = (
  city?: string, 
  state?: string, 
  country?: string
) => {
  const addressParts = [];
  if (city) addressParts.push(city);
  if (state) addressParts.push(state);
  if (country) addressParts.push(country);
  
  return addressParts.length > 0 ? addressParts.join(', ') : null;
};

// Format name with capitalization
export const formatName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Extract display name from email or use provided name
export const getDisplayName = (
  firstName?: string, 
  email?: string, 
  fallback: string = 'User'
) => {
  return firstName || email?.split('@')[0] || fallback;
};
