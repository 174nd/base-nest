import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { generateCrudRequest, generateCrudRequestOption, setCrudRequest, setCrudRequestOptions } from "./helper";
import { createReadStream, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { createFileWithBase64 } from "src/helper/base64";
import { DeepPartial, Repository } from "typeorm";
import { SCondition } from "@nestjsx/crud-request";
import { GetManyDefaultResponse } from "@nestjsx/crud";
import { HttpException } from "@nestjs/common";
import CustomEntity from "./entity";


declare type fileLocation = string;
declare type ServicefileLocation = {
  [fileObjectName: string]: fileLocation;
};


export class CustomService<T extends CustomEntity, V> {
  public nestjsx = new TypeOrmCrudService<T>(this.repo);
  constructor(
    public repo/* : Repository<T> */,
    protected relations?: generateCrudRequestOption,
    protected files?: ServicefileLocation | fileLocation[]
  ){}

  async setFiles(set: {
    dto?  : T | object;
    data? : T | object;
  }){
    if(this.files){
      if(Array.isArray(this.files)){
        for(const x of this.files){
          if(set.dto && set.dto[x] && (!set.data || (set.data && set.data[x] != set.dto[x]))) set.dto[x] = await createFileWithBase64(set.dto[x]);
          if((!set.dto || (set.dto && set.dto[x])) && set.data && set.data[x]){
            const path = join(process.cwd(), 'files', set.data[x]);
            if(existsSync(path)) await unlinkSync(path);
          }
        }
      }else{
        for(const x of Object.keys(this.files)){
          if(set.dto && set.dto[x] && (!set.data || (set.data && set.data[x] != set.dto[x]))) set.dto[x] = await createFileWithBase64(set.dto[x], this.files[x]);
          if((!set.dto || (set.dto && set.dto[x])) && set.data && set.data[x]){
            const path = join(process.cwd(), this.files[x], set.data[x]);
            if(existsSync(path)) await unlinkSync(path);
          }
        }
      }
    }
    return set.dto;
  }

  async insertData(dto: DeepPartial<T>): Promise<V>{
    const data = await this.repo.save(this.repo.create(await this.setFiles({dto})));
    return await this.getOneData({query: {id: data.id}});
  }

  async insertManyData(dto: Array<DeepPartial<T>>): Promise<V[]>{
    const data = [];
    for(const x of dto) data.push(await this.setFiles({dto: x}));
    const rett = await this.repo.save(this.repo.create(data), {transaction: false});
    return await this.getData({query: {id: {$in: rett.reduce((r,d) => {r.push(d.id); return r;}, [])}}}).then(x => x.data);
  }

  async updateData(find: SCondition, dto: DeepPartial<T>): Promise<V>{
    const data = await this.getOneData({raw: true, query: find}) as T;
    await this.repo.update(data.id, {id: data.id, ...await this.setFiles({dto, data})});
    return await this.getOneData({query: find});
  }

  async updateManyData(dto: Array<DeepPartial<T>>): Promise<V[]>{
    const id = [];
    Promise.all(dto.map(async x => {
      await this.repo.update({id: x.id}, this.repo.create(x));
      id.push(x.id);
    }));
    return await this.getData({query: {id: {$in: id}}}).then(x => x.data);
  }

  async deleteData(find: SCondition): Promise<V>{
    const data = await this.getOneData({query: find});
    if(data) await this.repo.remove(this.setDeleteData(data));
    return data;
  }

  async deleteManyData(find: SCondition): Promise<V[]>{
    const data = await this.getData({allow: ['id'], relations: this.relations.relations, query: find});
    await this.repo.remove(this.setDeleteManyData(data.data));
    return data.data;
  }

  async getData(options?: setCrudRequestOptions): Promise<GetManyDefaultResponse<V>>{
    return await this.nestjsx.getMany(setCrudRequest(generateCrudRequest(this.relations), options)).then(x => {return {...x, data: options?.raw || (options && 'relations' in options) ? x['data'] : x['data'].reduce((r,d) => {
      r.push(this.setData(d));
      return r;
    }, [])}}) as GetManyDefaultResponse<V>;
  }

  async getOneData(options?: setCrudRequestOptions): Promise<V> {
    return await this.nestjsx.getMany(setCrudRequest(generateCrudRequest(this.relations), options)).then(x => {
      const data = x['data'].shift();
      return data !== undefined ? (options?.raw || (options && 'relations' in options) ? data : this.setData(data)): undefined;
    });
  }

  async getOneDataOrFail(options?: setCrudRequestOptions): Promise<V> {
    return options?.raw || (options && 'relations' in options) ? await this.nestjsx.getOne(setCrudRequest(generateCrudRequest(this.relations), options)) : this.setData(await this.nestjsx.getOne(setCrudRequest(generateCrudRequest(this.relations), options)));
  }

  setData(dto){return dto}
  setInsertData(dto){return dto}
  setUpdateData(dto){return dto}
  setDeleteData(dto){return dto}
  setDeleteManyData(dto){return dto}

  async setInsert(dto: T): Promise<V>{
    return await this.insertData(this.setInsertData(dto));
  }
  async setUpdate(id: number, dto: T): Promise<V>{
    return await this.updateData({id: id}, this.setUpdateData(dto));
  }

  async setDelete(id: number): Promise<V>{
    return await this.deleteData({id: id});
  }

  async setDeleteMany(id: number[]): Promise<V[]>{
    return await this.deleteManyData({id: {$in: id}});
  }

  async streamFiles(fileSource, entity) {
    const path = join(process.cwd(), this.files[entity] ?? 'files', fileSource);
    if (fileSource && existsSync(path)) return path;
    throw new HttpException('file not found', 404);
  }

  async downloadFiles(fileSource, entity) {
    const path = join(process.cwd(), this.files[entity] ?? 'files', fileSource);
    if (fileSource && existsSync(path)) return createReadStream(path);
    throw new HttpException('file not found', 404);
  }

  setSync(){}
}