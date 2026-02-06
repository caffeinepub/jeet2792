import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Trade {
    profitOrLoss: number;
    invest: number;
    timestamp: Time;
    outcome: TradeOutcome;
}
export enum TradeOutcome {
    win = "win",
    loss = "loss"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTradingData(): Promise<{
        trades: Array<Trade>;
        totalLoss: number;
        totalProfit: number;
        target: number;
        capital: number;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordTrade(invest: number, outcome: TradeOutcome): Promise<void>;
    resetTradingData(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setCapital(capital: number): Promise<void>;
    setTargetProfit(target: number): Promise<void>;
}
