# Workflow Audit: Lazy vs. Rigorous AI Prompting

## Correctness & Edge Cases
The architectural gap between the two branches is significant. In the `settings-lazy` branch, the AI generated a basic uncontrolled form utilizing primitive browser-native validation rules. It completely failed to handle structural edge cases, such as trailing whitespace inside fields, preventing non-alphanumeric characters in usernames, or implementing a real-time character count layout for the user's bio. 

Conversely, the `settings-rigorous` branch leveraged a strict Zod schema definition coupled with `react-hook-form`. This cleanly intercepted input state events, parsed validation errors immediately on field blur, and gracefully provided a structured UI with a real-time counter.

## Accessibility (a11y)
The lazy prompt completely neglected accessibility frameworks. It generated disconnected inputs wrapped loosely in `<div>` strings without matching semantic `<label>` associations or `htmlFor` properties. The rigorous setup explicitly included clean labels, screen-reader support, and conditional execution of `aria-invalid` tags on fields displaying error strings.

## Caught AI Mistakes
During the evaluation of the rigorous round, the AI assistant attempted to implement a native regex string for email check directly inside a basic `useState` filter instead of adhering to the requested Zod validation rules setup. I caught this logic gap during the planning phase and directed the model to strictly bundle all string limits inside the safe `z.string().email()` pipeline.

## Review Effort & Time Efficiency
While the lazy branch felt incredibly fast initially (taking less than 45 seconds to generate), the code was fundamentally production-deficient and would require hours of manual human refactoring to make it safe, accessible, and testable. The rigorous execution took approximately 6 minutes total, including running the plan phase and executing unit tests. However, the end-to-end delivery time was vastly superior because the resulting code required zero manual bug-fixing rounds.