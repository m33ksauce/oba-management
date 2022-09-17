const config = {
    env: process.env.ENV,
    s3: {
        apiVersion: "2006-03-01",
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_KEY_SECRET,
        },
    },
    Buckets: {
        DEFAULT_BUCKET: `app.oralbible.api`
    }
}

export default config;