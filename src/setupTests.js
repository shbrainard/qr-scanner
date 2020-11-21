import 'jest-dom/extend-expect'

global.Airtable = {
  configure: jest.fn(),
  base: jest.fn(),
}
