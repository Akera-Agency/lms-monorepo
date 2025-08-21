import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useCallback,
} from "react";
import { CloudUpload, File, Trash2 } from "lucide-react";
import { Input } from "../shadcn/input";
import { Button } from "../button/button";
import { Progress } from "../shadcn/progress";
import { cva } from "class-variance-authority";

const variants = {
  default: "block ",
};
const fileUploaderVariants = cva("block", {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: "default",
  },
});

type InputFile = {
  name: string;
  size: number;
  progress: number;
  originalFile: File;
};

type FileUploaderProps = {
  acceptedFileTypes?: string;
  multiple?: boolean;
  description?: string;
  onChange: (fileList?: File[]) => void;
};

const FileUploader = ({
  multiple = false,
  acceptedFileTypes = ".pdf",
  description = "PDF file (max. 800x400px)",
  onChange,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<InputFile[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleMultipleFileChange = (
    event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLLabelElement>
  ) => {
    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      size: file.size,
      progress: 0,
      originalFile: file,
    }));

    setFiles((prevFiles) => {
      const updatedFiles = [
        ...prevFiles.filter(
          (file) =>
            !newFiles.some(
              (newFile) =>
                file.name === newFile.name && file.size === newFile.size
            )
        ),
        ...newFiles,
      ];

      if (multiple) {
        return updatedFiles;
      } else {
        const lastIndex = updatedFiles.length - 1;
        return [updatedFiles[lastIndex]];
      }
    });

    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((currentFiles) => {
          return currentFiles.map((f) => {
            if (f.name === file.name && f.size === file.size) {
              const updatedProgress = Math.min(f.progress + 10, 100);

              if (updatedProgress === 100) {
                clearInterval(interval);
              }
              return { ...f, progress: updatedProgress };
            }
            return f;
          });
        });
      }, 50);
    });
  };

  const handleRemoveFile = (fileToRemove: { name: string; size: number }) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (file) =>
          file.name !== fileToRemove.name || file.size !== fileToRemove.size
      );
      return updatedFiles;
    });
  };

  const memoizedOnChange = useCallback(onChange, [onChange]);

  useEffect(() => {
    if (files.length > 0) {
      memoizedOnChange(files.map((file) => file.originalFile));
    }
  }, [files, memoizedOnChange]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-6">
        <div className="bg-secondary-hover mb-4 flex h-10 w-10 items-center justify-center rounded-full">
          <CloudUpload className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-secondary-text text-sm">
            <span
              className="cursor-pointer font-semibold text-secondary-foreground"
              onClick={() => inputFileRef.current?.click()}
            >
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-secondary-text mt-1 text-xs">{description}</p>
        </div>
        <Input
          ref={inputFileRef}
          type="file"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={handleMultipleFileChange}
          className="hidden"
        />
      </div>

      {files.map((file) => (
        <div
          key={file.name}
          className="flex w-full gap-4 rounded-lg border p-4"
        >
          <span className="bg-secondary-hover flex h-8 w-8 items-center justify-center rounded-full">
            <File className="h-4 w-4 text-secondary-foreground" />
          </span>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-secondary-text text-xs">
                    {Math.round(file.size / 1024)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleRemoveFile({
                    name: file.name,
                    size: file.size,
                  })
                }
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4 text-neutral-800" />
              </Button>
            </div>
            <div className="flex w-full gap-3">
              <Progress value={file.progress} className="mt-2 h-2" />
              <p className="text-secondary-text text-sm font-semibold">
                {file.progress}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

FileUploader.displayName = "FileUploader";
export { FileUploader, fileUploaderVariants, variants };
