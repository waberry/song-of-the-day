"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Endpoint = {
  name: string;
  type: "query" | "mutation";
};

type EndpointRendererProps = {
  endpoint: Endpoint;
  requestHeaders: Record<string, string>; // Not strictly needed if you're just testing
};

export default function EndpointRenderer({ endpoint }: EndpointRendererProps) {
  const [input, setInput] = useState<string>("{}");

  const handleClick = async () => {
    try {
      const body = {
        name: endpoint.name,
        type: endpoint.type,
        input: endpoint.type === 'mutation' ? JSON.parse(input) : undefined,
      };

      const response = await fetch('/api/call-trpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      alert(`Response: ${JSON.stringify(data.result, null, 2)}`);
    } catch (error: any) {
      console.error(`Error calling ${endpoint.name}:`, error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card key={endpoint.name}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{endpoint.name}</span>
          <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
            {endpoint.type}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {endpoint.type === "mutation" && (
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter JSON input for mutation"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {endpoint.type === "query" ? "Execute Query" : "Submit Mutation"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
