import options from '../../../src/utils/logger';
import pino from 'pino';

describe('logger.js', () => {
  it('serializer for req must be called', async () => {
    // Arrange:
    const logger = <any> pino({ ...options, enabled: true, prettyPrint: false });
    const req = { headers: {}, connection: {} };
    const res = {};
    const reqSerializer = logger[Symbol.for('pino.serializers')].req(req);
    const msg = 'hello world!';
    jest.spyOn(logger, 'info').mockImplementation(jest.fn);

    // Act:
    logger.info({ req, res }, msg);

    // Assert:
    expect(logger.info).toBeCalled();
    expect(logger.info.mock.calls[0][1]).toEqual(msg);
    expect(reqSerializer.id).toBeString().not.toBeEmpty();
  });
});
