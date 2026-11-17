type PostHogLogger = {
  logger?: {
    info: (message: string, attributes?: Record<string, unknown>) => void;
  };
};

export function logPostHog(message: string, attributes?: Record<string, unknown>) {
  (window as Window & { posthog?: PostHogLogger }).posthog?.logger?.info(message, attributes);
}
