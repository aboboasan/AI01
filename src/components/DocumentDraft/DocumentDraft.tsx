import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Message } from '../../types/chat';
import { exportToWord } from '../../services/api';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'custom';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  description?: string;
}

const templates: DocumentTemplate[] = [
  {
    id: 'civil-complaint',
    title: '民事起诉状',
    description: '用于向法院提起民事诉讼的法律文书',
    category: '诉讼文书',
    fields: [
      { 
        id: 'court', 
        label: '受理法院', 
        type: 'text', 
        required: true,
        description: '请填写具体的受理法院名称，例如：北京市海淀区人民法院'
      },
      { 
        id: 'plaintiff', 
        label: '原告信息', 
        type: 'textarea', 
        placeholder: '请详细填写原告的基本信息，包括：\n1. 姓名/名称\n2. 性别\n3. 年龄\n4. 民族\n5. 住所地\n6. 联系方式', 
        required: true,
        description: '原告信息要尽可能详细，便于法院送达文书'
      },
      { 
        id: 'defendant', 
        label: '被告信息', 
        type: 'textarea', 
        placeholder: '请详细填写被告的基本信息，包括：\n1. 姓名/名称\n2. 性别\n3. 年龄\n4. 民族\n5. 住所地\n6. 联系方式', 
        required: true,
        description: '被告信息要尽可能详细，便于法院送达文书'
      },
      { 
        id: 'claim', 
        label: '诉讼请求', 
        type: 'custom', 
        required: true,
        description: '请条理清晰地列明你的诉讼请求，每项请求需单独成段'
      },
      { 
        id: 'facts', 
        label: '事实与理由', 
        type: 'custom', 
        required: true,
        description: '请详细说明案件的基本事实和法律依据'
      },
      {
        id: 'evidence',
        label: '证据',
        type: 'custom',
        required: true,
        description: '请列明你准备提交的证据材料清单'
      }
    ]
  },
  {
    id: 'criminal-complaint',
    title: '刑事控告状',
    description: '用于向检察机关提起刑事控告的法律文书',
    category: '刑事文书',
    fields: [
      { 
        id: 'prosecutor', 
        label: '检察院名称', 
        type: 'text', 
        required: true,
        description: '请填写具体的检察院名称，例如：北京市海淀区人民检察院'
      },
      { 
        id: 'complainant', 
        label: '控告人信息', 
        type: 'textarea', 
        required: true,
        placeholder: '请详细填写控告人的基本信息，包括：\n1. 姓名/名称\n2. 性别\n3. 年龄\n4. 民族\n5. 住所地\n6. 联系方式',
        description: '控告人信息要尽可能详细，便于检察机关联系'
      },
      { 
        id: 'accused', 
        label: '被控告人信息', 
        type: 'textarea', 
        required: true,
        placeholder: '请详细填写被控告人的基本信息，包括：\n1. 姓名/名称\n2. 已知的其他信息',
        description: '被控告人信息填写已知信息即可'
      },
      { 
        id: 'crime', 
        label: '涉嫌罪名', 
        type: 'custom', 
        required: true,
        description: '可以填写一个或多个涉嫌的罪名，并说明理由'
      },
      { 
        id: 'details', 
        label: '案件事实', 
        type: 'custom', 
        required: true,
        description: '请按时间顺序详细描述案件发生的经过，注意说明时间、地点、人物、事件等关键信息'
      },
      { 
        id: 'evidence', 
        label: '证据材料', 
        type: 'custom', 
        required: true,
        description: '请列明你准备提交的证据材料清单，包括证人证言、书证、物证等'
      }
    ]
  },
  {
    id: 'labor-arbitration',
    title: '劳动仲裁申请书',
    description: '用于向劳动仲裁委员会申请仲裁的法律文书',
    category: '仲裁文书',
    fields: [
      { 
        id: 'arbitration-committee', 
        label: '仲裁委员会', 
        type: 'text', 
        required: true,
        description: '请填写具体的劳动人事争议仲裁委员会名称'
      },
      { 
        id: 'applicant', 
        label: '申请人信息', 
        type: 'textarea', 
        required: true,
        placeholder: '请详细填写申请人的基本信息，包括：\n1. 姓名\n2. 性别\n3. 出生日期\n4. 身份证号\n5. 住所地\n6. 联系方式',
        description: '申请人信息要尽可能详细，便于送达文书'
      },
      { 
        id: 'respondent', 
        label: '被申请人信息', 
        type: 'textarea', 
        required: true,
        placeholder: '请详细填写被申请人（用人单位）的基本信息，包括：\n1. 单位名称\n2. 统一社会信用代码\n3. 法定代表人\n4. 单位地址\n5. 联系方式',
        description: '被申请人信息要尽可能详细，便于送达文书'
      },
      { 
        id: 'employment-period', 
        label: '劳动关系期间', 
        type: 'custom', 
        required: true,
        description: '请说明劳动关系的起止时间，包括合同签订、续签、解除等关键时间节点'
      },
      { 
        id: 'dispute-type', 
        label: '争议类型', 
        type: 'custom', 
        required: true,
        description: '请详细说明劳动争议的具体类型和内容'
      },
      { 
        id: 'requests', 
        label: '仲裁请求', 
        type: 'custom', 
        required: true,
        description: '请条理清晰地列明你的仲裁请求，每项请求需单独成段'
      },
      { 
        id: 'facts', 
        label: '事实和理由', 
        type: 'custom', 
        required: true,
        description: '请详细说明劳动争议的经过，以及提出仲裁请求的法律依据'
      }
    ]
  },
  {
    id: 'administrative-reconsideration',
    title: '行政复议申请书',
    description: '用于向行政机关申请行政复议的法律文书',
    category: '行政文书',
    fields: [
      { 
        id: 'review-organ', 
        label: '复议机关', 
        type: 'text', 
        required: true,
        description: '请填写具体的行政复议机关名称'
      },
      { 
        id: 'applicant', 
        label: '申请人信息', 
        type: 'textarea', 
        required: true,
        placeholder: '请详细填写申请人的基本信息，包括：\n1. 姓名/名称\n2. 证件类型和号码\n3. 地址\n4. 联系方式\n5. 法定代表人（适用于法人）',
        description: '申请人信息要尽可能详细，便于送达文书'
      },
      { 
        id: 'respondent', 
        label: '被申请人信息', 
        type: 'text', 
        required: true,
        description: '请填写作出具体行政行为的行政机关名称'
      },
      { 
        id: 'decision', 
        label: '具体行政行为', 
        type: 'custom', 
        required: true,
        description: '请详细说明被复议的具体行政行为的内容'
      },
      { 
        id: 'date', 
        label: '行政行为时间', 
        type: 'date', 
        required: true,
        description: '请选择具体行政行为作出的时间'
      },
      { 
        id: 'requests', 
        label: '复议请求', 
        type: 'custom', 
        required: true,
        description: '请条理清晰地列明你的复议请求，每项请求需单独成段'
      },
      { 
        id: 'facts', 
        label: '事实和理由', 
        type: 'custom', 
        required: true,
        description: '请详细说明行政行为违法或不当的事实根据和法律依据'
      }
    ]
  }
];

const systemMessage: Message = {
  id: 'system',
  role: 'system',
  content: '我是您的法律文书起草助手，可以帮您生成各类法律文书。',
  timestamp: new Date().toISOString()
};

const DocumentDraft: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [customSections, setCustomSections] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [messages, setMessages] = useState<Message[]>([systemMessage]);

  const categories = ['全部', ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === '全部' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setCustomSections({});
    setPreviewMode(false);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCustomSectionAdd = (fieldId: string) => {
    setCustomSections(prev => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), '']
    }));
  };

  const handleCustomSectionChange = (fieldId: string, index: number, value: string) => {
    setCustomSections(prev => ({
      ...prev,
      [fieldId]: prev[fieldId].map((item, i) => i === index ? value : item)
    }));
  };

  const handleCustomSectionRemove = (fieldId: string, index: number) => {
    setCustomSections(prev => ({
      ...prev,
      [fieldId]: prev[fieldId].filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setPreviewMode(true);
      setIsGenerating(false);
    }, 1500);
  };

  const isFormValid = () => {
    if (!selectedTemplate) return false;
    return selectedTemplate.fields
      .filter(field => field.required)
      .every(field => {
        if (field.type === 'custom') {
          return customSections[field.id]?.some(section => section.trim());
        }
        return formData[field.id]?.trim();
      });
  };

  const renderCustomField = (field: FormField) => {
    const sections = customSections[field.id] || [];
    
    return (
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <textarea
                value={section}
                onChange={(e) => handleCustomSectionChange(field.id, index, e.target.value)}
                placeholder={`第 ${index + 1} 项`}
                className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-200 min-h-[100px]"
              />
            </div>
            <button
              type="button"
              onClick={() => handleCustomSectionRemove(field.id, index)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleCustomSectionAdd(field.id)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加{field.label}项
        </button>
      </div>
    );
  };

  const renderPreview = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-center mb-8">{selectedTemplate.title}</h2>
        
        {selectedTemplate.fields.map(field => (
          <div key={field.id} className="mb-6">
            {field.type === 'custom' ? (
              <>
                <h3 className="text-lg font-semibold mb-4">{field.label}：</h3>
                {customSections[field.id]?.map((section, index) => (
                  <p key={index} className="mb-2 whitespace-pre-wrap">
                    {index + 1}. {section}
                  </p>
                ))}
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">{field.label}：</h3>
                <p className="whitespace-pre-wrap">{formData[field.id]}</p>
              </>
            )}
          </div>
        ))}
        
        <div className="mt-8 text-right">
          <p className="mb-4">此致</p>
          <p>{formData.court}</p>
          <p className="mt-4">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    );
  };

  const handleExport = async () => {
    if (!selectedTemplate) return;
    
    try {
      setIsExporting(true);
      
      // Prepare document content with better formatting
      const title = `标题：${selectedTemplate.title}\n\n`;
      const content = selectedTemplate.fields.map(field => {
        if (field.type === 'custom') {
          const sections = customSections[field.id]?.map((section, index) => 
            `${index + 1}. ${section}`
          ).join('\n') || '';
          return `${field.label}：\n${sections}`;
        } else {
          return `${field.label}：${formData[field.id] || ''}`;
        }
      }).join('\n\n');
      
      const date = `\n\n日期：${new Date().toLocaleDateString('zh-CN', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
      
      const fullContent = title + content + date;

      // Call the exportToWord function
      const blob = await exportToWord(fullContent);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.title}-${new Date().toLocaleDateString('zh-CN')}.doc`;
      
      // Use a try-catch block for the download operation
      try {
        document.body.appendChild(a);
        a.click();
      } catch (downloadError) {
        console.error('下载文件失败:', downloadError);
        throw new Error('下载文件失败，请重试');
      } finally {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('导出文档失败:', error);
      // You might want to show an error message to the user here
      alert('导出文档失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full bg-[#EEF6FF] p-6">
      {selectedTemplate ? (
        previewMode ? (
          // 预览模式
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2C5282]">
                文书预览
              </h2>
              <div className="space-x-4">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="text-[#2C5282] hover:text-[#1A365D] transition-colors"
                >
                  返回编辑
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-[#F0E6D3] text-[#8B6E44] rounded-lg 
                    hover:bg-[#E6D7BB] shadow-md hover:shadow-lg transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? '导出中...' : '导出文档'}
                </button>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 border border-[#E2EAF3]">
              {renderPreview()}
            </div>
          </div>
        ) : (
          // 编辑模式
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2C5282]">
                {selectedTemplate.title}
              </h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-[#2C5282] hover:text-[#1A365D] transition-colors"
              >
                返回模板列表
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 border border-[#E2EAF3]">
              {selectedTemplate.fields.map(field => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-[#2C5282]">
                    {field.label}
                    {field.required && <span className="text-[#B7791F] ml-1">*</span>}
                  </label>
                  
                  {field.description && (
                    <p className="text-sm text-[#4A5568] mb-2">{field.description}</p>
                  )}

                  {field.type === 'custom' ? (
                    <div className="space-y-4">
                      {customSections[field.id]?.map((section, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="flex-1">
                            <textarea
                              value={section}
                              onChange={(e) => handleCustomSectionChange(field.id, index, e.target.value)}
                              placeholder={`第 ${index + 1} 项`}
                              className="w-full rounded-lg border-[#E2EAF3] focus:border-[#90CDF4] focus:ring-2 
                                focus:ring-[#BEE3F8] focus:ring-opacity-50 min-h-[100px] placeholder-[#A0AEC0]
                                bg-[#F7FAFC] hover:border-[#90CDF4] transition-colors"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCustomSectionRemove(field.id, index)}
                            className="mt-2 text-[#B7791F] hover:text-[#975A16]"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleCustomSectionAdd(field.id)}
                        className="inline-flex items-center text-[#B7791F] hover:text-[#975A16] font-medium"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        添加{field.label}项
                      </button>
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border-[#E2EAF3] focus:border-[#90CDF4] focus:ring-2 
                        focus:ring-[#BEE3F8] focus:ring-opacity-50 min-h-[100px] placeholder-[#A0AEC0]
                        bg-[#F7FAFC] hover:border-[#90CDF4] transition-colors"
                      required={field.required}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full rounded-lg border-[#E2EAF3] focus:border-[#90CDF4] focus:ring-2 
                        focus:ring-[#BEE3F8] focus:ring-opacity-50 bg-[#F7FAFC] hover:border-[#90CDF4] 
                        transition-colors text-[#2C5282]"
                      required={field.required}
                    >
                      <option value="">请选择</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'date' ? (
                    <input
                      type="date"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full rounded-lg border-[#E2EAF3] focus:border-[#90CDF4] focus:ring-2 
                        focus:ring-[#BEE3F8] focus:ring-opacity-50 bg-[#F7FAFC] hover:border-[#90CDF4] 
                        transition-colors text-[#2C5282]"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border-[#E2EAF3] focus:border-[#90CDF4] focus:ring-2 
                        focus:ring-[#BEE3F8] focus:ring-opacity-50 bg-[#F7FAFC] hover:border-[#90CDF4] 
                        transition-colors text-[#2C5282] placeholder-[#A0AEC0]"
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid() || isGenerating}
                  className={`
                    px-6 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg
                    transition-all duration-200
                    ${!isFormValid() || isGenerating
                      ? 'bg-[#EDF2F7] text-[#A0AEC0] cursor-not-allowed'
                      : 'bg-[#F0E6D3] text-[#8B6E44] hover:bg-[#E6D7BB]'
                    }
                  `}
                >
                  {isGenerating ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-[#8B6E44] border-t-transparent rounded-full animate-spin mr-2" />
                      <span>生成中...</span>
                    </div>
                  ) : (
                    '预览文书'
                  )}
                </button>
              </div>
            </form>
          </div>
        )
      ) : (
        // 模板列表
        <>
          {/* 分类选择 */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-[#F0E6D3] text-[#8B6E44] shadow-md'
                      : 'bg-white/80 backdrop-blur-sm text-[#2C5282] hover:bg-white hover:text-[#1A365D]'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 模板列表 */}
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="group bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg 
                  transition-all duration-300 transform hover:-translate-y-1 cursor-pointer 
                  border border-[#E2EAF3] hover:border-[#90CDF4]"
              >
                <h3 className="text-lg font-semibold text-[#2C5282] mb-2 group-hover:text-[#1A365D]">
                  {template.title}
                </h3>
                <p className="text-[#4A5568] text-sm mb-4">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8B6E44] bg-[#F0E6D3] px-3 py-1 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-[#2C5282] group-hover:text-[#1A365D] text-sm font-medium 
                    flex items-center">
                    开始生成
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-[#E2EAF3]">
              <div className="text-[#90CDF4] mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#2C5282] mb-2">
                没有找到相关模板
              </h3>
              <p className="text-[#4A5568]">
                请尝试选择其他分类
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentDraft; 