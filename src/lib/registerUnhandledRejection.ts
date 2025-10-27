// Server-side registration to catch unhandled rejections and filter noisy HMR ping errors.
/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof process !== "undefined" && (process as any).on) {
  try {
    // Ensure we only attach the handler once
    const anyProc = process as any;
    if (!anyProc.__unhandledRejectionRegistered) {
      anyProc.__unhandledRejectionRegistered = true;

      process.on("unhandledRejection", (reason: any) => {
        try {
          const msg =
            reason instanceof Error ? reason.message : JSON.stringify(reason);

          // Filter the specific noisy HMR ping message that appears in some dev setups
          if (
            typeof msg === "string" &&
            msg.includes("unrecognized HMR message") &&
            msg.includes('"event":"ping"')
          ) {
            // Log at debug/trace level to keep visibility but avoid surface-level errors
            // Use console.warn so it still appears in logs but does not crash processes that treat unhandledRejection as fatal.
            console.warn("Ignored HMR ping unhandledRejection:", msg);
            return;
          }
        } catch {
          // fallthrough to generic logging
        }

        // For all other unhandled rejections, log an error to aid debugging
        console.error("Unhandled Rejection (captured):", reason);
      });
    }
  } catch (e) {
    // If anything goes wrong during registration, don't throw — just log
    // This file is intentionally defensive because it's imported early in the app lifecycle
    // and shouldn't break the server.
    console.error("Failed to register unhandledRejection handler:", e);
  }
}
