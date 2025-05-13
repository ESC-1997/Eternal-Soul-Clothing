-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL NOT NULL,
    min_purchase DECIMAL,
    max_discount DECIMAL,
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    customer_id UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id)
);

-- Create promo_analytics table
CREATE TABLE IF NOT EXISTS promo_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    promo_code_id UUID REFERENCES promo_codes(id),
    order_id TEXT,
    customer_id UUID REFERENCES auth.users(id),
    discount_amount DECIMAL NOT NULL,
    original_amount DECIMAL NOT NULL,
    final_amount DECIMAL NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversion_status TEXT CHECK (conversion_status IN ('pending', 'completed', 'abandoned')),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_customer_id ON promo_codes(customer_id);
CREATE INDEX IF NOT EXISTS idx_promo_analytics_promo_code_id ON promo_analytics(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_analytics_customer_id ON promo_analytics(customer_id);
CREATE INDEX IF NOT EXISTS idx_promo_analytics_created_at ON promo_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_promo_analytics_conversion_status ON promo_analytics(conversion_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
    BEFORE UPDATE ON promo_codes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to safely increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN usage_count + 1;
END;
$$ LANGUAGE plpgsql; 