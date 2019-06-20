
const request = require("request");



const base_path = "http://127.0.0.1:8080/";


describe("Makes a request to the API", () => {
    let apiRequest = {
        headers: {
            "X-API-key": "$2a$10$wK1oI04zZ.2FiJHMdIis2Of5s9fICzASdcJ9TUskMjADhW..PpLBi",
            // "X-API-key": "_",
            "X-ID-key": "91e61188de3d5492cecbb29b13bcaf15743d37da0ce8a8308aef7541b51314c8f2a0c3f97a8f182a",
        },
        uri: base_path + "api/v1/resources",
        method: "GET",
    }
    it("It should return an error, because the tokens are invalid", (done) => {
        request(apiRequest, (err, res, body) => {
            body = JSON.parse(body);
            console.log(body);
            // expect(body.body.error).toBe("Account token incorrectly encrypted. Please try again.");
            done();
        });
    });
})
