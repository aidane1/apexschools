const request = require("request");

const base_url = "http://127.0.0.1:8080/";

describe("Hello world server", () => {
    describe("GET /api/v1/users", () => {
        it("returns an object where the okay param is yes", () => {
            request.get(base_url + "api/v1/users/", (err, res, body) => {
                expect(body).toBe({"yeee": "gottem"});
                // done();
            });
        });
    });
});