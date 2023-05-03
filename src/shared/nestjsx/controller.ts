import { ArgumentMetadata, Get, HttpCode, Injectable, Type, ValidationPipe, ValidationPipeOptions, UseInterceptors, UsePipes, Post, Patch, Param, Delete, Body, Req } from "@nestjs/common";
import { CrudRequest, CrudRequestInterceptor, ParsedRequest } from "@nestjsx/crud";
import { CustomParsedReq } from "src/helper/parsedRequest";
import { setQueryOption } from "./helper";
import { CustomService } from "./service";
import CustomEntity from "./entity";



@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: { body?: Type; query?: Type; param?: Type; custom?: Type; }
  ) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }

    return super.transform(value, { ...metadata, metatype: targetType });
  }
}



export function CustomControllerFactory({insert, update, validateId, validateIds}): any {
  const insertDto = new AbstractValidationPipe({ transform: true, validateCustomDecorators: true }, {custom: insert});
  const updateDto = new AbstractValidationPipe({ transform: true, validateCustomDecorators: true }, {param: validateId, custom: update});
  const validateIdDto = new AbstractValidationPipe({ transform: true, validateCustomDecorators: true }, {param: validateId});
  const validateIdsDto = new AbstractValidationPipe({ transform: true, validateCustomDecorators: true }, {body: validateIds});
  class CrudController<T extends CustomEntity>{
    constructor(
      protected service: CustomService<T, T>,
      private set?: setQueryOption,
      private req?: string[] | object | boolean | string | undefined,
    ) {}

    setReq(req){
      return !this.set ? {} : Object.keys(this.set).reduce((r, d1) => {
        r[d1] = Object.keys(this.set[d1]).reduce((r, d2) => {
          r[d2] = req[this.set[d1][d2]];
          return r;
        }, {});
        return r;
      }, {});
    }

    setInsertReq(data, reqUser){
    if(reqUser === undefined){
    }else if(Array.isArray(this.req)){
        Object.keys(reqUser).filter(x => !(this.req as string[]).includes(x)).forEach(x => delete data[x]);
      }else if(typeof this.req === 'object'){
        Object.keys(reqUser).forEach(x => delete data[x]);
        Object.keys(this.req).filter(x => data[this.req[x]] = reqUser[x]);
      }else if(typeof this.req === 'string'){
        delete data[this.req];
      }else{
        if(this.req !== true) Object.keys(reqUser).forEach(x => delete data[x]);
      }
      return data;
    }

    @Get()
    @HttpCode(200)
    @UseInterceptors(CrudRequestInterceptor)
    async geData(@CustomParsedReq({request: true}) req, @ParsedRequest() {parsed}: CrudRequest): Promise<any> {
      return await this.service.getData({parsed, set: this.setReq(req)});
    }

    @Get(':id')
    @HttpCode(200)
    @UsePipes(validateIdDto)
    @UseInterceptors(CrudRequestInterceptor)
    async getOne(@Param() param, @CustomParsedReq({request: true}) req, @ParsedRequest() {parsed}: CrudRequest){
      return await this.service.getOneData({parsed, query: {id: param.id}, set: this.setReq(req)});
    }

    @Post()
    @HttpCode(201)
    @UsePipes(insertDto)
    async createOne(@CustomParsedReq({body: true, request: true}) dto, @Req() reqq) {
      return await this.service.setInsert(this.setInsertReq(dto, reqq.user));
    }

    @Patch(':id')
    @HttpCode(200)
    @UsePipes(updateDto)
    async updateOne(@Param() param, @CustomParsedReq({body: true, request: true, param: ['id']}) dto, @Req() reqq) {
      return await this.service.setUpdate(param.id, {...this.setInsertReq(dto, reqq.user), id: param.id});
    }
    
    @Delete(':id')
    @HttpCode(204)
    @UsePipes(validateIdDto)
    async deleteOne(@Param() param) {
      return await this.service.deleteData({id: param.id});
    }

    @Delete()
    @HttpCode(204)
    @UsePipes(validateIdsDto)
    async deleteBunchData(@Body() body){
      return await this.service.deleteManyData({id: {$in: body.id}});
    }

  }

  return CrudController;
}