import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { FileInfo } from '../types/index';

interface FileUploadProps {
  selectedFile: FileInfo | null;
  onFileSelect: (fileInfo: FileInfo) => void;
  onFileRemove: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  selectedFile,
  onFileSelect,
  onFileRemove,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.size > 20 * 1024 * 1024) {
      alert('文件大小不能超过20MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('仅支持PDF、Word和文本文件');
      return;
    }

    const fileInfo: FileInfo = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadTime: new Date().toISOString()
    };

    onFileSelect(fileInfo);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 字节';
    const k = 1024;
    const sizes = ['字节', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            transition-colors duration-200 ease-in-out
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-500'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-lg text-gray-700">
              {isDragActive ? (
                '松开鼠标上传文件'
              ) : (
                '将文件拖放到此处，或点击上传'
              )}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              支持PDF、Word和文本文件，文件大小不超过20MB
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-10 w-10 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={onFileRemove}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 