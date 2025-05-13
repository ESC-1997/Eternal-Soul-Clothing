declare module 'limiter' {
  export class RateLimiter {
    constructor(options: {
      tokensPerInterval: number;
      interval: string;
    });
    tryRemoveTokens(count: number): Promise<boolean>;
  }
} 