import { CloudUpload } from 'lucide-react';
import { Input } from '../shadcn/input';
import { type ChangeEvent, useRef } from 'react';
import { Button } from '../button/button';

type ThumbnailUploaderProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ThumbnailUploader = ({ onChange }: ThumbnailUploaderProps) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const onClickRef = () => inputFileRef?.current && inputFileRef.current.click();

  return (
    <div className="relative flex h-[13.25rem] items-center justify-center rounded-xl border-2 border-dashed bg-gray-50 p-6">
      <div onClick={onClickRef} className="z-10 flex flex-col items-center gap-4">
        <div className="bg-secondary-hover flex h-10 w-10 items-center justify-center rounded-full">
          <CloudUpload className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="flex cursor-default flex-col gap-1 font-normal">
          <p className="text-secondary-text text-center text-sm">
            <span className="text-heading-sm h-5 w-5 cursor-pointer font-semibold text-secondary-foreground">
              Click to upload
            </span>{' '}
            or drag and drop
          </p>
          <div className="text-secondary-text text-center text-xs">
            <p>PNG or JPG (max. 1000x560px)</p>
          </div>
        </div>
      </div>
      <Input
        ref={inputFileRef}
        onChange={onChange}
        type="file"
        className="absolute left-0 top-0 z-0 h-full w-full opacity-0"
      />
    </div>
  );
};

export default ThumbnailUploader;

type ThumbnailPreviewProps = {
  alt: string;
  preview: string | null;
  onRemove: () => void;
};

export const ThumbnailPreview = ({ alt, preview, onRemove }: ThumbnailPreviewProps) => {
  return (
    <div className="group relative h-[11.25rem] w-full grow rounded-xl">
      <div className="relative h-full w-full">
        <img
          alt={alt}
          src={preview ?? ''}
          className="rounded-xl object-cover transition-all duration-300 ease-in-out group-hover:brightness-50"
        />
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={onRemove}
        className="absolute left-1/2 top-1/2 hidden h-11 -translate-x-1/2 -translate-y-1/2 border-white bg-white/10 px-6 py-3 text-base text-white backdrop-blur-[1px] transition-all duration-300 ease-in-out hover:border-gray-300 hover:bg-white/10 hover:text-gray-300 hover:backdrop-blur-[2px] group-hover:flex"
      >
        Change Image
      </Button>
    </div>
  );
};
