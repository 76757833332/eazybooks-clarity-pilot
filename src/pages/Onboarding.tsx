
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

const Onboarding = () => {
  const { user, profile, updateProfile, updateOnboardingStep, completeOnboarding, createBusiness } = useAuth();
  const [step, setStep] = useState(profile?.onboarding_step || 1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const handleNextStep = async () => {
    setLoading(true);
    try {
      // Save current step progress
      await updateOnboardingStep(step + 1);
      setStep(step + 1);
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevStep = async () => {
    setLoading(true);
    try {
      await updateOnboardingStep(step - 1);
      setStep(step - 1);
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      // Create business
      if (profile?.role === "business_owner") {
        await createBusiness({
          name: businessName,
          type: businessType, // Now matches the updated Business interface
          industry,
          country,
          tax_id: vatNumber, // Map vatNumber to tax_id
          address,
          city,
          postal_code: postalCode,
          phone,
          website,
        });
      }

      // Mark onboarding as complete
      await completeOnboarding();
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to EazyBooks!</h2>
            <p className="text-muted-foreground">
              Let's set up your account. This will only take a few minutes.
            </p>
            <button
              onClick={handleNextStep}
              className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary text-white py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Started"}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <p className="text-muted-foreground">
              Tell us a bit more about yourself.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={profile?.first_name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={profile?.last_name || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        );
      case 3:
        // Only show business setup for business owners
        if (profile?.role === "business_owner") {
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Business Information</h2>
              <p className="text-muted-foreground">
                Tell us about your business.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Business Type
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    <option value="">Select business type</option>
                    <option value="sole_proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="partnership">Partnership</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="nonprofit">Non-profit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Technology, Retail, Healthcare"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary text-white rounded-md"
                  disabled={loading || !businessName}
                >
                  {loading ? "Loading..." : "Next"}
                </button>
              </div>
            </div>
          );
        } else {
          // For non-business owners, skip to final step
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Almost Done!</h2>
              <p className="text-muted-foreground">
                Thank you for providing your information.
              </p>
              <div className="flex justify-between pt-4">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleFinishOnboarding}
                  className="px-4 py-2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Finish Setup"}
                </button>
              </div>
            </div>
          );
        }
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Business Details</h2>
            <p className="text-muted-foreground">
              Additional information about your business.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    VAT Number (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="VAT Number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Number (optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={companyNumber}
                    onChange={(e) => setCompanyNumber(e.target.value)}
                    placeholder="Company Number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md bg-background"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal Code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Website (optional)
                </label>
                <input
                  type="url"
                  className="w-full p-2 border border-gray-300 rounded-md bg-background"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="px-4 py-2 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary text-white rounded-md"
                disabled={loading || !businessName || !country || !address || !city || !postalCode}
              >
                {loading ? "Loading..." : "Complete Setup"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark/80 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-eazybooks-purple">
            EazyBooks
          </h1>
          <p className="text-muted-foreground">Account Setup</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  stepNumber <= step
                    ? "bg-eazybooks-purple text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-eazybooks-purple transition-all"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
