export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        resolve(reader.result as ArrayBuffer);
      };
  
      reader.onerror = () => {
        reject(new Error('Failed to read file as ArrayBuffer'));
      };
  
      reader.readAsArrayBuffer(file);
    });
}
  
  