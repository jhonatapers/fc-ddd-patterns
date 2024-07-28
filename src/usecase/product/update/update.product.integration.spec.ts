import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";

describe("Test update product usecase", () => {

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

    it("should update a product", async () => {

        const product1 = new Product("123", "Product 1", 10);

        const productRepository = new ProductRepository();
        await productRepository.create(product1);

        const usecase = new UpdateProductUseCase(productRepository);

        const input = {
            id: "123",
            name: "Product 1 updated",
            price: 11,
        }

        const output = {
            id: "123",
            name: "Product 1 updated",
            price: 11,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });


});