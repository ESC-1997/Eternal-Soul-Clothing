import { supabase } from '../supabaseClient';
import { RateLimiter } from 'limiter';

// Rate limiter: 5 attempts per minute per IP
const rateLimiter = new Map<string, RateLimiter>();

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  customerId?: string;
}

export class PromoCodeService {
  private static getRateLimiter(ip: string): RateLimiter {
    if (!rateLimiter.has(ip)) {
      rateLimiter.set(ip, new RateLimiter({ tokensPerInterval: 5, interval: 'minute' }));
    }
    return rateLimiter.get(ip)!;
  }

  static async validateCode(code: string, subtotal: number, ip: string, customerId?: string): Promise<{ discount: number; couponId: string }> {
    // Check rate limit
    const limiter = this.getRateLimiter(ip);
    const hasToken = await limiter.tryRemoveTokens(1);
    if (!hasToken) {
      throw new Error('Too many attempts. Please try again later.');
    }

    // Get promo code from database
    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !promoCode) {
      throw new Error('Invalid promo code');
    }

    // Validate promo code
    if (!promoCode.is_active) {
      throw new Error('This promo code is no longer active');
    }

    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      throw new Error('Promo code has expired');
    }

    if (promoCode.usage_limit && promoCode.usage_count >= promoCode.usage_limit) {
      throw new Error('Promo code has reached its usage limit');
    }

    if (promoCode.min_purchase && subtotal < promoCode.min_purchase) {
      throw new Error(`Minimum purchase amount of $${promoCode.min_purchase} required`);
    }

    if (promoCode.customer_id && promoCode.customer_id !== customerId) {
      throw new Error('This promo code is not available for your account');
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.type === 'percentage') {
      discount = (subtotal * promoCode.value) / 100;
      if (promoCode.max_discount) {
        discount = Math.min(discount, promoCode.max_discount);
      }
    } else {
      discount = promoCode.value;
    }

    return {
      discount,
      couponId: promoCode.id,
    };
  }

  static async markPromoCodeAsUsed(promoCodeId: string): Promise<void> {
    const { error } = await supabase
      .from('promo_codes')
      .update({ usage_count: supabase.rpc('increment_usage_count') })
      .eq('id', promoCodeId);

    if (error) {
      throw new Error('Failed to update promo code usage');
    }
  }

  static async createPromoCode(data: Omit<PromoCode, 'id' | 'usageCount'>, createdBy: string): Promise<PromoCode> {
    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .insert({
        ...data,
        created_by: createdBy,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to create promo code');
    }

    return promoCode;
  }

  static async getPromoCodes(filters?: {
    isActive?: boolean;
    customerId?: string;
  }): Promise<PromoCode[]> {
    let query = supabase.from('promo_codes').select('*');

    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch promo codes');
    }

    return data;
  }

  static async updatePromoCode(id: string, data: Partial<PromoCode>): Promise<PromoCode> {
    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Failed to update promo code');
    }

    return promoCode;
  }

  static async deletePromoCode(id: string): Promise<void> {
    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Failed to delete promo code');
    }
  }
} 