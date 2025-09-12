import type { ErrorType } from "@/types/errors";

export  function normalizeError(e: unknown): string {
    if (!e) return "Unknown error";
    if (e instanceof Error) return e.message;
    if (typeof e === "string") return e;
    try {
        const anyE = e as any;
        if (anyE?.value?.message) return anyE.value.message;
        if (anyE?.value?.summary) return anyE.value.summary;
        if (anyE?.message) return anyE.message;
        if (anyE?.status) return `Request failed with status ${anyE.status}`;
        return JSON.stringify(e);
    } catch {
        return String(e);
    }
}

export const errorMessage = (error: ErrorType | null): string => {
    const message = (typeof error?.value === 'object' && error.value !== null)
        ? error.value.message 
        ?? error.value.summary 
        ?? (error.value.on ? `Validation error on ${error.value.on}` : null)
        ?? `Request failed with status ${error.status}`
        : `Request failed with status ${error?.status}`;
    return message
}