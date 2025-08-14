import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploader = ({ onFileChange, currentFile, multiple = false, accept }) => {
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    setFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }]);
    onFileChange(file); // Pass the File object to the parent for actual upload
    return false;
  };

  const handleRemove = (file) => {
    setFileList((prevList) => prevList.filter(item => item.uid !== file.uid));
    onFileChange(null);
  };

  useEffect(() => {
    if (typeof currentFile === 'string' && currentFile) {
      setFileList([{ uid: '-1', name: currentFile.split('/').pop(), status: 'done', url: currentFile }]);
    } else if (currentFile instanceof File) {
      // Create a temporary URL for display if it's a File object
      const tempUrl = URL.createObjectURL(currentFile);
      setFileList([{ uid: currentFile.uid || '-1', name: currentFile.name, status: 'done', url: tempUrl, originFileObj: currentFile }]);
    } else {
      setFileList([]);
    }
  }, [currentFile]);

  return (
    <div>
      <Upload
        fileList={fileList}
        accept={accept}
        beforeUpload={handleBeforeUpload}
        onRemove={handleRemove}
        multiple={multiple}
        listType="picture"
      >
        <Button
          className="group border border-gray-400 hover:!border-navy-800 focus:!border-navy-800 
               text-gray-700 hover:!text-navy-800 focus:!text-navy-800"
        >
          <UploadOutlined className="group-hover:!text-navy-800 group-focus:!text-navy-800" />
          Select File
        </Button>
      </Upload>
    </div>
  );
};


export default FileUploader;
