import React, { useRef, useState } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FileInfo } from '../../types/file';

interface FileUploadProps {
  onFileSelect: (fileInfo: FileInfo) => void;
  onFileRemove: () => void;
  selectedFile: FileInfo | null;
  accept?: string;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = '.txt,.doc,.docx',
  maxSize = 20 * 1024 * 1024 // 20MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);

    // 检查文件类型
    const fileType = file.type;
    const isValidType = accept.split(',').some(type => {
      const mimeType = type.trim();
      return file.name.toLowerCase().endsWith(mimeType.replace('.', ''));
    });

    if (!isValidType) {
      setError('不支持的文件格式');
      return;
    }

    // 检查文件大小
    if (file.size > maxSize) {
      setError(`文件大小不能超过${maxSize / 1024 / 1024}MB`);
      return;
    }

    // 创建FileInfo对象
    const fileInfo: FileInfo = {
      file,
      name: file.name,
      size: file.size,
      type: fileType,
      uploadTime: new Date().toISOString(),
    };

    onFileSelect(fileInfo);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          {!selectedFile ? (
            <>
              <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
                <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-gray-700 font-medium mb-2">
                {isDragging ? '释放文件以上传' : '拖拽文件到此处或点击上传'}
              </div>
              <div className="text-sm text-gray-500">
                支持 {accept} 格式，最大 {maxSize / 1024 / 1024}MB
              </div>
            </>
          ) : (
            <div className="text-gray-900">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <DocumentIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="font-medium mb-2">{selectedFile.name}</div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="text-sm text-red-600 hover:text-red-500 font-medium"
              >
                移除文件
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <XMarkIcon className="h-5 w-5" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 