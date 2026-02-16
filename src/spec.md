# Specification

## Summary
**Goal:** Build the “Earn” app core flows for earning plans, deposit screenshot submission with admin verification, wallet earnings display, withdrawals with limits and balance checks, and referral bonuses.

**Planned changes:**
- Create the app information architecture and navigation for: Plans, Deposit, Wallet/Balance, Withdrawals, Referrals, and Account; show “Earn” prominently and keep all text in English.
- Implement backend plan data and a frontend Plans page that displays the 4 provided plans (deposit, daily profit, duration) consistently.
- Build a Deposit flow that displays deposit details (Tayyab Raza, 03710416136, Easypaisa), lets a user choose a plan, upload a payment screenshot, and submit a deposit request with statuses (Pending/Approved/Rejected); show request status in the UI.
- Implement plan activation and daily earnings accrual once a deposit is approved; show active plan details and accrued earnings-to-date in Wallet/Balance (capped by plan duration).
- Build Withdrawals: form with amount, account number, and method dropdown (Easypaisa/JazzCash), enforce min 100 and max 5000 on frontend and backend, store requests with statuses, and prevent withdrawals exceeding available balance.
- Implement referrals: per-user referral code/link with copy button, track referred signups, count only referrals with active plans for tier evaluation, grant each tier bonus at most once (3=>150, 5=>300, 10=>800, 50=>4000), and display referral stats and earned tiers.
- Add admin-only workflow (admin list configurable in code) to review pending deposit (with screenshot preview) and withdrawal requests and approve/reject; approving deposits activates plans and approving withdrawals reduces available balance.
- Apply a consistent finance/earning dashboard visual theme across pages (avoid default blue/purple) and add generated static branding images stored under `frontend/public/assets/generated` and referenced directly in the frontend.

**User-visible outcome:** Users can browse plans, submit a deposit with a screenshot for manual approval, see an active plan and accrued earnings in their wallet, request withdrawals within limits, share a referral link to earn tiered bonuses, and admins can approve/reject deposits and withdrawals inside the app.
