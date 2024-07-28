import ListProductsUseCase from "./list.product.usecase";


const product1 = {
    id: "123",
    name: "Product 1",
    price: 10,
}

const product2 = {
    id: "223",
    name: "Product 2",
    price: 20,
}

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test list products usecase", () => {

    it("should list a products", async () => {

        const input = {};

        const productRepository = MockRepository();

        const usecase = new ListProductsUseCase(productRepository);

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