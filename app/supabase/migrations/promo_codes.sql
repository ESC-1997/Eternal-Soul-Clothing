-- Clean up existing promo codes and analytics
DELETE FROM promo_analytics;
DELETE FROM promo_codes;

-- Insert LAUNCH20 promo code
INSERT INTO promo_codes (
    code,
    type,
    value,
    min_purchase,
    usage_limit,
    expires_at,
    is_active
) VALUES (
    'LAUNCH20',
    'percentage',
    20.00,
    0.00,
    1000,
    '2025-07-01 23:59:59',
    true
);

-- Verify the setup
SELECT 
    code,
    type,
    value,
    min_purchase,
    usage_limit,
    usage_count,
    is_active,
    expires_at
FROM promo_codes; 