import { headers } from "next/headers";
import { db as prisma } from "~/server/db";
import { createCaller, appRouter } from "~/server/api/root";
import EndpointRenderer from "./EndpointRenderer";

export const dynamic = "force-dynamic";

// Extract endpoints on the server
function extractEndpoints() {
  const procedures = appRouter._def.procedures;
  const endpoints = Object.entries(procedures).reduce(
    (acc, [name, procedure]) => {
      if (procedure._def) {
        const procedureType = procedure._def.type;
        if (procedureType === "query") {
          acc.queries.push({ name, type: "query" });
        } else if (procedureType === "mutation") {
          acc.mutations.push({ name, type: "mutation" });
        }
      }
      return acc;
    },
    { queries: [], mutations: [] } as {
      queries: { name: string; type: "query" }[];
      mutations: { name: string; type: "mutation" }[];
    }
  );

  return endpoints;
}

export default async function TestPage() {
  const requestHeaders = headers();
  const { queries, mutations } = extractEndpoints();

  // Prepare a caller on the server side (though calls will be initiated from client)
  const caller = createCaller({ headers: requestHeaders, db: prisma });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">tRPC API Explorer</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold">Queries</h2>
        <div className="space-y-4">
          {queries.map((endpoint) => (
            <EndpointRenderer
              key={endpoint.name}
              endpoint={endpoint}
              requestHeaders={Object.fromEntries(requestHeaders.entries())}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Mutations</h2>
        <div className="space-y-4">
          {mutations.map((endpoint) => (
            <EndpointRenderer
              key={endpoint.name}
              endpoint={endpoint}
              requestHeaders={Object.fromEntries(requestHeaders.entries())}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
