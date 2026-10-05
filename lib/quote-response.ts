export const quoteFailureMessage =
  "We couldn’t send your enquiry just now. Your answers are still here. Please try again, or email us.";

export type QuoteResponse = {
  ok?: boolean;
  reference?: string;
  confirmationSent?: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function readQuoteResponse(response: Response): Promise<QuoteResponse> {
  // Proxies and platform errors can return HTML or plain text instead of JSON.
  const body: unknown = await response.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error(quoteFailureMessage);
  const result = body as QuoteResponse;
  if (result.ok && (typeof result.reference !== "string" || !result.reference))
    throw new Error(quoteFailureMessage);
  return result;
}

export function quoteErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "TimeoutError")
    return "The connection took too long. Your answers are safe here. Retry to check your request without creating a duplicate.";
  // Fetch failures are TypeErrors and have browser-specific technical messages.
  if (error instanceof TypeError || !(error instanceof Error)) return quoteFailureMessage;
  return error.message || quoteFailureMessage;
}
