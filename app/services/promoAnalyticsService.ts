import { supabase } from '../supabase/client';

export interface PromoAnalytics {
  id: string;
  promo_code_id: string;
  order_id: string;
  customer_id: string;
  discount_amount: number;
  original_amount: number;
  final_amount: number;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  conversion_status: 'pending' | 'completed' | 'abandoned';
  completed_at?: Date;
}

export interface PromoCodeStats {
  totalUses: number;
  totalDiscount: number;
  conversionRate: number;
  averageDiscount: number;
  revenueGenerated: number;
  uniqueCustomers: number;
}

export class PromoAnalyticsService {
  static async trackPromoUsage(
    promoCodeId: string,
    orderId: string,
    customerId: string,
    discountAmount: number,
    originalAmount: number,
    finalAmount: number,
    ipAddress: string,
    userAgent: string
  ): Promise<PromoAnalytics> {
    const { data, error } = await supabase
      .from('promo_analytics')
      .insert({
        promo_code_id: promoCodeId,
        order_id: orderId,
        customer_id: customerId,
        discount_amount: discountAmount,
        original_amount: originalAmount,
        final_amount: finalAmount,
        ip_address: ipAddress,
        user_agent: userAgent,
        conversion_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateConversionStatus(
    analyticsId: string,
    status: 'completed' | 'abandoned'
  ): Promise<void> {
    const { error } = await supabase
      .from('promo_analytics')
      .update({
        conversion_status: status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', analyticsId);

    if (error) throw error;
  }

  static async getPromoAnalytics(promoCodeId: string): Promise<PromoAnalytics[]> {
    const { data, error } = await supabase
      .from('promo_analytics')
      .select('*')
      .eq('promo_code_id', promoCodeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getConversionStats(promoCodeId: string): Promise<{
    total: number;
    completed: number;
    abandoned: number;
    conversionRate: number;
  }> {
    const { data, error } = await supabase
      .from('promo_analytics')
      .select('conversion_status')
      .eq('promo_code_id', promoCodeId);

    if (error) throw error;

    const analyticsData = data as { conversion_status: 'pending' | 'completed' | 'abandoned' }[];
    const stats = {
      total: analyticsData.length,
      completed: analyticsData.filter(d => d.conversion_status === 'completed').length,
      abandoned: analyticsData.filter(d => d.conversion_status === 'abandoned').length,
      conversionRate: 0
    };

    stats.conversionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    return stats;
  }

  static async getPromoCodeStats(promoCodeId: string, startDate?: Date, endDate?: Date): Promise<PromoCodeStats> {
    let query = supabase
      .from('promo_analytics')
      .select('*')
      .eq('promo_code_id', promoCodeId);

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch promo code statistics');
    }

    const analytics = data as PromoAnalytics[];
    const completedAnalytics = analytics.filter(a => a.conversion_status === 'completed');
    const uniqueCustomers = new Set(analytics.map(a => a.customer_id).filter(Boolean)).size;

    return {
      totalUses: analytics.length,
      totalDiscount: analytics.reduce((sum, a) => sum + a.discount_amount, 0),
      conversionRate: analytics.length ? (completedAnalytics.length / analytics.length) * 100 : 0,
      averageDiscount: analytics.length ? 
        analytics.reduce((sum, a) => sum + a.discount_amount, 0) / analytics.length : 0,
      revenueGenerated: completedAnalytics.reduce((sum, a) => sum + a.final_amount, 0),
      uniqueCustomers
    };
  }

  static async getTopPerformingPromoCodes(
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ promoCodeId: string; stats: PromoCodeStats }>> {
    let query = supabase
      .from('promo_analytics')
      .select('promo_code_id, *');

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to fetch top performing promo codes');
    }

    const analytics = data as PromoAnalytics[];
    const promoCodeStats = new Map<string, PromoAnalytics[]>();

    // Group analytics by promo code
    analytics.forEach(a => {
      const existing = promoCodeStats.get(a.promo_code_id) || [];
      promoCodeStats.set(a.promo_code_id, [...existing, a]);
    });

    // Calculate stats for each promo code
    const results = Array.from(promoCodeStats.entries()).map(([promoCodeId, analytics]) => {
      const completedAnalytics = analytics.filter(a => a.conversion_status === 'completed');
      const uniqueCustomers = new Set(analytics.map(a => a.customer_id).filter(Boolean)).size;

      return {
        promoCodeId,
        stats: {
          totalUses: analytics.length,
          totalDiscount: analytics.reduce((sum, a) => sum + a.discount_amount, 0),
          conversionRate: analytics.length ? (completedAnalytics.length / analytics.length) * 100 : 0,
          averageDiscount: analytics.length ? 
            analytics.reduce((sum, a) => sum + a.discount_amount, 0) / analytics.length : 0,
          revenueGenerated: completedAnalytics.reduce((sum, a) => sum + a.final_amount, 0),
          uniqueCustomers
        }
      };
    });

    // Sort by revenue generated and limit results
    return results
      .sort((a, b) => b.stats.revenueGenerated - a.stats.revenueGenerated)
      .slice(0, limit);
  }
} 