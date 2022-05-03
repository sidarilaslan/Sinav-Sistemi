const { request } = require('express');
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
    // await pool.connect().then((result) => {

    //     if (result.connected) {
    //         result.request().query('SELECT * FROM okul', (err, result) => {
    //             if (err)
    //                 console.log(err);
    //             else {
    //                 return result.recordset;
    //             }
    //         })
    //     }
    // });

    // AYRIM BURADA
    // try {
    //     let x = await pool.connect();
    //     let user = await x.request().query('SELECT * FROM tblUser');
    //     return user.recordsets;
    // }
    // catch (err) {
    //     console.log(err);

    // }

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