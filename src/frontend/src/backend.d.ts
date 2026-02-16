import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type UserId = string;
export interface Plan {
    durationDays: bigint;
    depositAmount: bigint;
    planId: bigint;
    dailyProfit: bigint;
}
export type Time = bigint;
export interface DepositRequest {
    status: Variant_pending_approved_rejected;
    paymentScreenshot: ExternalBlob;
    userId: UserId;
    plan: Plan;
    timestamp: Time;
}
export interface AccountInfo {
    accountHolderName: string;
    paymentChannel: string;
    accountNumber: string;
}
export interface WithdrawalRequest {
    status: Variant_pending_approved_rejected;
    payoutMethod: Variant_jazzCash_easypaisa;
    userId: UserId;
    timestamp: Time;
    accountNumber: string;
    amount: bigint;
}
export type ReferralCode = string;
export interface UserProfile {
    referralCode: ReferralCode;
    balance: bigint;
    referrers: Array<ReferralCode>;
    email: string;
    lastName: string;
    firstName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_jazzCash_easypaisa {
    jazzCash = "jazzCash",
    easypaisa = "easypaisa"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    approveDepositRequest(user: Principal): Promise<void>;
    approveWithdrawalRequest(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canWithdraw(): Promise<boolean>;
    getAllDepositRequests(): Promise<Array<[Principal, DepositRequest]>>;
    getAllWithdrawalRequests(): Promise<Array<[Principal, WithdrawalRequest]>>;
    getAvailableBalance(): Promise<bigint>;
    getAvailablePlans(): Promise<Array<Plan>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepositAccountDetails(): Promise<AccountInfo>;
    getMaximumWithdrawalAmount(): Promise<bigint>;
    getMinimumWithdrawalAmount(): Promise<bigint>;
    getReferralTiers(): Promise<Array<[bigint, bigint]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectDepositRequest(user: Principal): Promise<void>;
    rejectWithdrawalRequest(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDepositRequest(planId: bigint, paymentScreenshot: ExternalBlob): Promise<void>;
    submitWithdrawalRequest(account: string, amount: bigint): Promise<void>;
}
