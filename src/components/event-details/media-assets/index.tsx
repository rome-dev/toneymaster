import React from 'react';
import { SectionDropdown, HeadingLevelThree } from 'components/common';

import FileUpload, {
  FileUploadTypes,
  AcceptFileTypes,
} from 'components/common/file-upload';
import { EventMenuTitles } from 'common/enums';

import { IIconFile } from '../logic/model';
import { UploadLogoTypes } from '../state';
import styles from '../styles.module.scss';

interface IProps {
  onFileUpload: (files: IIconFile[]) => void;
  onFileRemove: (files: IIconFile[]) => void;
  isSectionExpand: boolean;
  logo?: string;
  mobileLogo?: string;
}

const MediaAssetsSection: React.FC<IProps> = props => {
  const {
    onFileUpload,
    onFileRemove,
    isSectionExpand,
    logo,
    mobileLogo,
  } = props;

  const populateFileObj = (
    files: File[],
    destinationType: string
  ): IIconFile[] => files.map(file => ({ file, destinationType }));

  const onDesktopFileUpload = (files: File[]) =>
    onFileUpload(populateFileObj(files, UploadLogoTypes.DESKTOP));

  const onMobileFileUpload = (files: File[]) =>
    onFileUpload(populateFileObj(files, UploadLogoTypes.MOBILE));

  const onDesktopFileRemove = (files: File[]) =>
    onFileRemove(populateFileObj(files, UploadLogoTypes.DESKTOP));

  const onMobileFileRemove = (files: File[]) =>
    onFileRemove(populateFileObj(files, UploadLogoTypes.MOBILE));

  return (
    <SectionDropdown
      id={EventMenuTitles.MEDIA_ASSETS}
      type="section"
      panelDetailsType="flat"
      useBorder={true}
      expanded={isSectionExpand}
    >
      <HeadingLevelThree>
        <span className={styles.blockHeading}>Media Assets</span>
      </HeadingLevelThree>
      <div className={styles.maDetails}>
        <div className={styles.uploadWrapper}>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Desktop Icon</span>
            <FileUpload
              type={FileUploadTypes.SECTION}
              acceptTypes={[
                AcceptFileTypes.JPG,
                AcceptFileTypes.JPEG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onDesktopFileUpload}
              onFileRemove={onDesktopFileRemove}
              logo={logo}
            />
          </div>
          <div className={styles.uploadBlock}>
            <span className={styles.uploadBlockTitle}>Mobile Icon</span>
            <FileUpload
              type={FileUploadTypes.SECTION}
              acceptTypes={[
                AcceptFileTypes.JPG,
                AcceptFileTypes.JPEG,
                AcceptFileTypes.PNG,
                AcceptFileTypes.SVG,
              ]}
              onUpload={onMobileFileUpload}
              onFileRemove={onMobileFileRemove}
              logo={mobileLogo}
            />
          </div>
        </div>
      </div>
    </SectionDropdown>
  );
};

export default MediaAssetsSection;
