import React, { useRef, useState } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FileInfo } from '../../types/index';

interface FileUploadProps {
  onFileSelect: (fileInfo: FileInfo) => void;
  onFileRemove: () => void;
  selectedFile: FileInfo | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件拖放
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
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

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    setError('');

    // 检查文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('请上传PDF、Word或文本文件');
      return;
    }

    // 检查文件大小（最大20MB）
    if (file.size > 20 * 1024 * 1024) {
      setError('文件大小不能超过20MB');
      return;
    }

    // 创建文件预览
    const reader = new FileReader();
    reader.onload = () => {
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        preview: reader.result as string,
        type: file.type,
        size: file.size,
        uploadTime: new Date().toISOString()
      };
      onFileSelect(fileInfo);
    };
    reader.readAsDataURL(file);
  };

  // 获取文件大小的可读格式
  const getFileSize = (size: number): string => {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 获取文件类型的显示文本
  const getFileType = (type: string): string => {
    switch (type) {
      case 'application/pdf':
        return 'PDF文件';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word文档';
      case 'text/plain':
        return '文本文件';
      default:
        return '未知类型';
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
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
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <div className="text-center">
            <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              拖放文件到这里，或点击上传
            </p>
            <p className="text-sm text-gray-500">
              支持 PDF、Word、文本文件（最大20MB）
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DocumentIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-800 font-medium">{selectedFile.file.name}</p>
                <p className="text-sm text-gray-500">
                  {getFileType(selectedFile.type)} · {getFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload; 