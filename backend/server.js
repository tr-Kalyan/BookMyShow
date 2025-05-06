require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const userRouter = require("./routes/user");
const MovieRouter = require("./routes/movie");
const TheatreRouter = require("./routes/theatre");
const ShowRouter = require("./routes/show");
const BookingRouter = require("./routes/booking.js");
const app = express();
connectDB();
app.use(express.json());

app.set('trust proxy', 1)

//rate-limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes). 100reqs per 900sec
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  
});

app.use(
    helmet({
        xFrameOptions: { action: "deny" },
        contentSecurityPolicy: true,
        hsts: true,
        noSniff: true,
        referrerPolicy: { policy: "same-origin" }
        }
    )
);
app.disable('x-powered-by');
app.use(function (req, res, next) {
	res.header("X-powered-by", "Blood, sweat, and tears")
	next()
})

// Sanitize input to prevent NoSQL injection
function sanitize(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitize(obj[key]); // recursive call
        }
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        }
    }
}

app.use((req, res, next) => {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);
    next();
});

  







app.use("/api", apiLimiter);

app.use("/api/users", userRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/theatres", TheatreRouter);
app.use("/api/shows", ShowRouter);
app.use("/book-show/api/bookings", BookingRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log("server is running on port", process.env.PORT || 8080);
});