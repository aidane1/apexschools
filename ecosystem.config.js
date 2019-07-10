module.exports = {
    apps : [
        {
            name: "apexschools",
            script: "./index.js",
            watch: true,
            env: {
                "NODE_ENV": "production",
            }
        }
    ]
}