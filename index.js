const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://www.tangoenergy.com/energyplans?marketsegment=Home&postcode=3003"
    );

    let cherioLoader = cheerio.load(data);

    const csrfToken = cherioLoader("meta[name='csrf-token']").attr("content");

    console.log(csrfToken);

    res.status(200).send(csrfToken);
  } catch (err) {
    res.status(501).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
