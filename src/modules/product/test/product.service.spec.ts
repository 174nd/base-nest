import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "../product.controller";
import { ProductService } from "../product.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { MockRepository } from "src/shared/nestjsx/mockRepository";
import { Repository } from "typeorm";


export class JobsMockRepository extends MockRepository<Product> {}


// describe('ProductService', () => {
//   let module: TestingModule;
//   let service: ProductService;
//   // const createDto: Product = {productCode: '', productName: '',  productDescription: ''};
//   // const addressMock: Product = {productCode: '', productName: '',  productDescription: ''};
//   beforeAll(async () => {
//     module = await Test.createTestingModule({
//       providers: [
//         ProductService,
//         { provide: getRepositoryToken(Product), useClass: JobsMockRepository },
//       ],
//     }).compile();

//     service = module.get<ProductService>(ProductService);
//   });


//   describe('acceptJob', () => {
//     it(`should return `, async () => {
//       jest.spyOn(service, rep).mockImplementation(() => undefined);
//       expect(
//         await jobsService.acceptJob(job.id, { serviceProviderId: faker.random.uuid() }),
//       ).toThrow(notFoundMessage('JobType'));
//     });
//   });
// });


describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService, { provide: getRepositoryToken(Product), useClass: JobsMockRepository }]
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
      jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service.insertData({productCode: '123'})).toBeDefined();
  });
});