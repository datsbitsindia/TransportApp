import { cinfo } from 'simple-color-print';
import util from 'util';

export const PrintEndpointNameMiddleware = (req: any, res: any, next: any) => {
  cinfo("Endpoint called ===> " + req.originalUrl)
  cinfo("Parameters ===> " + util.inspect(req.body, { breakLength: Infinity }))
  next()
}