const Sheetlist = require("./sheets");
const express = require("express");
const router = express.Router();
var jsforce = require("jsforce");
const { JWT } = require("google-auth-library");

//googleapis
const { google } = require("googleapis");

const auth = new JWT({
  keyFile: "salesforce-data-380812-2e462310dbce.json", //the key file
  //url to spreadsheets API
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({
  version: "v4",
  auth,
});

const spreadsheetId = Sheetlist.Sheetlist.SPREADSHEETID1;
const spreadsheetId2 = Sheetlist.Sheetlist.SPREADSHEETID2;
const range = "Sheet1!A1";
// const range1 = "Sheet2!A1";

const conn = new jsforce.Connection({
  loginUrl: "https://login.salesforce.com/",
});

router.get("/getLeadData", (req, resp) => {
  // console.log("Sheets", Sheetlist.Sheetlist.SPREADSHEETID2);
  conn.login(
    "tanazbanu.shekh@brave-moose-ao0ars.com",
    "12@Kheriyat121QFrmrKDuatsWItRoExbX3rf",
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
              }, {});
              console.log("leadsByOwner", leadsByOwner);

              const integratedArray = {};
              const tArray = {};

              for (const key in leadsByOwner) {
                console.log("key", key);
                if (key === "Integration User0052w00000G0j56AAB") {
                  integratedArray[key] = leadsByOwner[key];
                } else if (key === "Tanazbanu Shekh0052w00000G3Sb5AAF") {
                  console.log("in if");
                  tArray[key] = leadsByOwner[key];
                }
              }

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
                ...integratedArray["Integration User0052w00000G0j56AAB"].map(
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
                  spreadsheetId,
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

              const values2 = [
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
                    values: values2,
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
              console.log("tArray", tArray);
              resp.send(res);
            } else {
              return resp.send(err);
            }
          }
        );
      } else {
        // console.log("err");
        return console.error(err);
      }
    }
  );
});

module.exports = router;
