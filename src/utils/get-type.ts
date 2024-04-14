export function getType(fileName: string, isText: boolean): string {
  const extension = fileName.split('.').pop()?.toLowerCase() as string;
  const mimeTypes: { [key: string]: string } = {
    'py': 'python',
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'java': 'java',
    'md': 'markdown',
    'c': 'c',
    'cpp': 'cpp',
  };
  if (isText) {
    mimeTypes[extension]
    if(mimeTypes[extension]){
      return mimeTypes[extension];
    }
    else{
      return 'text';
    }
  }
  else if(extension === 'jpg' || extension === 'jpeg' || extension === 'png'){
    return 'image';
  }
  else if(extension === 'pdf'){
    return 'pdf';
  }
  else{
    return 'unknown';
  }
};