const {
  createISODateString,
  FORMATS,
} = require('../business/utilities/DateHandler');
const { getTimestampSchema } = require('./dateSchema');

describe('joi validation of ISO-8601 timestamps', () => {
  const schema = getTimestampSchema();

  it(`validates ISO string generated by DateHandler which uses format ${FORMATS.ISO}`, () => {
    const isoTimestamp = createISODateString(); // matches desired FORMATS.ISO
    const results = schema.validate(isoTimestamp);
    expect(results.error).toBeUndefined();
  });

  it(`validates ISO string which uses format ${FORMATS.YYYYMMDD}`, () => {
    const shortIsoTimestamp = '2020-05-04';
    const results = schema.validate(shortIsoTimestamp);
    expect(results.error).toBeUndefined();
  });

  describe('identifies as invalid a list of date formats which conform to ISO-8601 but are not valid for our application', () => {
    const iso8601Invalid = [
      // '2020-05-03', // TODO: this will soon become invalid also.
      '2020-05-04T19:40:23+00:00',
      '20200504T194023Z',
      '2020-W19',
      '2020-W19-1',
      '--05-04',
      '2020068',
      '2020-05-04 24:00:00:00.000',
      '20130208T080910.123',
      '2013-02-08 09:30:26.123+07',
    ];
    for (const isoExample of iso8601Invalid) {
      it(`detects ${isoExample} as invalid`, () => {
        const result = schema.validate(isoExample);
        expect(result.error.toString()).toMatch('ValidationError');
      });
    }
  });
});
