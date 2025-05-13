
export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-amber-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

export const getSubscriptionBadgeColor = (tier?: string): string => {
  switch (tier) {
    case 'premium':
      return 'bg-amber-500';
    case 'enterprise':
      return 'bg-purple-600';
    default:
      return 'bg-gray-500';
  }
};

// Function to check if a feature is available based on subscription
export const isFeatureAvailable = (
  requiredTier: 'free' | 'premium' | 'enterprise',
  userTier?: string
): boolean => {
  const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
  const currentTier = userTier || 'free';
  
  return tierHierarchy[currentTier as keyof typeof tierHierarchy] >= 
         tierHierarchy[requiredTier];
};
