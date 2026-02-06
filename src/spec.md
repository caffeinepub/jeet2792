# Specification

## Summary
**Goal:** Build the “jeet2792” trading calculator with a consistent theme, win/loss trade recording using a fixed 1.98x payout, real-time stats, history, reset, and per-user persistence via Internet Identity.

**Planned changes:**
- Create an app shell with a coherent visual theme applied across screens/components (English UI; avoid blue/purple as primary palette).
- Add inputs to set/edit current trading capital and target profit with inline validation for numeric values.
- Implement trade entry with invest amount (including quick-select presets: ₹1, ₹10, ₹50, ₹100, ₹200, ₹500, ₹1,000, ₹2,000, ₹5,000, ₹10,000) and outcome selection limited to Win/Loss.
- Apply fixed calculations: Win → profit = invest * 0.98, return = invest * 1.98; Loss → loss = invest; display currency values rounded to 2 decimals.
- Maintain and display real-time dashboard metrics: current capital, total profit, total loss, and target remaining = max(targetProfit - totalProfit, 0).
- Add trade history (timestamp, invest, outcome, profit/loss) and a reset-all mechanism that requires confirmation.
- Persist per-authenticated-user data (capital, target, totals, history) on the Internet Computer using Internet Identity; allow unauthenticated session-only usage with a prompt/option to sign in for persistence.

**User-visible outcome:** Users can set capital and a target profit, record win/loss trades via preset or manual invest amounts, see capital/profit/loss/target remaining update instantly, review trade history, reset with confirmation, and (when signed in) have all data saved and restored across reloads.
