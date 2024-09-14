import { sitePermissions } from '../constants';

interface ssl {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
}

interface IStoreTabsObject {
  tabs: {
    id: string;
    title: string;
    url: string;
    favIconUrl: string;
    pinned: boolean;
    active: boolean;
    windowId: number;
    index: number;
    muted: boolean;
    ssl: ssl;
    permissions: typeof sitePermissions;
  }[];
}

export default IStoreTabsObject;
