
DROP POLICY "Anyone places order" ON public.orders;
CREATE POLICY "Anyone places order" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  length(customer_name) BETWEEN 1 AND 120
  AND length(customer_email) BETWEEN 3 AND 200
  AND length(customer_phone) BETWEEN 5 AND 30
  AND length(address) BETWEEN 3 AND 500
  AND length(city) BETWEEN 1 AND 100
  AND total > 0
  AND total < 100000000
  AND payment_method IN ('cod','stripe','jazzcash','easypaisa')
  AND status = 'pending'
);
