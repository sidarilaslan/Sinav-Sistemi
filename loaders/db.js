const sql = require('mssql/msnodesqlv8');
const pool = new sql.ConnectionPool({
    database: "dbSinav",
    server: "localhost",
    driver: "msnodesqlv8",
    options: {
        trustServerCertificate: true,
        trustedConnection: true

    }
});


const connectDB = async () => {
    try {
        return (await pool.connect()).request();
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    connectDB
};