import * as express from 'express';
import { GetAppConfig } from '../../../config';
import { LoggerService } from '../../../services/logger.service';
import ReleaseService from '../../../services/release.service';
import * as semver from 'semver';
import AWSStore from '../../../store/s3.store';
import CategoryService from '../../../services/category.service';
import { NIL as uuidNIL } from 'uuid';
import { SqlStore } from '../../../store/sql.store';
import { TranslationService } from '../../../services/translation.service';
import { ReleaseModel, CategoryChild, ChildItemType, AudioChild, AudioEntry } from '../../../models/release.model';
import { ReadCategoryDTO } from '../../../dto/dto';
import { orderBy } from 'natural-orderby';
import AudioService from '../../../services/audio.service';
import CognitoGuards from '../../../guards/cognitoauth.guard';
const cors = require('cors');

const ReleaseController = express.Router();

const store = new AWSStore();
const sqlStore = new SqlStore();
const logger = new LoggerService();
const audioSvc = new AudioService(store, logger, sqlStore);
const releaseSvc = new ReleaseService(store, logger);
const categorySvc = new CategoryService(logger, sqlStore);
const translationSvc = new TranslationService(logger, sqlStore);
const config = GetAppConfig();

const corsConfig = process.env.ENV == 'prod' ? { origin: 'https://projects.oralbible.app' } : { origin: true };

// releaseController.get("/", (req: express.Request, res: express.Response) => {
//     const translation = res.locals.translation;

//     releaseSvc.findAll(translation)
//         .then(data => res.json(data))
//         .catch(() => res.sendStatus(500))
// });

ReleaseController.get('/:id', cors({ origin: '*' }), (req: express.Request, res: express.Response) => {
  const translation = res.locals.translation;
  const version = req.params.id;

  releaseSvc
    .findOne(translation, version)
    .then(release => {
      res.json(release);
    })
    .catch(() => res.sendStatus(500));
});

ReleaseController.post('/', cors(corsConfig), (req: express.Request, res: express.Response) => {
  if (config.env != 'dev') return res.sendStatus(401);
  const translation = res.locals.translation;
  const dto = req.body;
  releaseSvc.insert(translation, dto);
  releaseSvc.update(translation, 'latest', dto);
  return res.json({ Status: 'success' });
});

ReleaseController.post(
  '/generate',
  cors(corsConfig),
  CognitoGuards.canUseTranslationGuard,
  async (req: express.Request, res: express.Response) => {
    const translationName = res.locals.translation;

    const translation = await translationSvc.find(translationName);
    console.log('found it');

    let nextVer = semver.inc(translation.LatestVersion, 'patch');

    if (nextVer === null) nextVer = '0.0.1';

    let newRelease: ReleaseModel = {
      Version: nextVer ? nextVer : '',
      Categories: [],
      Audio: [],
    };

    let allCats = await categorySvc.find(translationName);

    console.log('found it');
    let result = await Promise.all(allCats.filter(cat => cat.parent_id == uuidNIL).map(cat => hydrate(cat, allCats)));

    console.log('found it');

    let releaseCats = result.flatMap(res => res[0]);
    let audios = result.flatMap(res => res[1]);

    newRelease.Categories = releaseCats;
    newRelease.Audio = audios;

    res.json(newRelease);
  },
);

async function hydrate(category: ReadCategoryDTO, allCats: ReadCategoryDTO[]): Promise<[CategoryChild, AudioEntry[]]> {
  console.log(`trying ${category.name}`);
  let resultEntries: AudioEntry[] = [];
  let children = orderBy(
    await Promise.all(
      allCats
        .filter(cat => cat.parent_id == category.id)
        .map(async cat => {
          let [childCats, childAudio] = await hydrate(cat, allCats);
          resultEntries.push(...childAudio);
          return childCats;
        }),
    ),
    c => c.name,
  );

  console.log(`hydrated ${category.name}`);

  let audioFiles: AudioChild[] = (await audioSvc.findByParent(category.id)).map(file => {
    return {
      type: ChildItemType.Audio,
      name: file.name,
      audioTargetId: file.id,
    };
  });

  resultEntries.push(
    ...(audioFiles.map(f => {
      return { id: f.audioTargetId, file: f.name };
    })),
  );

  console.log(`returning ${category.name}`);

  return [
    {
      type: ChildItemType.Categroy,
      name: category.name,
      children: [...children, ...audioFiles],
    },
    resultEntries,
  ];
}

ReleaseController.put('/:id', cors(corsConfig), async (req: express.Request, res: express.Response) => {
  if (config.env != 'dev') return res.sendStatus(401);
  const translation = res.locals.translation;
  const version = req.params.id;
  const dto = req.body;
  await releaseSvc.update(translation, version, dto);
  return res.json({ Status: 'success' });
});

ReleaseController.delete('/:id', cors(corsConfig), async (req: express.Request, res: express.Response) => {
  if (config.env != 'dev') return res.sendStatus(401);
  const translation = res.locals.translation;
  const version = req.params.id;
  releaseSvc.delete(translation, version);
  return res.status(200);
});

export default ReleaseController;
