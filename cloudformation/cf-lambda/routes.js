const AWS = require("aws-sdk");
const uuid = require("uuid");
const express = require("express");
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const router = express.Router();


router.post("/employees", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const mobile = req.body.mobile;
  console.log("userData====================");
  let params = {
    TableName: "EmployeeTable",
    Item: {
      Id:id,
      Name: name,
      Mobile: mobile,
    },
  };
  const userAdded = await DynamoDB.put(params).promise();
  console.log("userAdded====================", userAdded);
  res.json(userAdded);

});

router.get("/getemployees", async (req, res) => {
  const params = {
    TableName: "EmployeeTable",
  };
  const data = await DynamoDB.scan(params, (error, result) => {
    if (error) {
      res.status(400).json({ error: "Error fetching the employees" });
    }
    res.json(result.Items);
  });
});

router.delete("/employees", (req, res) => {
  const id = req.body.id;
 
  const params = {
    TableName: "EmployeeTable",
    Key: {
    Id:id,
    },
  };

  DynamoDB.delete(params, (error) => {
    console.log("id",id)
    console.log("error",error)
    if (error) {
      return res.json({ error: "Could not delete Employee" });
    }
    return res.json({ success: true });
  });
});

router.put("/employees", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const mobile = req.body.mobile;

  const params = {
    TableName: "EmployeeTable",
    Key: {
      Id:id,
    },
    UpdateExpression: "set #Name = :Name, #Mobile = :Mobile",
    ExpressionAttributeNames: { "#Name": "Name", "#Mobile": "Mobile" },
    ExpressionAttributeValues: { ":Name": name, ":Mobile": mobile },
    ReturnValues: "ALL_NEW",
  };

  DynamoDB.update(params, (error, result) => {
    // console.log("bodyuyyuy=======>>>",req.body)
    if (error) {
      console.log("error",error)
      return res.json({ error: "Could not update Employee" });
    }
    return res.json(result);
  });
});

module.exports = router;