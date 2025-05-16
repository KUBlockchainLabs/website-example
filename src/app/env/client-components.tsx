"use client";

import { JsonDisplay } from "@/app/components/json-display";

export function ClientEnvDisplay() {
    console.log("Client-side environment variables:");
    console.log(process.env);

    const clientVars = {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "Not set",
        NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "Not set",
    };

    return <JsonDisplay data={clientVars} />;
}
