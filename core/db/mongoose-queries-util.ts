export interface MongooseQuery {
    skip?: number | undefined;
    limit?: number | undefined;
    total?: boolean | undefined;
    data?: boolean | undefined;
    sort?: any;
    conditions?: any;
}

export function getQueries(
    query: any,
    pagination: boolean = true,
    rawFields: string[] = []
): MongooseQuery {
    const conditions: Record<string, any> = {};
    let skip, limit, total, data;
    if (pagination) {
        skip = query.skip || 0;
        limit = query.limit || 100;
        total = query.total ? query.total == "true" : false;
        data = query.data ? query.data == "true" : true;
    }

    let keys = Object.keys(query);
    keys = keys.filter((e) => !["skip", "limit", "data", "total"].includes(e));
    keys.forEach((e) => {
        if (typeof query[e] === "string") {

            conditions[e] = rawFields.includes(e) ? query[e] : {$regex: query[e], $options: "i"};
        }
        if (Array.isArray(query[e])) {
            conditions[e] = {$in: query[e]};
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
    // conditions.sort = {_id : -1};
    return {
        skip: skip,
        limit: limit,
        total: total,
        data: data,
        sort: {_id : -1},
        conditions: conditions,
    };
}

function isObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
