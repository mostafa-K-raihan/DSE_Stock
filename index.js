const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const sharePrices = [];

app.get("/", (req, res, next) => {
  axios("https://www.amarstock.com/latest-share-price")
    .then(({ data }) => {
      const $ = cheerio.load(data);
      const table = $(".k-grid-header").find("table").find("tbody").find("tr");
      table.each(function () {
        const rowData = [];
        $(this)
          .find("td")
          .each(function () {
            rowData.push($(this).text());
          });

        sharePrices.push({
          tradingCode: rowData[0],
          ltp: rowData[1],
          percentageChange: rowData[2],
          openPrice: rowData[3],
          highPrice: rowData[4],
          lowPrice: rowData[5],
          closePrice: rowData[6],
          ycp: rowData[7],
          ycpChange: rowData[8],
          trade: rowData[9],
          value: rowData[10],
          volume: rowData[11],
        });
      });

      res.json({ sharePrices });
    })
    .catch(console.log);
});

app.listen(5000, () => console.log("Application is listening on port 5000!"));
