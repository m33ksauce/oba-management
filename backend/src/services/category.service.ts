import { CategoryModel } from "../models/models";
import ILogger from "./ilogger.interface";

class CategoryService {
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger.WithFields({ "service": "CatalogService" });
    }

    public getAll(translation: string): Promise<CategoryModel[]> {
        this.logger.Info("Handling request")
        return Promise.resolve([
            new CategoryModel("Old Testament")
        ])
    } 
}

export default CategoryService;
