var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazondb"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  
});
viewiventory()

function start(){
    inquirer.prompt([{
        type: "list",
        choices: ["Order again", "Close"],
        name: "start",
        message: "Select your menu option"
    }, ]).then(function(user) {
        if (user.start === "Order again") {
          viewiventory()

            
        } if (user.start === "Close"){
          connection.end(function(err) {
            // The connection is terminated now
          });
        }

    })
}


function viewiventory() {
connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    console.log("Current Inventory:")
    for (var i=0; i<results.length;i++){
        console.log("Item ID: "+ results[i].itemid)
        console.log("Item Name: "+ results[i].productname)
        console.log("Category: "+ results[i].departmentname)
        console.log("Price: $"+ results[i].price)
        console.log("Number in Stock: "+ results[i].quantity)
        console.log("")
        
    }
    inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What would you like to order? Please enter the item ID",
       },
      {
        name: "quantity",
        type: "input",
        message: "How many would you to order?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
        var ItemSelection;
        for (var i = 0; i < results.length; i++) {
          if (results[i].itemid == answer.item) {
            ItemSelection = results[i];
            
          }
          }
        

        if (ItemSelection.quantity>answer.quantity){
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    quantity: ItemSelection.quantity-answer.quantity
                  },
                  {
                    itemid: ItemSelection.itemid
                  }
                ],
                function(err) {
                  if (err) throw err;
                  console.log("Your order was created successfully!");
                  console.log(answer.quantity +"x $"+ ItemSelection.price +" "+ItemSelection.productname)
                  console.log("Your total is $"+ (answer.quantity * ItemSelection.price))
                  console.log("")
                  start()
        
        
        
              
                 
                })
        } else {
      console.log("Sorry! Insufficient stock!")
             return
        }

    }

      )
    });
  }
