
import React from "react";

const UpgradeFAQ: React.FC = () => {
  return (
    <div className="mt-16 border-t border-border pt-8">
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-1">Can I upgrade or downgrade at any time?</h3>
          <p className="text-muted-foreground text-sm">
            Yes, you can change your subscription at any time. Changes will be effective at the start of your next billing cycle.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">How does billing work?</h3>
          <p className="text-muted-foreground text-sm">
            We bill monthly or annually based on your preference. You'll be charged automatically on the same date each month/year through LemonSqueezy, our secure payment processor.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">What payment methods do you accept?</h3>
          <p className="text-muted-foreground text-sm">
            We accept all major credit cards, PayPal, and bank transfers for annual plans through our payment provider.
          </p>
        </div>
        <div>
          <h3 className="font-medium mb-1">Is there a refund policy?</h3>
          <p className="text-muted-foreground text-sm">
            We offer a 30-day money-back guarantee for all new subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeFAQ;
