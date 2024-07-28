import ProductModel from "../../product/repository/sequelize/product.model";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should list a products", async () => {


        await ProductModel.create({
            id: "123",
            name: "Product 1",
            price: 10,
        });

        await ProductModel.create({
            id: "124",
            name: "Product 2",
            price: 20,
        });

        const listResponse = await request(app)
            .get("/products")
            .send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);

        const product1 = listResponse.body.products.find((product: { id: string; }) => product.id === "123");
        expect(product1.id).toBe("123");
        expect(product1.name).toBe("Product 1");
        expect(product1.price).toBe(10);

        const product2 = listResponse.body.products.find((product: { id: string; }) => product.id === "124");
        expect(product2.id).toBe("124");
        expect(product2.name).toBe("Product 2");
        expect(product2.price).toBe(20);

    });

});