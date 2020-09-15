import { getKeys } from "./DataStorage";

/**
 * Function that export the keys (download a json file)
 */
export function exportKeys() {
  const filename = "keys.json";
  const contentType = "application/json;charset=utf-8;";
  const keys = getKeys();
  if (!keys) throw new Error("Keys not found");
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    const blob = new Blob([decodeURIComponent(encodeURI(keys))], {
      type: contentType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement("a");
    a.download = filename;
    a.href = `data:${contentType},${encodeURIComponent(
      JSON.stringify(JSON.parse(keys))
    )}`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/**
 * Function that import the keys (upload a document)
 */
export function importKeys(certificateFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // const certificateFile = e.target.files[0];
    let filename = certificateFile.name;
    const regExpWhiteSpace = new RegExp(" ", "g");
    filename = filename.replace(regExpWhiteSpace, "_");
    const indexExt = filename.lastIndexOf(".");
    let ext = "";
    if (indexExt > 0) {
      ext = filename.substring(indexExt + 1);
    }
    if (ext.toUpperCase() === "JSON") {
      const reader = new FileReader();
      reader.onload = function onLoadFunction() {
        let dataInBase64 = reader.result;
        if (typeof dataInBase64 !== "string")
          throw new Error("error reading data keys");
        // Delete the "data:application/json;base64"
        dataInBase64 = dataInBase64.substring(dataInBase64.indexOf(",") + 1);
        resolve(dataInBase64);
      };
      reader.readAsDataURL(certificateFile);
    } else {
      reject(new Error("Invalid extension. Please upload a JSON file."));
    }
  });
}

export default { exportKeys, importKeys };
