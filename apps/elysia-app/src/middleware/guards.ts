import { supabase } from "../shared/utils/supabase";

// Helper to combine guards
const pipe = (guards: Function[], condition: "OR" | "AND" = "AND") => {
  return async (...args: any[]) => {
    const result = await Promise.all(guards.map((guard) => guard(...args)));
    let allowed = true;
    if (condition === "OR")
      allowed = result.some((guard) => guard === undefined);
    if (condition === "AND")
      allowed = result.every((guard) => guard === undefined);
    if (!allowed) throw new Error("Unauthorized");
  };
};

export const AND = (...guards: Function[]) => pipe(guards);
export const OR = (...guards: Function[]) => pipe(guards, "OR");
export const INVERSE = (fn: Function) => {
  return (...args: any[]) => {
    if (!fn(...args)) return new Response("Unauthorized", { status: 401 });
  };
};

// Example guards
export const isServiceRole = ({ user }: { user: any }) => {
  if (user.role !== "service_role") return false;
};

export const isAuthenticate = ({ user }: { user: any }) => {
  if (user.aud !== "authenticated") return false;
};

export const isCompanyAdmin = async ({ user }: { user: any }) => {
  if (!user?.company) throw new Error("Unauthorized");
  const { data: result, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", user.company.id);
  if (error || !result.length) throw new Error("Unauthorized");
};
