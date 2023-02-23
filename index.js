const path = require("path");
const express = require("express");
// bodyparser is used to access the data in the request
const bp = require("body-parser");
// qrcode package will be used to generate qr code for some text
const qr = require("qrcode");

const app = express();

const PORT = 3000 || process.env.PORT;

// this is needed to tell the browser that we are trying to render ejs files
app.set("view engine", "ejs");
// some boilerplate code necessary to use body parser
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

app.use(express.static(path.join(__dirname, "/public")));

// initial page will be our index.ejs
// res.render automatically looks inside the views folder and that is why we didn't mention it explicitly
app.get("/", (req, res, next) => {
  res.render("index");
});

// posting a request to qrcode backend by passing text and getting the src to qrcode
app.post("/qrcode", (req, res, next) => {
  // the text that we want to convert to qrcode
  const text = req.body.text;

  if (text.length === 0) res.send("Data Empty");

  qr.toDataURL(text, (err, src) => {
    // src is the source to qrcode image
    if (err) console.log("Error occurred");
    else {
      // rendering qrcode.ejs file and also sending the source to the qrcode as parameter
      res.render("qrcode.ejs", { src });
    }
  });
});

// server
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
