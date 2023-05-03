import { createParamDecorator, ExecutionContext } from "@nestjs/common";

declare type parsed = 'body' | 'query' | 'request' | 'param' | 'file';
interface customParsedOtion {
  body?: boolean | string | string[] | undefined,
  query?: boolean | string | string[] | undefined,
  request?: boolean | string | string[] | undefined,
  param?: boolean | string | string[],
  file?: boolean | string | string[],
  split?: boolean | parsed[],
}

function getnested(stringNested, data, first = undefined){
  if(!first)first = stringNested;
  if(!Array.isArray(stringNested)) stringNested = stringNested.split('.');
  const shift = stringNested.shift();
  const getData = data[shift];
  return stringNested.length > 0 ? getnested(stringNested, getData, first) : getData;
  ;
}


export const CustomParsedReq = createParamDecorator((option: customParsedOtion, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  let returnData = {body: {}, request: {}, param: {}, file: {}, query: {}};
  if(option?.body){
    if(typeof option.body === 'boolean'){
      if(option.body) returnData.body = req.body;
    }else if(!Array.isArray(option.body)){
      if(option.body) returnData.body = getnested(option.body, req.body);
    }else{
      const arr = {}
      option.body.forEach(x => arr[x] = getnested(x, req.body));
      if(option.body) returnData.body = arr;
    }
  }else{
    delete returnData.body;
  }

  if(option?.query){
    if(typeof option.query === 'boolean'){
      if(option.query) returnData.query = req.query;
    }else if(!Array.isArray(option.query)){
      if(option.query) returnData.query = getnested(option.query, req.query);
    }else{
      const arr = {}
      option.query.forEach(x => arr[x] = getnested(x, req.query));
      if(option.query) returnData.query = arr;
    }
  }else{
    delete returnData.query;
  }

  if(option?.request){
    if(typeof option.request === 'boolean'){
      if(option.request) returnData.request = req.user;
    }else if(!Array.isArray(option.request)){
      if(option.request) returnData.request = getnested(option.request, req.user);
    }else{
      const arr = {}
      option.request.forEach(x => arr[x] = getnested(x, req.user));
      if(option.request) returnData.request = arr;
    }
  }else{
    delete returnData.request;
  }

  if(option?.param){
    if(typeof option.param === 'boolean'){
      if(option.param) returnData.param = req.params;
    }else if(!Array.isArray(option.param)){
      if(option.param) returnData.param = getnested(option.param, req.params);
    }else{
      const arr = {}
      option.param.forEach(x => arr[x] = getnested(x, req.params));
      if(option.param) returnData.param = arr;
    }
  }else{
    delete returnData.param;
  }

  if(option?.file){
    const filesData: any = [];
    if(req.file) filesData[req.file.fieldname] = {...req.file};
    if(req.files) req.files.forEach(x => {
      filesData[x.fieldname] ? filesData[x.fieldname].push(x) : filesData[x.fieldname] = [x];
    });

    if(typeof option.file === 'boolean'){
      if(option.file) returnData.file = filesData;
    }else if(!Array.isArray(option.file)){
      if(option.file) returnData.file = getnested(option.file, filesData);
    }else{
      const arr = {}
      option.file.forEach(x => arr[x] = getnested(x, filesData));
      if(option.file) returnData.file = arr;
    }
  }else{
    delete returnData.file;
  }

  if(option?.split){
    return returnData;
  }else if(Array.isArray(option?.split)){
    const take = {};
    option?.split.forEach(x => {
      take[x] = returnData[x];
      delete returnData[x];
    });
    let hasil = {};
    Object.keys(returnData).forEach(key => hasil = {...hasil, ...returnData[key]});
    return {...hasil, ...take};
  }else{
    let hasil = {};
    Object.keys(returnData).forEach(key => hasil = {...hasil, ...returnData[key]});
    return hasil;
  }
});

