import type formidable from 'formidable';
import { existsSync, mkdirSync, renameSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface ValidateFileType {
  allowedExtension: Array<'.jpg' | '.jpeg' | '.png' | '.doc' | '.docx' | '.pdf' | '.ppt' | '.pptx' | '.xls' | '.xlsx'>;
  allowedMimetypes: Array<
    | 'application/msword'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'image/jpeg'
    | 'image/png'
    | 'application/pdf'
    | 'application/vnd.ms-powerpoint'
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  >;

  /// Mb
  allowedSize: number;

  /// Give name to file without extension. Example : myfile | thisismydocument
  filename?: string;
}

interface ValidateFileResult {
  error?: string;
  name?: string;
}

export const generateUUID = (): string => uuidv4();

export const validateFile = (file: formidable.File, { config }: { config: ValidateFileType }): ValidateFileResult => {
  const defaultName = generateUUID();
  const { originalFilename } = file;
  const { filename: configFilename, allowedExtension, allowedMimetypes } = config;

  if (originalFilename == null) {
    return { error: 'Nama File tidak valid' };
  }

  const extension = path.extname(originalFilename);

  if (!allowedExtension.includes(extension as unknown as any)) {
    return {
      error: `Extension tidak valid. Extension yang diperbolehkan ${allowedExtension.join(',')}`,
    };
  }

  if (!allowedMimetypes.includes(file.mimetype as unknown as any)) {
    return {
      error: `Mimetype tidak valid. Mimetype yang diperbolehkan ${allowedMimetypes.join(',')}`,
    };
  }

  const fileSize = file.size / (1024 * 1024);
  if (fileSize > config.allowedSize) {
    return {
      error: `File terlalu besar. Ukurang yang diperbolehkan ${config.allowedSize} Mb`,
    };
  }

  const name = configFilename !== undefined ? `${config.filename}` : `${defaultName}${extension}`;

  return { name };
};

export const moveFile = (
  /// /public/images/image.jpg
  oldPath: string,
  newPath: string,
): void => {
  const dir = path.dirname(newPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  renameSync(oldPath, newPath);
};
