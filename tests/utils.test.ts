import { randomString } from "../src/lib/utils";

describe("Utils", () => {
    describe("randomString", () => {
        describe("given a valid positive number", () => {
            it("should return a random string with as many characters as the numper provided", async () => {
                const number = 6;

                const result = await randomString(number);

                expect(result).toHaveLength(number);
            });
        });
        describe("given 0", () => {
            it("should return an empty string of 0 length", async () => {
                const result = await randomString(0);

                expect(result).toHaveLength(0);
                expect(result).toBe("");
            });
        });
        describe("given a negative number", () => {
            it("should return an empty string of 0 length", async () => {
                const number = -6;

                const result = await randomString(number);

                expect(result).toHaveLength(0);
                expect(result).toBe("");
            });
        });
    });
});
