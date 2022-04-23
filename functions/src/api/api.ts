import * as express from "express";

const apiRouter = express.Router();

apiRouter.get('/releases', (req, res) => {
    var version = req.query.version;
    res.json({Status: "good", version: version});
})

export default apiRouter;