import express from 'express';
import Logger from '../../../lib/logger';
import { accountView } from './accountsViews';
import Account from '../../../models/Account';
import { RestServerError, RestValidationError } from '../../../lib/rest/errors';

const logger = Logger(module, { customInput: { restEndpoint: '/rest/auth/users' } });
const router = express.Router();

router.post('/register', async (
  req: express.Request, res: express.Response, next: express.NextFunction
): Promise<any> => {
  const body = req?.body;
  if (!body?.email || !body?.username || !body?.password) {
    return next(new ValidationError(new Error('Missing field for register.'),
      'Missing field. Body must include: { email, username, password }'));
  }
  // try {
    // const videoAsset = VideoAsset.create({
      // name: body.source,
      // url: body.hls_url,
      // alternateUrl: body.alternate_url,
      // mp4Url: body.mp4_url,
      // previewUrl: body.preview_url,
    // });
    // // If name conflict error on save, postfix incremented _#
    // try {
      // await videoAsset.save();
    // } catch (error) {
      // await handleQueryError(error, {
        // [QueryConflict]: async () => resolveDuplicateUniqueName(videoAsset, 'name'),
      // });
    // }
    // logger.debug(`New VideoAsset "${videoAsset.name}" created from /v3/mams endpoint.`);
  // } catch (error) {
    // logger.info('Error creating a new VideoAsset in /v3/mams. ', {
      // customInput: { error, requestBody: req?.body },
    // });
    // return next(new RestServerError(error, 'Unable to create new videoAsset. Please contact support.'));
  // }
  return next();
});

export default router;
