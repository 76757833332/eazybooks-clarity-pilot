
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuotationNotesSectionProps {
  notes: string;
  setNotes: (value: string) => void;
}

const QuotationNotesSection: React.FC<QuotationNotesSectionProps> = ({
  notes,
  setNotes
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or terms..."
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default QuotationNotesSection;
