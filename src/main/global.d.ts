type Store = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  delete: (key: string) => void;
};
