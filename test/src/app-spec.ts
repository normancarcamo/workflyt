import app from '../../src/app';

describe('app.js', () => {
  it('should be a function', () => {
    expect(app).toBeFunction();
  });
  it('should option "x-powered-by" be set as false', () => {
    expect(app.get('x-powered-by')).toBeFalse();
  });
  it('should have a function called listen', () => {
    expect(app.listen).toBeFunction();
  });
  it('should be able to start a http server', async () => {
    let fnClose = jest.fn();
    let fnListen = jest.fn((x:any):any => ({ close: fnClose }));
    jest.spyOn(app, 'listen').mockImplementation(fnListen);
    let server = app.listen(30001);
    server.close();
    expect(fnListen).toBeCalledWith(30001);
    expect(fnClose).toBeCalled();
  });
});
