export class LoggerService {
    private globalParams = {}
    private extraFields: Record<string,string>[] = [];

    constructor(fields: Record<string ,string>[] = []) {
        if (fields.length > 0) this.extraFields = fields;
    }

    public WithFields(...fields: Record<string, string>[]) {
        return new LoggerService(fields);
    }

    public Info(msg: string) {
        console.log(
            JSON.stringify({
                level: 'info',
                message: msg,
                ...this.globalParams,
                ...this.extraFields,
            })
        );
    }

    public Error(err: Error, msg: string) {
        console.error(
            JSON.stringify({
                level: 'error',
                errorName: err.name,
                friendlyMessage: msg,
                ...this.globalParams,
                ...this.extraFields,
            })
        )
    }
}

// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" 
//:status :res[content-length] ":referrer" ":user-agent"

export const RequestLogger = {
    JSONFormatter: (tokens: any, req: any, res: any) => {
        return JSON.stringify({
            'level': 'request',
            'remote-addr': tokens['remote-addr'](req,res),
            'remote-user': tokens['remote-user'](req,res),
            'date': tokens['date'](req,res,'clf'),
            'method': tokens['method'](req,res),
            'url': tokens['url'](req,res),
            'http-version': tokens['http-version'](req,res),
            'status': tokens['status'](req,res),
            'length': tokens.res(req, res, 'content-length'),
            'referrer': tokens['referrer'](req,res),
            'user-agent': tokens['user-agent'](req,res),
        });
    }
}