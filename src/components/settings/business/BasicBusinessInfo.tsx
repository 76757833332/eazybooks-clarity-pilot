
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BasicBusinessInfoProps {
  formData: {
    name: string;
    legal_name: string;
    tax_id: string;
    industry: string;
    description: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const BasicBusinessInfo = ({
  formData,
  handleChange,
  handleSelectChange,
}: BasicBusinessInfoProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Business Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legal_name">Legal Business Name</Label>
          <Input
            id="legal_name"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
            placeholder="Legal Business Name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
          <Input
            id="tax_id"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            placeholder="Tax ID or VAT Number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleSelectChange("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accounting">Accounting</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="it">Information Technology</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of your business"
          rows={3}
        />
      </div>
    </>
  );
};
