-- Create coupon types enum
CREATE TYPE public.coupon_type AS ENUM ('public', 'individual');

-- Create discount types enum
CREATE TYPE public.discount_type AS ENUM ('percentage', 'fixed');

-- Create commission fee status enum
CREATE TYPE public.fee_status AS ENUM ('pending', 'paid', 'cancelled');

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  coupon_type coupon_type NOT NULL,
  individual_user_name TEXT,
  individual_user_mobile TEXT,
  min_order_value NUMERIC DEFAULT 0,
  max_uses INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT individual_coupon_check CHECK (
    (coupon_type = 'individual' AND individual_user_name IS NOT NULL AND individual_user_mobile IS NOT NULL)
    OR (coupon_type = 'public')
  )
);

-- Create coupon usage tracking table
CREATE TABLE public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_mobile TEXT NOT NULL,
  order_value NUMERIC NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_public_coupon_per_mobile UNIQUE (coupon_id, user_mobile)
);

-- Create commission and fees table
CREATE TABLE public.commission_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_type TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  invoice_number TEXT UNIQUE,
  description TEXT,
  party_name TEXT NOT NULL,
  status fee_status DEFAULT 'pending',
  due_date DATE,
  paid_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_fees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Admin and moderators can view all coupons"
  ON public.coupons FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Admin and moderators can create coupons"
  ON public.coupons FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Admin and moderators can update coupons"
  ON public.coupons FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Admin can delete coupons"
  ON public.coupons FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for coupon usage
CREATE POLICY "Admin and moderators can view coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

CREATE POLICY "Admin and moderators can record coupon usage"
  ON public.coupon_usage FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'moderator'::app_role)
  );

-- RLS Policies for commission fees
CREATE POLICY "Admin and finance can view all commission fees"
  ON public.commission_fees FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'finance'::app_role)
  );

CREATE POLICY "Admin and finance can create commission fees"
  ON public.commission_fees FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'finance'::app_role)
  );

CREATE POLICY "Admin and finance can update commission fees"
  ON public.commission_fees FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin'::app_role) OR
    public.has_role(auth.uid(), 'finance'::app_role)
  );

CREATE POLICY "Admin can delete commission fees"
  ON public.commission_fees FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_type ON public.coupons(coupon_type);
CREATE INDEX idx_coupons_active ON public.coupons(is_active);
CREATE INDEX idx_coupon_usage_mobile ON public.coupon_usage(user_mobile);
CREATE INDEX idx_commission_fees_status ON public.commission_fees(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for commission_fees
CREATE TRIGGER update_commission_fees_updated_at
  BEFORE UPDATE ON public.commission_fees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();