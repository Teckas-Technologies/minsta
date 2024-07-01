"use client";

import FileUploadPage from "@/components/pages/fileupload";
import { constants } from "@/constants";

import React from "react";

const FileUploadComponent = () => {
  const { isClosed } = constants;

  if (isClosed) return null;

  return <FileUploadPage />;
};

export default FileUploadComponent;