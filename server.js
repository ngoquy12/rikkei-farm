const http = require("http");
const fs = require("fs");
// Định nghĩa hostname và port
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  // Kiểm tra đường dẫn
  if (req.url === "/" || req.url === "/overview") {
    // Lấy ra dữ liệu trong file data.json
    fs.readFile("./dev-data/data.json", "utf8", (err, data) => {
      if (err) throw err;

      // ép kiểu về type js
      const fruits = JSON.parse(data);

      // lấy ra nội dung cả file cart-template.html
      const cartTemplate = fs
        .readFileSync("./txt/templates/cart-template.html", "utf8")
        .toString();

      // lấy ra nội dung cả file loverview.html
      const overviewTemplate = fs
        .readFileSync("./txt/templates/overview.html", "utf8")
        .toString();

      // gắn giá trị cho component
      const templateHtml = fruits
        .map((fruit) => {
          // mapping các giá trị
          return cartTemplate
            .replace("{{productName}}", fruit.productName)
            .replace("{{image}}", fruit.image)
            .replace("{{price}}", fruit.price.toString())
            .replace("{{quantity}}", fruit.quantity.toString())
            .replace("{{id}}", fruit.id.toString());
        })
        .join("");

      // Nối các component với nhau
      const htmls = overviewTemplate + templateHtml;

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(htmls);
    });
  } else if (req.url.startsWith("/product/")) {
    // Lấy ra id được truyèn sau đường dẫn
    // Giả sử URL là "/product/123", khi chạy đoạn mã này, req.url.split("/") sẽ tách chuỗi URL thành mảng ["", "product", "123"].
    const productId = req.url.split("/")[2]; // lấy ID sản phẩm từ URL

    // Lấy ra dữ liệu trong file data.json
    fs.readFile("./dev-data/data.json", "utf8", (err, data) => {
      // Trả về lỗi nếu trong quá tình lấy data trong file gặp lỗi
      if (err) throw err;

      // Ép kiểu từ json sang kiể dữ liệu của js
      const fruits = JSON.parse(data);

      // Tìm kiếm sản phẩm theo id tìm kiếm với sản phẩm trong db
      const fruit = fruits.find((p) => p.id == productId);

      console.log("fruit", fruit);
      // Trả về trang product.html
      const productTemplate = fs
        .readFileSync("./txt/templates/product.html")
        .toString();
      const html = productTemplate
        .replace("{{productName}}", fruit.productName)
        .replace("{{from}}", fruit.from)
        .replace("{{quantity}}", fruit.quantity)
        .replace("{{price}}", fruit.price)
        .replace("{{nutrients}}", fruit.nutrients)
        .replace("{{description}}", fruit.description);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    });
  } else {
    // Trả về trang 404.html
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Not Found</h1>");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
