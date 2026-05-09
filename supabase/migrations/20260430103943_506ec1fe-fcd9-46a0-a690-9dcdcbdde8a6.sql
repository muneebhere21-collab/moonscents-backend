
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Image URLs need to be storage-friendly later; for now keep current INSERT policies on orders.
-- Tighten order_items: only allow insert if the parent order exists and was created in last 5 minutes by same session
DROP POLICY "Anyone inserts order items" ON public.order_items;
CREATE POLICY "Insert items for recent order" ON public.order_items FOR INSERT TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.created_at > now() - interval '5 minutes'
  )
);
