import UpdateProductUseCase from "./update.product.usecase";

describe("Unit test update product usecase", () => {

    const MockRepository = () => {
        return {
            find: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        }
    }

    it("should update a product", async () => {

        const input = {
            id: "123",
            name: "Product 1 updated",
            price: 11,
        };

        const productRepository = MockRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const output = {
            id: "123",
            name: "Product 1 updated",
            price: 11,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
    });


})