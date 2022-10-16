const config = {
    env: process.env.ENV,
    aws: {
        apiVersion: "2006-03-01",
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_KEY_ID,
            secretAccessKey: process.env.AWS_KEY_SECRET,
        },
        endpoint: {
            host: process.env.AWS_ENDPOINT_HOST,
            port: process.env.AWS_ENDPOINT_PORT,
        },
        rejectUnauthorized: false,
    },
    Buckets: {
        DEFAULT_BUCKET: `app.oralbible.api`
    }
}

export default config;