const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

const tokenScrapper = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto(
      "https://www.tangoenergy.com/energyplans?marketsegment=Home&postcode=3003"
    );

    const returnedCookie = await page.cookies();

    const token = returnedCookie.filter((data) => {
      return data.name === "token";
    });

    return token[0].value;
  } catch (error) {
    console.log("Error", error);
  }
};

app.get("/", async (req, res) => {
  try {
    let tokenResponse = {};

    const recievedToken = await tokenScrapper();

    tokenResponse = { token: recievedToken };

    const { data } = await axios.get(
      "https://www.tangoenergy.com/energyplans?marketsegment=Home&postcode=3003"
    );

    let cherioLoader = cheerio.load(data);

    const csrfToken = cherioLoader("meta[name='csrf-token']").attr("content");

    tokenResponse = { ...tokenResponse, "csrf-token": csrfToken };

    res.status(200).send(tokenResponse);
  } catch (err) {
    res.status(501).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
