import { database } from "./datasource";
import { beginTransaction } from "./utils/beginTransaction";

export const transactionDerive = async (ctx: { request: Request }) => {
  const method = ctx.request.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const trx = await beginTransaction(database);
    return {
      db: trx,
      commit: async () => trx.commit(),
      rollback: async () => trx.rollback(),
    };
  }
  return {
    db: database,
    commit: async () => {},
    rollback: async () => {},
  };
};
