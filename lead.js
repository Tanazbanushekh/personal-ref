const Sheetlist = require("./sheets");
require("dotenv").config();
const express = require("express");
const router = express.Router();
var jsforce = require("jsforce");
const { JWT } = require("google-auth-library");

//googleapis
const { google } = require("googleapis");

const auth = new JWT({
  keyFile: process.env.KEYFILE, //the key file
  //url to spreadsheets API
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const sheets = google.sheets({
  version: "v4",
  auth,
});

const spreadsheetId = Sheetlist.Sheetlist.SPREADSHEETID1;
const spreadsheetId2 = Sheetlist.Sheetlist.SPREADSHEETID2;
const range = "Sheet1!A1";
const range1 = "Sheet2!A1";

const conn = new jsforce.Connection({
  loginUrl: "https://login.salesforce.com/",
});

router.get("/getLeadData", (req, resp) => {
  // console.log("Sheets", Sheetlist.Sheetlist.SPREADSHEETID2);
  conn.login(
    process.env.LOGINID,
    process.env.LOGINPASSWORD,
    function (err, res) {
      if (!err) {
        conn.query(
          "SELECT Id, FirstName, LastName, Email, Owner.Name ,OwnerId, CreatedDate FROM Lead",
          function (err, res) {
            if (!err) {
              const leadsByOwner = res.records.reduce((result, lead) => {
                const ownerId = lead.Owner.Name + lead.OwnerId;
                if (!result[ownerId]) {
                  result[ownerId] = [];
                }
                result[ownerId].push(lead);
                return result;
              });

              const integratedArray = {};
              const tArray = {};

              for (const key in leadsByOwner) {
                if (key === "Integration User0052w00000G0j56AAB") {
                  integratedArray[key] = leadsByOwner[key];
                  const values1 = [
                    [
                      "Id",
                      "FirstName",
                      "LastName",
                      "Email",
                      "Owner.Name",
                      "OwnerId",
                      "CreatedDate",
                    ],
                    ...integratedArray[
                      "Integration User0052w00000G0j56AAB"
                    ].map((records) => [
                      records.Id,
                      records.FirstName,
                      records.LastName,
                      records.Email,
                      records.Owner.Name,
                      records.OwnerId,
                      records.CreatedDate,
                    ]),
                  ];
                  sheets.spreadsheets.values.update(
                    {
                      spreadsheetId,
                      range,
                      valueInputOption: "USER_ENTERED",
                      resource: {
                        values: values1,
                      },
                    },
                    (err, res) => {
                      if (err) {
                        console.log("sheet error", err);
                      } else {
                        // console.log("sheet responce", res);
                      }
                    }
                  );
                } else if (key === "Tanazbanu Shekh0052w00000G3Sb5AAF") {
                  tArray[key] = leadsByOwner[key];

                  const values = [
                    [
                      "Id",
                      "FirstName",
                      "LastName",
                      "Email",
                      "Owner.Name",
                      "OwnerId",
                      "CreatedDate",
                    ],
                    ...tArray["Tanazbanu Shekh0052w00000G3Sb5AAF"].map(
                      (records) => [
                        records.Id,
                        records.FirstName,
                        records.LastName,
                        records.Email,
                        records.Owner.Name,
                        records.OwnerId,
                        records.CreatedDate,
                      ]
                    ),
                  ];
                  sheets.spreadsheets.values.update(
                    {
                      spreadsheetId: spreadsheetId2,
                      range,
                      valueInputOption: "USER_ENTERED",
                      resource: {
                        values,
                      },
                    },
                    (err, res) => {
                      if (err) {
                        console.log("sheet error", err);
                      } else {
                        console.log("sheet responce", res);
                      }
                    }
                  );
                }
              }
              resp.send(res);
            } else {
              return resp.send(err);
            }
          }
        );
      } else {
        return console.error(err);
      }
    }
  );
});

module.exports = router;
