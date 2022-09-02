// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = window as any;
const envSettings = win._env_;

export class Config {
  static REACT_APP_API_URL = envSettings.REACT_APP_API_URL;

  static REACT_APP_USERNAME = envSettings.REACT_APP_USERNAME;

  static REACT_APP_PASS = envSettings.REACT_APP_PASS;

  static REACT_APP_FILESIZE = envSettings.REACT_APP_FILESIZE;

  static REACT_APP_API_KEY = envSettings.REACT_APP_API_KEY;

  static REACT_APP_DEFAULT_COMPANY_BPN = envSettings.REACT_APP_DEFAULT_COMPANY_BPN;

  static REACT_APP_CLIENT_ID = envSettings.REACT_APP_CLIENT_ID;
}