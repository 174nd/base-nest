import { HttpException } from "@nestjs/common";
import { CrudRequest, JoinOptions } from "@nestjsx/crud";
import { SCondition, QueryFields, QuerySort } from "@nestjsx/crud-request";

export interface generateCrudRequestOption {allow?: QueryFields, exclude?: QueryFields, relations?: JoinOptions};

export function generateCrudRequest(option: generateCrudRequestOption): CrudRequest {
  return {
    parsed: {
        fields: [],
        paramsFilter: [],
        search: {$and:[]},
        filter: [],
        or: [],
        join: [],
        sort: [],
        authPersist: undefined,
        limit: undefined,
        offset: undefined,
        page: undefined,
        cache: undefined,
        includeDeleted: undefined,        
    },
    options: {
        query: option ? { allow: option.allow, exclude: option.exclude, alwaysPaginate: true, join: option.relations } : {alwaysPaginate: true},
        routes: {},
        params: {}
    }
  }
}

export declare interface setQueryOption {
  [tableName: string]: {
    [field: string]: any;
  };
};

export interface ParsedRequestParams {
  sort?: QuerySort[],
  limit?: number;
  offset?: number;
  page?: number;
  cache?: number;
  includeDeleted?: number;
}

export interface setCrudRequestOptions {
  parsed?: ParsedRequestParams,
  query?: SCondition,
  set?: setQueryOption,
  relations?: JoinOptions,
  all?: boolean,
  raw?: boolean,
  allow?: QueryFields,
  exclude?: QueryFields,
}

export function setCrudRequest(crudRequest: CrudRequest, option: setCrudRequestOptions): CrudRequest{
  if(option?.relations) crudRequest.options.query.join = option.relations;
  if(option?.parsed) crudRequest.parsed = {...crudRequest.parsed, ...option.parsed};
  if(option?.query) crudRequest.parsed.search.$and = [option.query, ...crudRequest.parsed.search.$and];
  if(option?.allow) crudRequest.options.query.allow =  option.allow;
  if(option?.exclude) crudRequest.options.query.exclude = option.exclude;
  if(option?.set) {
    Object.keys(option.set).forEach(x => {
        const or = [];
        Object.keys(crudRequest.options.query.join).filter(y => y.split('.').pop() == x).forEach(z => {
          const and = [];
          Object.keys(option.set[x]).forEach(a => {if(option.set[x][a]) and.push({[crudRequest.options.query.join[z]['alias'] + '.' + a]: option.set[x][a]})});
          if(and.length > 0) or.push({$and: and});
        });
        if(or.length > 0) crudRequest.parsed.search.$and = [...crudRequest.parsed.search.$and, {$or: or}];
    });
  }
  return crudRequest;
}

