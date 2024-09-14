/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as usb from 'usb';

import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('usb_devices', async (event) => {
  const devices = usb.getDeviceList();

  // Function to get manufacturer and product name
  const getDeviceDetails = (device: usb.Device) => {
    return new Promise((resolve, reject) => {
      try {
        device.open();
        device.getStringDescriptor(
          device.deviceDescriptor.iManufacturer,
          (error, manufacturer) => {
            if (error) {
              device.close();
              return reject(error);
            }
            device.getStringDescriptor(
              device.deviceDescriptor.iProduct,
              (_error, product) => {
                device.close();
                if (_error) {
                  return reject(_error);
                }
                resolve({ manufacturer, product });
              },
            );
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const filteredDevices = await Promise.all(
      devices.map(async (device) => {
        try {
          const { manufacturer, product } = (await getDeviceDetails(
            device,
          )) as {
            manufacturer: string;
            product: string;
          };

          return {
            busNumber: device.busNumber,
            deviceAddress: device.deviceAddress,
            name: product,
            manufacturer,
            deviceDescriptor: device.deviceDescriptor,
            portNumbers: device.portNumbers,
          };
        } catch (error) {
          if (
            error instanceof Error &&
            (error.message.includes('LIBUSB_ERROR_NOT_SUPPORTED') ||
              error.message.includes('LIBUSB_ERROR_IO'))
          ) {
            console.warn(
              `Skipping device ${device.deviceAddress} due to unsupported operation or I/O error.`,
            );
            return null;
          }
          console.error(
            `Error getting details for device ${device.deviceAddress}:`,
            error,
          );
          return null;
        }
      }),
    );

    // Filter out null values and only external USB storage devices (e.g., USB sticks, drives)
    const externalDevices = filteredDevices
      .filter((device) => device !== null)
      .filter((device) => {
        const { bDeviceClass, bDeviceSubClass } = device.deviceDescriptor;
        // Assuming class 8 (Mass Storage) and subclass 6 (SCSI transparent command set) for USB storage devices
        return bDeviceClass === 8 && bDeviceSubClass === 6;
      });

    console.log(externalDevices);
    event.sender.send('usb_devices', { devices: externalDevices });
  } catch (error) {
    console.error('Error processing USB devices:', error);
    event.sender.send('usb_devices', { devices: [] });
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.bootlt/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
