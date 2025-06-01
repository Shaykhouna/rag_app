import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Upload, File, FileText, Image, Film, Archive, Trash2, Bot, Plus, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPresent, setIsPresent] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addNewFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      addNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addNewFiles = (filesList: File[]) => {
    const newFiles = filesList.map(file => {
      // Get file type
      let type = 'document';
      if (file.type.includes('image')) type = 'image';
      else if (file.type.includes('video')) type = 'video';
      else if (file.type.includes('audio')) type = 'audio';
      else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('tar')) type = 'archive';

      // Format file size
      const size = formatFileSize(file.size);

      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type,
        size,
        uploadDate: new Date().toLocaleDateString()
      };
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-400" />;
      case 'video':
        return <Film className="h-5 w-5 text-purple-400" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-yellow-400" />;
      default:
        return <FileText className="h-5 w-5 text-green-400" />;
    }
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 backdrop-blur-sm bg-dark-900/70 border-b border-dark-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="text-primary-400 h-6 w-6" />
          <span className="font-semibold text-lg text-primary-100">AssistAI</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-dark-300">
            {user?.email}
          </span>
          <Button onClick={handleLogout} icon={<LogOut size={16} />}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-primary-100">Your Files</h1>
              <p className="text-dark-400 mt-1">Upload and manage your files securely</p>
            </div>

            <div className="mt-4 md:mt-0">
              <label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button primary icon={<Cloud size={16} />} disabled={isPresent}>
                  Upload File
                </Button>
              </label>
            </div>
          </div>

          {/* Upload area */}
          <motion.div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-dark-700'
            } transition-colors duration-200 mb-8`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-dark-500 mb-4" />
              <h3 className="text-lg font-medium text-primary-200 mb-2">Drag and drop files here</h3>
              <p className="text-dark-400 mb-4">or</p>
              <label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button primary>Select Files</Button>
              </label>
            </div>
          </motion.div>

          {/* Files list */}
          <div className="bg-dark-800/40 backdrop-blur-sm border border-dark-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-700">
              <h2 className="font-medium text-primary-200">Uploaded Files</h2>
            </div>

            {files.length === 0 ? (
              <div className="py-12 text-center">
                <File className="h-12 w-12 text-dark-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-300 mb-2">No files uploaded yet</h3>
                <p className="text-dark-400">Upload files to see them here</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-700">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    className="px-6 py-4 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-dark-700/50 p-2 rounded-lg">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium text-dark-200">{file.name}</p>
                        <p className="text-sm text-dark-400 mt-1">{file.size} • {file.uploadDate}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="text-dark-400 hover:text-red-400 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
