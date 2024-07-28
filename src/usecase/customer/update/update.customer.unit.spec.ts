import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerUpdateUseCase from "./update.customer.usecase";


const customer = CustomerFactory.createWithAddress("John", new Address("Street", 123, "zip", "City"));

const input = {
    id: customer.id,
    name: "John updated",
    address: {
        street: "Street updated",
        number: 321,
        zip: "zip updated",
        city: "City updated"
    }
};

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}

describe("Unit test for customer update usecase", () => {

    it("should update a customer", async () => {

        const customerRepository = MockRepository();
        const customerUpdateUseCase = new CustomerUpdateUseCase(customerRepository);

        const output = await customerUpdateUseCase.execute(input);

        expect(output).toEqual(input);

    });


});