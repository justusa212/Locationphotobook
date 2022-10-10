import "reflect-metadata";
import Cors from "micro-cors"
import { NextApiRequest } from "next";
import { ApolloServer } from "apollo-server-micro";
import { schema } from "src/schema";
import { Context } from "src/schema/context";
import { prisma } from "src/prisma";
import { loadIdToken } from "src/auth/firebaseAdmin";

const server = new ApolloServer({
  schema,
  context: async ({ req }: { req: NextApiRequest }): Promise<Context> => {
    const uid = await loadIdToken(req);

    return {
      uid,
      prisma,
    };
  },
});

const cors = Cors();
const startServer = server.start();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cors(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.end();
      return false;
    }
  
    await startServer;
    await server.createHandler({ path: "/api/graphql" })(req, res);
  });

