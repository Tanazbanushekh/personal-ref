
require("dotenv").config();
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

const spreadsheetId = "17RHOAwPNNlfSyWTL_jfbm-PdCuk8fnNHSlhqk5oY1zs";
const range = "Sheet1!A1";

const conn = new jsforce.Connection({
  loginUrl: "https://login.salesforce.com/",
});
conn.login(
  "tanazbanu.shekh@brave-moose-ao0ars.com",
  "12@Kheriyat12uyUcGX8dSQ4lHXQtvZPiOvmHI",
  function (err, res) {
    if (err) {
      return console.error(err);
    } else {
      conn.query("SELECT Id, Name FROM Lead", function (err, res) {
        if (err) {
          return console.log("error::::", err);
        } else {
          console.log("responde::::", res.records);

          const values = [
            ["ID", "Name"],
            ...res.records.map((records) => [records.Id, records.Name]),
          ];
          console.log(values);
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
        }
      });
    }
  }
);
