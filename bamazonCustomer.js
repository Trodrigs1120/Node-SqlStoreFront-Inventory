var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "44gxYhYftYebvd9fm",
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
    //console.log(results)
    //console.log(results[1].productname)
    for (var i=0; i<results.length;i++){
        console.log("Item ID: "+ results[i].itemid)
        console.log("Item: "+ results[i].productname)
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
        // console.log(results)
        
        var ItemSelection;
        for (var i = 0; i < results.length; i++) {
          if (results[i].itemid == answer.item) {
            ItemSelection = results[i];
            
          }
          }
        
console.log(ItemSelection)
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
                  console.log(""
                +"")
                  start()
        
        
        
              
                 
                })
        } else {
      console.log("Sorry! Insufficient stock!")
             return
        }

    }
      // when finished prompting, insert a new item into the db with that info

      )
    });
  }


// // function which prompts the user for what action they should take
// function start() {
//   inquirer
//     .prompt({
//       name: "postOrBid",
//       type: "rawlist",
//       message: "Would you like to [POST] an auction or [BID] on an auction?",
//       choices: ["POST", "BID"]
//     })
//     .then(function(answer) {
//       // based on their answer, either call the bid or the post functions
//       if (answer.postOrBid.toUpperCase() === "POST") {
//         postAuction();
//       }
//       else {
//         bidAuction();
//       }
//     });
// }

// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid,
//           highest_bid: answer.startingBid
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }

// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
