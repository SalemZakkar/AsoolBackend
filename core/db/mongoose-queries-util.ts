import { Query } from "mongoose";

export interface MongooseQuery {
  skip?: number;
  limit?: number;
  conditions?: Record<string, any>;
}

export function setQueriesFromRequest(
  query: any,
  mongoQuery: Query<any, any>
): Query<any, any> {
  const parsed = getQueries(query);

  if (parsed.skip !== undefined) {
    mongoQuery = mongoQuery.skip(Number(parsed.skip));
  }

  if (parsed.limit !== undefined) {
    mongoQuery = mongoQuery.limit(Number(parsed.limit));
  }

  if (parsed.conditions) {
    mongoQuery = mongoQuery.find(parsed.conditions);
  }

  return mongoQuery;
}

export function setQueriesFromParsedQuery(
  query: MongooseQuery,
  mongoQuery: Query<any, any>
): Query<any, any> {
  if (query.skip !== undefined) {
    mongoQuery = mongoQuery.skip(Number(query.skip));
  }

  if (query.limit !== undefined) {
    mongoQuery = mongoQuery.limit(Number(query.limit));
  }

  if (query.conditions) {
    mongoQuery = mongoQuery.find(query.conditions);
  }
  return mongoQuery;
}

export function getQueries(query: any): MongooseQuery {
  const conditions: Record<string, any> = {};
  let skip = query.skip;
  let limit = query.limit;

  let keys = Object.keys(query);
  keys = keys.filter((e) => !["skip", "limit"].includes(e));
  keys.forEach((e) => {
    if (typeof query[e] === "string") {
      conditions[e] = query[e];
    }
    if (Array.isArray(query[e])) {
      conditions[e] = { $in: query[e] };
    }
    if (isObject(query[e])) {
      let oKeys = Object.keys(query[e]);
      if (!conditions[e]) {
        conditions[e] = {};
      }
      oKeys.forEach((e2) => {
        if (Array.isArray(query[e][e2]) || typeof query[e][e2] === "string") {
          conditions[e]["$" + e2] = query[e][e2];
        }
      });
    }
  });

  console.log({ skip, limit, conditions });

  return { skip, limit, conditions };
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
