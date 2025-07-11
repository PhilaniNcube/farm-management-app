"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export default function WebhookTester() {
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createFarmFromOrganization = useMutation(
    api.farms.createFarmFromOrganization
  );

  const testWebhookFunction = async () => {
    setIsLoading(true);
    setTestResult("");

    try {
      const testData = {
        organizationId: "org_test_123",
        organizationName: "Test Farm Organization",
        orgSlug: "test-farm-org",
        createdByClerkId: "user_test_456", // You'll need to replace with actual user ID
      };

      const result = await createFarmFromOrganization(testData);
      setTestResult(`Success! Farm created with ID: ${result}`);
    } catch (error: any) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h2 className="text-lg font-semibold mb-4">Webhook Function Tester</h2>
      <button
        onClick={testWebhookFunction}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {isLoading ? "Testing..." : "Test Create Farm Function"}
      </button>
      {testResult && (
        <div className="mt-4 p-2 border rounded bg-white">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
    </div>
  );
}
