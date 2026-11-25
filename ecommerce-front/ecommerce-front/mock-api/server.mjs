// API de prueba (SOLO para desarrollo/demo cuando no tengas Laravel corriendo).
// Uso: npm run mock-api  → http://localhost:8000/api
import http from "node:http";

const products = [
  { id: 1, name: "Audífonos inalámbricos", description: "Cancelación de ruido y 30 horas de batería.", price: 79.9, stock: 12, image_url: null },
  { id: 2, name: "Teclado mecánico", description: "Switches rojos, retroiluminado, formato 75%.", price: 59.0, stock: 8, image_url: null },
  { id: 3, name: "Mouse ergonómico", description: "Sensor de 16 000 DPI, 6 botones programables.", price: 34.5, stock: 20, image_url: null },
  { id: 4, name: "Monitor 27\" QHD", description: "Panel IPS, 144 Hz, ideal para trabajo y juegos.", price: 289.0, stock: 5, image_url: null },
  { id: 5, name: "Webcam Full HD", description: "1080p a 60 fps con micrófono integrado.", price: 45.0, stock: 0, image_url: null },
  { id: 6, name: "Hub USB-C 7 en 1", description: "HDMI 4K, lector SD, 3 USB-A y carga de 100 W.", price: 39.99, stock: 30, image_url: null },
];
const users = new Map(); // email -> {id,name,email,password}
const tokens = new Map(); // token -> email
const orders = []; // {id,email,total,status,created_at,items}

const send = (res, code, body) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};
const readBody = (req) =>
  new Promise((ok) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => { try { ok(JSON.parse(d || "{}")); } catch { ok({}); } });
  });
const userFrom = (req) => {
  const t = (req.headers.authorization || "").replace("Bearer ", "");
  return tokens.get(t);
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const path = url.pathname.replace(/^\/api/, "");
    const body = req.method === "POST" ? await readBody(req) : {};

    if (req.method === "POST" && path === "/register") {
      const { name, email, password, password_confirmation } = body;
      const errors = {};
      if (!name) errors.name = ["El nombre es obligatorio."];
      if (!email) errors.email = ["El correo es obligatorio."];
      else if (users.has(email)) errors.email = ["Este correo ya está registrado."];
      if (!password || password.length < 8) errors.password = ["Mínimo 8 caracteres."];
      else if (password !== password_confirmation) errors.password = ["Las contraseñas no coinciden."];
      if (Object.keys(errors).length) return send(res, 422, { message: "Datos inválidos", errors });
      users.set(email, { name, email, password });
      const token = crypto.randomUUID();
      tokens.set(token, email);
      return send(res, 201, { token, user: { name, email } });
    }

    if (req.method === "POST" && path === "/login") {
      const u = users.get(body.email);
      if (!u || u.password !== body.password) return send(res, 401, { message: "Credenciales incorrectas" });
      const token = crypto.randomUUID();
      tokens.set(token, u.email);
      return send(res, 200, { token, user: { name: u.name, email: u.email } });
    }

    if (req.method === "GET" && path === "/products") return send(res, 200, { data: products });

    const pm = path.match(/^\/products\/(\d+)$/);
    if (req.method === "GET" && pm) {
      const p = products.find((x) => x.id === +pm[1]);
      return p ? send(res, 200, { data: p }) : send(res, 404, { message: "Producto no encontrado" });
    }

    // Rutas protegidas
    const email = userFrom(req);
    if (path.startsWith("/orders") && !email) return send(res, 401, { message: "No autenticado" });

    if (req.method === "GET" && path === "/orders") {
      return send(res, 200, { data: orders.filter((o) => o.email === email).reverse() });
    }

    if (req.method === "POST" && path === "/orders") {
      const items = [];
      for (const l of body.items ?? []) {
        const p = products.find((x) => x.id === l.product_id);
        if (!p) return send(res, 422, { message: `Producto ${l.product_id} no existe` });
        if (p.stock < l.quantity) return send(res, 422, { message: `Stock insuficiente para ${p.name}` });
        items.push({ product_id: p.id, quantity: l.quantity, price: p.price, product: { name: p.name } });
      }
      if (!items.length) return send(res, 422, { message: "La orden no tiene productos" });
      const order = {
        id: orders.length + 1, email, status: "pending",
        total: +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2),
        created_at: new Date().toISOString(), items,
      };
      orders.push(order);
      return send(res, 201, { data: order });
    }

    const pay = path.match(/^\/orders\/(\d+)\/pay$/);
    if (req.method === "POST" && pay) {
      const o = orders.find((x) => x.id === +pay[1] && x.email === email);
      if (!o) return send(res, 404, { message: "Orden no encontrada" });
      if (!body.payment_method) return send(res, 422, { message: "Falta el método de pago" });
      o.status = "paid";
      o.items.forEach((i) => { products.find((p) => p.id === i.product_id).stock -= i.quantity; });
      return send(res, 200, { data: o, message: "Pago exitoso" });
    }

    send(res, 404, { message: "Ruta no encontrada" });
  })
  .listen(8000, () => console.log("Mock API en http://localhost:8000/api"));
