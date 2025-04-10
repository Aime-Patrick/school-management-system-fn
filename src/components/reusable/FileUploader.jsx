import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploader = ({ onFileChange, createSuccess,multiple = false, accept }) => {
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    setFileList((prevList) => [...prevList, file]);
    onFileChange(file);
    return false;
  };

  const handleRemove = (file) => {
    setFileList((prevList) => prevList.filter(item => item.uid !== file.uid));
    onFileChange(null);
  };

  useEffect(() => {
    setFileList([]);
    onFileChange(null);
  }, [createSuccess]);

  return (
    <Upload
      fileList={fileList}
      accept={accept}
      beforeUpload={handleBeforeUpload}
      onRemove={handleRemove}
      multiple={multiple}
    >
      <Button
        className="group border border-gray-400 hover:!border-navy-800 focus:!border-navy-800 
             text-gray-700 hover:!text-navy-800 focus:!text-navy-800"
      >
        <UploadOutlined className="group-hover:!text-navy-800 group-focus:!text-navy-800" />
        Select File
      </Button>
    </Upload>
  );
};


export default FileUploader;
