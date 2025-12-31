import { log } from "node:console";

export interface MongooseQuery {
  skip?: number | undefined;
  limit?: number | undefined;
  total?: boolean | undefined;
  data?: boolean | undefined;
  sort?: any;
  conditions?: any;
}

interface MongooseQueryOptions {
  raw?: boolean;
  manual?: (data: any) => any;
  newName?: string;
}

export function getMongooseQueries(input: {
  query: any;
  pagination?: boolean;
  options?: Record<string, MongooseQueryOptions>;
}): MongooseQuery {
  if (input.pagination == undefined || input.pagination === undefined) {
    input.pagination = true;
  }
  if (input.options == undefined || input.options === undefined) {
    input.options = {};
  }
  const conditions: Record<string, any> = {};
  let skip, limit, total, data;
  if (input.pagination) {
    skip = input.query.skip || 0;
    limit = input.query.limit || 100;
    total = input.query.total ? input.query.total == "true" : false;
    data = input.query.data ? input.query.data == "true" : true;
  }

  let keys = Object.keys(input.query);
  keys = keys.filter((e) => !["skip", "limit", "data", "total"].includes(e));
  keys.forEach((e) => {
    let desName = input.options![e]?.newName || e;
    if (input.options![e]) {
      if (input.options![e].raw) {
        conditions[desName] = input.query[e];
      return;
      }
      if (input.options![e].manual) {
        conditions[desName] = input.options![e].manual(input.query[e]!);
      return;
      }
    }
    if(typeof input.query[e] === "string"){
      conditions[desName] = {$regex: input.query[e], $options: "i"};
      return;
    }
    if (Array.isArray(input.query[e])) {
      conditions[desName] = { $in: input.query[e] };
      return;
    }
    if (isObject(input.query[e])) {
      let oKeys = Object.keys(input.query[e]);
      if (!conditions[desName]) {
        conditions[desName] = {};
      }
      oKeys.forEach((e2) => {
        conditions[desName]["$" + e2] = input.query[e][e2];
      });
    }
  });
  // conditions.sort = {_id : -1};
  return {
    skip: skip,
    limit: limit,
    total: total,
    data: data,
    sort: { _id: -1 },
    conditions: conditions,
  };
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
