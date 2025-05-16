// src/app/env-test/page.tsx
import { headers } from "next/headers";
import { ClientEnvDisplay } from "./client-components";
import { JsonDisplay } from "@/app/components/json-display";

export default async function EnvTestPage() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent");

    console.log("Server-side environment variables:");
    console.log(process.env);

    const serverVars = {
        MY_SERVER_VARIABLE: process.env.MY_SERVER_VARIABLE || "Not set",
        DATABASE_URL: process.env.DATABASE_URL || "Not set",
    };

    const headerInfo = { userAgent };

    return (
        <div className="p-6 max-w-2xl mx-auto ">
            <h1 className="text-2xl font-bold mb-6">
                Environment Variables Test
            </h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                    Server-side Environment Variables:
                </h2>
                <JsonDisplay data={serverVars} />
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Headers:</h2>
                <JsonDisplay data={headerInfo} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">
                    Client-side Environment Variables:
                </h2>
                <ClientEnvDisplay />
            </div>
        </div>
    );
}
