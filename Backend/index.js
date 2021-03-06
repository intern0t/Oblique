/**
 *  Copyright (c) 2018, Prashant Shrestha
 *  Document    : index.js
 *  Date        : 2018-04-15
 *  Developer   : Prashant Shrestha (www.prashant.me)
 */

var Express = require("express"),
    app = Express(),
    cors = require("cors"),
    request = require("request-promise"),
    Promise = require("bluebird"),
    bodyParser = require("body-parser"),
    lowdb = require("lowdb"),
    FileSync = require("lowdb/adapters/FileSync"),
    adapter = new FileSync("storage/oblique.json"),
    database = lowdb(adapter),
    morgan = require("morgan"),
    md5 = require("md5"),
    http = require("http"),
    https = require("https"),
    fs = require("fs"),
    helmet = require("helmet"),
    PORT = process.env.PORT || 1338;

// HTTPS Options (Cert Path etc)
const httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/serv.prashant.me/privkey.pem"),
    cert: fs.readFileSync(
        "/etc/letsencrypt/live/serv.prashant.me/fullchain.pem"
    )
};

// Enabling CORS in our Express module.
var allowedDomains = ["http://o.prashant.me", "https://o.prashant.me"];
var corsOptions = {
    origin: (origin, callback) => {
        if (allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback("Not allowed by CORS.", false);
        }
    },
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
};

// Using Morgan to log our requests.
app.use(morgan("dev"));

// Allow only HTTPS or nothing at all.
app.use(helmet());

// Enabling POST data transfer.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Passkey: Default one for now.
 * Domain: s.prashant.me/
 */
const passKey = "pms";
const domain = "http://o.prashant.me/#!";

/**
 * Set Database defaults.
 */
database.defaults({ links: [], count: 0 }).write();

/**
 * Generates two random strings - adjectives + noun, just to give our memory a bit of a twist.
 */
var generateLink = () => {
    return Promise.try(() => {
        var apiLinks = {
            noun:
                "https://nlp.fi.muni.cz/projekty/random_word/run.cgi?language_selection=en&word_selection=nouns&model_selection=norm&length_selection=10&probability_selection=true",
            adjective:
                "https://nlp.fi.muni.cz/projekty/random_word/run.cgi?language_selection=en&word_selection=adjecs&model_selection=norm&length_selection=10&probability_selection=true"
        };

        var generatedParams = "";

        return request(apiLinks["adjective"])
            .then(response => {
                return response.trim();
            })
            .then(withResponse => {
                return request(apiLinks["noun"]).then(_response => {
                    return withResponse + _response.trim();
                });
            })
            .catch(err => {});
    });
};

/**
 * Generate via. timestamp.
 */
var generateTimeStamp = () => {
    return Promise.try(() => {
        return Math.round(new Date().getTime() / 1000);
    })
        .then(timeStamp => {
            return md5(timeStamp)
                .substr(0, 5)
                .toUpperCase();
        })
        .catch(err => {
            throw new Error({
                error: true,
                message: "Couldn't create a shortened md5(timestamp)."
            });
        });
};

/**
 * Check Duplicate Entries.
 */
var checkDuplicates = longLink => {
    return database
        .get("links")
        .find({ oLink: longLink })
        .value();
};

// Main Route
app.get("/", (req, res) => {
    return Promise.try(() => {
        res.json({
            error: false,
            message: "Welcome to the backend of Project Oblique!",
            description:
                "Project Oblique uses LowDB, Express and Promises to shorten long links. Feel free to use it, it's no problem.",
            retention:
                "All the shortened links are cleared at the end of the month. Reason: Just for fun and to save my storage.",
            developer: "Prashant Shrestha"
        });
    });
});

/**
 * Creating a shortened URL using md5(timestamp) [0,5]
 */
app.use("/short", (req, res, next) => {
    return Promise.try(() => {
        if (!req.body.link || !req.body.auth) {
            return false;
        } else {
            return true;
        }
    }).then(isProvided => {
        if (isProvided) {
            if (req.body.auth == passKey) {
                next();
            } else {
                res.json({
                    error: true,
                    message:
                        "Sorry, you aren't allowed to do that." +
                        md5(Math.round(new Date().getTime() / 1000))
                });
            }
        } else {
            res.json({
                error: true,
                message:
                    "Missing vital information required to shorten your URL."
            });
        }
    });
});

app.post("/short", (req, res) => {
    return Promise.try(() => {
        var dbQuery = database
            .get("links")
            .find({ oLink: req.body.link })
            .value();

        if (!dbQuery) {
            return generateTimeStamp();
        } else {
            throw {
                error: true,
                message: "The link you provided already has a shortened link!",
                shortened: domain + dbQuery.nLink
            };
        }
    })
        .then(verifiedShortCode => {
            var newEntry = {
                oLink: req.body.link,
                nLink: verifiedShortCode,
                date: Date.now()
            };
            return newEntry;
        })
        .then(parsedData => {
            if (!parsedData) {
                throw new Error({
                    error: true,
                    message: "There was a problem with parsedData section.."
                });
            } else {
                var dbQuery = database
                    .get("links")
                    .push(parsedData)
                    .write();
                if (dbQuery) {
                    dbQuery = database
                        .get("links")
                        .find({ oLink: req.body.link })
                        .value();
                    res.json({ error: false, link: domain + dbQuery.nLink });
                    database.update("count", n => n + 1).write();
                } else {
                    throw new Error({
                        error: true,
                        message:
                            "There was a problem with executing the write query."
                    });
                }
            }
        })
        .catch(err => {
            if (err.shortened) {
                res.json({
                    error: true,
                    message: err.message,
                    shortened: err.shortened
                });
            } else {
                res.json({ error: true, message: err.message });
            }
        });
});

// Create a new entry.
app.use("/create", cors(allowedDomains), (req, res, next) => {
    return Promise.try(() => {
        if (!req.body.auth || !req.body.link) {
            return false;
        } else {
            return true;
        }
    }).then(isProvided => {
        if (isProvided) {
            // Not need to check for users because passkey is provided.
            // Simply check and verify the passkey.
            if (req.body.auth == passKey) {
                next();
            } else {
                res.json({
                    error: true,
                    message:
                        "The authorization key you provided does not match!"
                });
            }
        } else {
            res.json({
                error: true,
                message:
                    "Please provide all the required authentication details."
            });
        }
    });
});

app.post("/create", cors(allowedDomains), (req, res) => {
    return Promise.try(() => {
        // Before generating, check if an entry with same link already exists.
        var dbQuery = database
            .get("links")
            .find({ oLink: req.body.link })
            .value();

        if (!dbQuery) {
            var linkParam = generateLink();
            return linkParam;
        } else {
            // Get the data and let the user know that link already exists.
            res.json({
                error: true,
                message: "The link you provided already has a shortened link.",
                link: req.body.link,
                shortened: domain + dbQuery.nLink
            });

            throw new Error("Link already exists!");
        }
    })
        .then(link => {
            var newEntry = {
                oLink: req.body.link,
                nLink: link,
                date: Date.now()
            };
            return newEntry;
        })
        .then(parsedData => {
            if (!parsedData) {
                res.json({
                    error: true,
                    message: "There was a problem in parsedData variable!"
                });
            } else {
                var dbQuery = database
                    .get("links")
                    .push(parsedData)
                    .write();

                if (dbQuery) {
                    dbQuery = database
                        .get("links")
                        .find({ oLink: req.body.link })
                        .value();

                    res.json({
                        error: false,
                        link: domain + dbQuery.nLink
                    });
                    // Update the count.
                    database.update("count", n => n + 1).write();
                } else {
                    res.json("Problem");
                }
            }
        })
        .catch(err => {
            console.log(err.message);
        });
});

/**
 * Search and respond.
 */
app.use("/find", cors(allowedDomains), (req, res, next) => {
    return Promise.try(() => {
        if (!req.body.shortLink) {
            res.json({
                error: true,
                message: "Please provide the short link!"
            });
        } else {
            next();
        }
    });
});

app.post("/find", cors(allowedDomains), (req, res) => {
    return Promise.try(() => {
        var dbQuery = database
            .get("links")
            .find({ nLink: req.body.shortLink })
            .value();

        if (!dbQuery) {
            res.json({
                error: true,
                message:
                    "Could not find any short links with the provided short code."
            });
        } else {
            res.json({ error: false, message: dbQuery });
        }
    });
});

/**
 * Get total links in our database.
 */
app.get("/count", cors(allowedDomains), (req, res) => {
    return Promise.try(() => {
        var dbQuery = database.get("count").value();

        if (!dbQuery) {
            res.json({
                error: true,
                message: "There was a problem retrieving total URL count."
            });
        } else {
            res.json({ error: false, message: dbQuery });
        }
    });
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

// Listen at the specified port.
httpServer.listen(PORT, () => {
    console.log("HTTP Server running at *:", PORT);
});

httpsServer.listen(443, () => {
    console.log("HTTPS Server running on port 443");
});
