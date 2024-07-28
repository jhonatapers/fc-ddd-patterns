import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductsUseCase from "./list.product.usecase";

describe("Test find product use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {

        const product1 = new Product("123", "Product 1", 10);
        const product2 = new Product("223", "Product 2", 20);

        const productRepository = new ProductRepository();
        await productRepository.create(product1);
        await productRepository.create(product2);

        const usecase = new ListProductsUseCase(productRepository);

        const input = {}

        const output = {
            products: [{
                id: "123",
                name: "Product 1",
                price: 10,
            },
            {
                id: "223",
                name: "Product 2",
                price: 20,
            }]
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);

    });


});