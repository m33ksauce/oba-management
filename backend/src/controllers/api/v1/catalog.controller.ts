import * as express from "express";
import { LoggerService } from "../../../services/logger.service";
import CategoryService from "../../../services/category.service";
import { SqlStore } from "../../../store/sql.store";
import { NIL as uuidNIL } from "uuid";
import { CatalogAudioDTO, CatalogCategoryDTO, ReadCategoryDTO } from "../../../dto/dto";
import { orderBy } from 'natural-orderby';

const CatalogController = express.Router();

const logger = new LoggerService();
const sqlStore = new SqlStore();
const categoryService = new CategoryService(logger, sqlStore);

CatalogController
    .get("/", async (req: express.Request, res: express.Response) => {
        const translation = res.locals.translation;
        try {
          let result = await categoryService.find(translation);

          let categoryModel = result
            .filter(cat => cat.parent_id == uuidNIL)
            .map(cat => populateChildren(cat, result));

          return res.json({status: "success", result: categoryModel});
        } catch (e) {
          res.statusCode = 500;
          return res.json({status: "failure", msg: "failed"})
        }
    });

function populateChildren(category: ReadCategoryDTO, allCats: ReadCategoryDTO[]): CatalogCategoryDTO|CatalogAudioDTO {
  let children = orderBy(
    allCats
      .filter(cat => cat.parent_id == category.id)
      .map(cat => populateChildren(cat, allCats)),
    c => c.name
    )

  if (category.target == undefined || category.target == "") {
    return {
      id: category.id,
      name: category.name,
      parent_id: category.parent_id,
      children: children
    }
  }
  
  return {
    id: category.id,
    name: category.name,
    parent_id: category.parent_id,
    target: category.target
  }
}

export default CatalogController;
