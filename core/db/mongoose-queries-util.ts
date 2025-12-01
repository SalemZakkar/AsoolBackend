import { Query } from "mongoose";

export interface MongooseQuery {
  skip?: number;
  limit?: number;
  total?: boolean;
  data?: boolean;
  conditions?: Record<string, any>;
}

// export function setQueriesFromRequest(
//   query: any,
//   mongoQuery: Query<any, any>
// ): Query<any, any> {
//   const parsed = getQueries(query);

//   if (parsed.skip !== undefined) {
//     mongoQuery = mongoQuery.skip(Number(parsed.skip));
//   }

//   if (parsed.limit !== undefined) {
//     mongoQuery = mongoQuery.limit(Number(parsed.limit));
//   }

//   if (parsed.conditions) {
//     mongoQuery = mongoQuery.find(parsed.conditions);
//   }

//   return mongoQuery;
// }

// export function setQueriesFromParsedQuery(
//   query: MongooseQuery,
//   mongoQuery: Query<any, any>
// ): Query<any, any> {
//   if (query.skip !== undefined) {
//     mongoQuery = mongoQuery.skip(Number(query.skip));
//   }

//   if (query.limit !== undefined) {
//     mongoQuery = mongoQuery.limit(Number(query.limit));
//   }

//   if (query.conditions) {
//     mongoQuery = mongoQuery.find(query.conditions);
//   }
//   return mongoQuery;
// }

export function getQueries(query: any): MongooseQuery {
  const conditions: Record<string, any> = {};
  let skip = query.skip || 0;
  let limit = query.limit || 100;
  let total = query.total ? query.total == "true" : false;
  let data = query.data ? query.data == "true" : true;

  let keys = Object.keys(query);
  keys = keys.filter((e) => !["skip", "limit", "data", "total"].includes(e));
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

  return { skip, limit, conditions, total, data };
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
