/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectToFormData(obj: Record<string, any>, rootName?: string, ignoreList?: string[]): FormData {
  const formData = new FormData();

  function appendFormData(data: any, root = '') {
    if (!ignoreList?.includes(root)) {
      if (data instanceof File) {
        formData.append(root, data);
      } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          appendFormData(data[i], root);
        }
      } else if (typeof data === 'object' && data) {
        if (data instanceof Map) {
          data = Object.fromEntries(data);
        }
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData.append(root, data);
        }
      }
    }
  }

  appendFormData(obj, rootName);

  return formData;
}
