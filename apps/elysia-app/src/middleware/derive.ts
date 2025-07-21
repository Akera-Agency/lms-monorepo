import jwt from "jsonwebtoken";
import { supabase } from "../shared/utils/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getUser = async (
  supabaseClient: SupabaseClient,
  { request: { headers } }: { request: Request }
) => {
  try {
    if (!headers) throw new Error("");
    let bearer = headers.get("Authorization");
    if (!bearer) throw new Error("Authorization header is missing");
    const token = bearer?.replace("Bearer ", "").replaceAll('"', "");
    const decodedToken = jwt.verify(token, process.env.SUPABASE_JWT as string);
    const user = decodedToken;
    if (typeof user === "string") throw new Error("User is not an object");
    let extendedUser = {};
    if (user.sub) {
      const { data, error } = await supabaseClient
        .from("users")
        .select("*, company:companies!users_company_id_fkey(*)")
        .eq("id", user.sub)
        .single();
      if (error) throw error;
      extendedUser = data;
    }
    return {
      user: {
        ...user,
        ...extendedUser,
      },
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
