"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GenerateResponse {
  roadmapId?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

interface GenerationFailure {
  message: string;
  code?: string;
}

const RETRYABLE_CODES = new Set([
  "timeout",
  "network",
  "api_error",
  "invalid_response",
  "rate_limited",
  "cooldown",
  "generation_in_progress",
  "profile_unavailable",
  "roadmap_unavailable",
  "roadmap_save_failed",
  "unexpected_error",
]);

function isRetryableError(error: GenerationFailure) {
  return !error.code || RETRYABLE_CODES.has(error.code);
}

interface UseRoadmapGenerationResult {
  pending: boolean;
  error: GenerationFailure | null;
  generate: (force: boolean) => Promise<void>;
  clearError: () => void;
}

function useRoadmapGeneration(): UseRoadmapGenerationResult {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<GenerationFailure | null>(null);
  const inFlightRef = useRef(false);

  async function generate(force: boolean) {
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setPending(true);
    setError(null);

    const startedAt = performance.now();
    console.info(
      "[roadmap-client]",
      JSON.stringify({ event: "start", force }),
    );

    try {
      const response = await fetch("/api/roadmaps/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
        signal: AbortSignal.timeout(75_000),
      });

      const payload = (await response
        .json()
        .catch(() => null)) as GenerateResponse | null;
      const durationMs = Math.round(performance.now() - startedAt);

      console.info(
        "[roadmap-client]",
        JSON.stringify({
          event: "response",
          status: response.status,
          durationMs,
          code: payload?.error?.code ?? null,
        }),
      );

      if (!response.ok) {
        setError({
          message:
            payload?.error?.message ??
            "Could not generate your roadmap. Please try again.",
          code: payload?.error?.code,
        });
        return;
      }

      if (!payload?.roadmapId) {
        setError({
          message:
            "Your roadmap was generated, but the response was incomplete. Refresh the page.",
          code: "invalid_response",
        });
        return;
      }

      router.push(`/roadmaps/${payload.roadmapId}`);
      router.refresh();
    } catch (caught) {
      const durationMs = Math.round(performance.now() - startedAt);
      const name = caught instanceof Error ? caught.name : "unknown";

      console.info(
        "[roadmap-client]",
        JSON.stringify({ event: "error", durationMs, name }),
      );

      if (name === "TimeoutError" || name === "AbortError") {
        setError({
          message:
            "Roadmap generation took too long. Check your connection and try again.",
          code: "timeout",
        });
        return;
      }

      setError({
        message:
          "Could not reach the roadmap service. Check your connection and try again.",
        code: "network",
      });
    } finally {
      inFlightRef.current = false;
      setPending(false);
    }
  }

  return { pending, error, generate, clearError: () => setError(null) };
}

function GenerationError({
  error,
  onRetry,
}: {
  error: GenerationFailure | null;
  onRetry?: () => void;
}) {
  if (!error) return null;

  return (
    <div
      role="alert"
      className="flex max-w-sm flex-col items-start gap-2 text-xs leading-5 text-warning"
    >
      <p>{error.message}</p>
      {isRetryableError(error) && onRetry ? (
        <Button type="button" size="sm" variant="ghost" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

interface GenerateRoadmapButtonProps {
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
}

export function GenerateRoadmapButton({
  label = "Generate my roadmap",
  size = "md",
  variant = "primary",
  className,
}: GenerateRoadmapButtonProps) {
  const { pending, error, generate } = useRoadmapGeneration();

  return (
    <div
      className={cn("flex flex-col items-start gap-2", className)}
      aria-busy={pending}
    >
      <Button
        type="button"
        size={size}
        variant={variant}
        onClick={() => void generate(false)}
        disabled={pending}
      >
        {pending ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Sparkles aria-hidden="true" className="size-4" />
        )}
        {pending ? "Creating roadmap..." : label}
      </Button>
      {pending ? (
        <p
          role="status"
          aria-live="polite"
          className="text-xs leading-5 text-muted"
        >
          Creating your personalised learning roadmap...
        </p>
      ) : null}
      <GenerationError
        error={error}
        onRetry={() => void generate(false)}
      />
    </div>
  );
}

interface RegenerateRoadmapButtonProps {
  size?: ButtonSize;
  className?: string;
}

export function RegenerateRoadmapButton({
  size = "sm",
  className,
}: RegenerateRoadmapButtonProps) {
  const { pending, error, generate, clearError } = useRoadmapGeneration();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div
        className={cn(
          "flex max-w-md flex-col gap-3 rounded-xl border border-line bg-canvas p-3",
          className,
        )}
        aria-busy={pending}
      >
        <p className="text-xs leading-5 text-muted">
          Create a new roadmap from your current profile? Your existing roadmap
          stays in your history.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => void generate(true)}
            disabled={pending}
          >
            {pending ? (
              <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw aria-hidden="true" className="size-3.5" />
            )}
            {pending ? "Regenerating..." : "Confirm regenerate"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setConfirming(false);
              clearError();
            }}
            disabled={pending}
          >
            Cancel
          </Button>
        </div>
        {pending ? (
          <p role="status" aria-live="polite" className="text-xs text-muted">
            Creating your personalised learning roadmap...
          </p>
        ) : null}
        <GenerationError
          error={error}
          onRetry={() => void generate(true)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <Button
        type="button"
        size={size}
        variant="secondary"
        onClick={() => setConfirming(true)}
      >
        <RefreshCw aria-hidden="true" className="size-3.5" />
        Regenerate roadmap
      </Button>
      <GenerationError error={error} />
    </div>
  );
}
