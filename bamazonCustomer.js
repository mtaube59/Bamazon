const mysql = require("mysql")
const inquirer = require("inquirer")
const columnify = require("columnify")

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
})


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    showDatabase();
});

function showDatabase() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(columnify(res));
        select()
        // connection.end();
    });

    function select() {
        inquirer
            .prompt([{
                name: "select",
                type: "input",
                message: "Select the ID of the item you would like to purchase",
            },
            {
                name: "amount",
                type: "input",
                message: "How many of the Item would you like to buy?"
            }]
            ).then( function (answer){
                // console.log(answer);
                var query = "SELECT * FROM products WHERE ?";
                connection.query(query, {product_id: answer.select},function (err, res) {
                    if (err) throw err;
                    console.log(res[0].product_name);
                    if (res[0].stock_quantity > answer.amount){
                        console.log(res[0].price * answer.amount);
                        var updatedQuantity = res[0].stock_quantity - answer.amount
                        connection.query("UPDATE products SET stock_quantity = " + updatedQuantity + " WHERE product_id = " + res[0].product_id, function (err, res) {
                            if (err) throw err;
                            connection.end()
                            // console.log(res);
                        })
                        
                    }
                    else {
                        console.log("Insufficient quantity!");
                        connection.end()
                    }
                    
                })
                
                
            })


    }

}