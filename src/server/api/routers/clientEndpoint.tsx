"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createCaller } from "~/server/api/root";
import { db as prisma } from "~/server/db";

type Endpoint = { name: string; type: string };

export default function ClientEndpoint({ endpoint }: { endpoint: Endpoint }) {
  const [result, setResult] = React.useState<any>(null);
  const [input, setInput] = React.useState<string>(""); // For mutation input
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleQuery = async () => {
    setLoading(true);
    setError(null);

    try {
      const caller = createCaller({ db: prisma });
      const data = await caller[endpoint.name as keyof typeof caller]?.();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMutation = async () => {
    setLoading(true);
    setError(null);

    try {
      const caller = createCaller({ db: prisma });
      const data = await caller[endpoint.name as keyof typeof caller]?.(
        JSON.parse(input)
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{endpoint.name}</span>
          <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
            {endpoint.type}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {endpoint.type === "query" ? (
          <div className="space-y-4">
            <button
              onClick={handleQuery}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              Execute Query
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter JSON input for mutation"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <button
              onClick={handleMutation}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              Submit Mutation
            </button>
          </div>
        )}

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {result && <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>}
      </CardContent>
    </Card>
  );
}
