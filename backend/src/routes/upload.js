const express = require('express');
const { createUploadthing, createRouteHandler } = require('uploadthing/express');

const router = express.Router();
const f = createUploadthing();

const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload selesai:", file.url);
    }),
};

router.use(
  "/",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
);

module.exports = router;