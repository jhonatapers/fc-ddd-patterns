import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress("John Doe", new Address("street 1", 1, "12345", "city 1"));
const customer2 = CustomerFactory.createWithAddress("Jane Doe", new Address("street 2", 2, "12345", "city 2"));

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test for listing customer usecase", () => {

    it("should list a customers", async () => {

        const repository = MockRepository();
        const useCase = new ListCustomerUseCase(repository);
        const output = await useCase.execute({})
        expect(output.customers.length).toBe(2)
        expect(output.customers[0].id).toBe(customer1.id)
        expect(output.customers[1].id).toBe(customer2.id)

    });

});