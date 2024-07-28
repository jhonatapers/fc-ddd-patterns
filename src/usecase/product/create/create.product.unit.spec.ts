import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test create product usecase", () => {

    it("should create a product", async () => {

        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const input = {
            name: "product 1",
            price: 10,
        }

        const output = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });

    });


});