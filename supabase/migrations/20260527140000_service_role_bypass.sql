-- Allow the service_role (used by server-side admin scripts) to bypass the
-- profile.role guard. The website itself uses the anon role for reads and the
-- authenticated role for member writes — neither can hit this branch.

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
as $$
begin
  if current_user = 'service_role' then
    return new;
  end if;
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change profile.role; use redeem_invite() for first-time activation';
  end if;
  return new;
end;
$$;
