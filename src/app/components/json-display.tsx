// src/app/components/json-display.tsx
"use client";

import React from "react";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

export function JsonDisplay({
    data,
}: {
    data:
        | Record<string, string | number | boolean | null>
        | string
        | number
        | boolean
        | null;
}) {
    return <JSONPretty data={data} />;
}

export default JsonDisplay;
