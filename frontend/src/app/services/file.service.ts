import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const DEFAULT_FILES_TO_IGNORE = [
  '.DS_Store', // OSX indexing file
  'Thumbs.db', // Windows indexing file
];

// map of common (mostly media types) mime types to use when the browser does not supply the mime type
const EXTENSION_TO_MIME_TYPE_MAP = {
  avi: 'video/avi',
  gif: 'image/gif',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
  png: 'image/png',
  zip: 'application/zip',
};

// This is set as a function so it can be used inside of the .map function
function traverseDirectory(entry) {
  const reader = entry.createReader();
  // Resolved when the entire directory is traversed
  return new Promise(resolveDirectory => {
    const iterationAttempts = [];
    const errorHandler = () => {};
    function readEntries() {
      // According to the FileSystem API spec, readEntries() must be called until
      // it calls the callback with an empty array.
      reader.readEntries(batchEntries => {
        if (!batchEntries.length) {
          // Done iterating this particular directory
          resolveDirectory(Promise.all(iterationAttempts));
        } else {
          // Add a list of promises for each directory entry.  If the entry is itself
          // a directory, then that promise won't resolve until it is fully traversed.
          iterationAttempts.push(
            Promise.all(
              batchEntries.map(batchEntry => {
                if (batchEntry.isDirectory) {
                  return traverseDirectory(batchEntry);
                }
                return Promise.resolve(batchEntry);
              }),
            ),
          );
          // Try calling readEntries() again for the same dir, according to spec
          readEntries();
        }
      }, errorHandler);
    }
    // initial call to recursive entry reader function
    readEntries();
  });
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private BASE_URL = environment.api.url;

  constructor(private http: HttpClient) {}

  shouldIgnoreFile(file) {
    return DEFAULT_FILES_TO_IGNORE.indexOf(file.name) >= 0;
  }

  // copyString(aString) {
  //   return ` ${aString}`.slice(1);
  // }

  // package the file in an object that includes the fullPath from the file entry
  // that would otherwise be lost
  packageFile(file, entry?) {
    let fileTypeOverride = '';
    // handle some browsers sometimes missing mime types for dropped files
    const hasExtension = file.name && file.name.lastIndexOf('.') !== -1;
    if (hasExtension && !file.type) {
      const fileExtension = (file.name || '').split('.').pop();
      fileTypeOverride = EXTENSION_TO_MIME_TYPE_MAP[fileExtension];
    }
    return {
      fileObject: file, // provide access to the raw File object (required for uploading)
      relativePath: entry ? this.getRelativePath(entry.fullPath, file.name) : '/',
      name: file.name,
      size: file.size,
      type: file.type ? file.type : fileTypeOverride,
    };
  }

  formatBytes(bytes: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getRelativePath(fullPath, fileName) {
    return fullPath.slice(0, fullPath.lastIndexOf(fileName));
  }

  getFile(entry) {
    return new Promise(resolve => {
      entry.file(file => {
        resolve(this.packageFile(file, entry));
      });
    });
  }

  handleFilePromises(promises, fileList) {
    return Promise.all(promises).then(files => {
      files.forEach(file => {
        if (!this.shouldIgnoreFile(file)) {
          fileList.push(file);
        }
      });
      return fileList;
    });
  }

  getDataTransferFiles(dataTransfer) {
    const dataTransferFiles = [];
    const folderPromises = [];
    const filePromises = [];

    [].slice.call(dataTransfer.items).forEach(listItem => {
      if (typeof listItem.webkitGetAsEntry === 'function') {
        const entry = listItem.webkitGetAsEntry();

        if (entry) {
          if (entry.isDirectory) {
            folderPromises.push(traverseDirectory(entry));
          } else {
            filePromises.push(this.getFile(entry));
          }
        }
      } else {
        dataTransferFiles.push(listItem);
      }
    });
    if (folderPromises.length) {
      const flatten = array => array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
      return Promise.all(folderPromises).then(fileEntries => {
        const flattenedEntries = flatten(fileEntries);
        // collect async promises to convert each fileEntry into a File object
        flattenedEntries.forEach(fileEntry => {
          filePromises.push(this.getFile(fileEntry));
        });
        return this.handleFilePromises(filePromises, dataTransferFiles);
      });
    } else if (filePromises.length) {
      return this.handleFilePromises(filePromises, dataTransferFiles);
    }
    return Promise.resolve(dataTransferFiles);
  }

  /**
   * This function should be called from both the onDrop event from your drag/drop
   * dropzone as well as from the HTML5 file selector input field onChange event
   * handler.  Pass the event object from the triggered event into this function.
   * Supports mix of files and folders dropped via drag/drop.
   *
   * Returns: an array of File objects, that includes all files within folders
   *   and subfolders of the dropped/selected items.
   */
  getDroppedOrSelectedFiles(event) {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer && dataTransfer.items) {
      return this.getDataTransferFiles(dataTransfer).then(fileList => {
        return Promise.resolve(fileList);
      });
    }
    const files = [];
    const dragDropFileList = dataTransfer && dataTransfer.files;
    const inputFieldFileList = event.target && event.target.files;
    const fileList = dragDropFileList || inputFieldFileList || [];
    // convert the FileList to a simple array of File objects
    for (let i = 0; i < fileList.length; i++) {
      files.push(this.packageFile(fileList[i]));
    }
    return Promise.resolve(files);
  }

  uploadAudioFile(translation, file, parentId) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', file.name);
    formData.append('parent_id', parentId);
    return this.http.post(`${this.BASE_URL}/${translation}/audio/single`, formData, { observe: 'response' });
  }
}
