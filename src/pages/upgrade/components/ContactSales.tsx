
import React from "react";
import { Button } from "@/components/ui/button";

const ContactSales: React.FC = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-2">Need a custom solution?</h2>
      <p className="text-muted-foreground mb-4">
        Contact our sales team for a tailored package that fits your specific business needs.
      </p>
      <Button variant="outline" className="border-eazybooks-purple text-eazybooks-purple">
        Contact Sales
      </Button>
    </div>
  );
};

export default ContactSales;
