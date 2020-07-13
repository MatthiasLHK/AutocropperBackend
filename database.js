const Pool = require('pg').Pool;

const pool = new Pool({
    user: "MatthiasLHK",
    password: "autocropper123",
    host: "",
    port: 5432,
    database: ""
});

module.exports = pool;
