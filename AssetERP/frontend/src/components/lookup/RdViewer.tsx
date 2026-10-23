/**
 * RD(Report Designer) 미리보기 창 — AS-IS RDViewer.viewer(param, rvParam) (다른 화면이 같은 창을 쓴다).
 * 주소는 부르는 쪽이 `rdApi.buildUrl({kind:'viewer', …})`로 발급받아 `url`로 준다(서버가 rv의 companyId·personId를 로그인 값으로 채운다).
 * AS-IS: 모달·크기 조절 창, 위쪽 [닫기] 버튼 줄 + RD HTML5 뷰어 iframe(getHtml). docs/RD-대책.md
 */
import React from 'react';
import { Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';

interface Props {
  /** 값이 있는 동안 열려 있다 */
  url: string | null;
  title?: string;
  onClose: () => void;
}

export const RdViewer: React.FC<Props> = ({ url, title = '', onClose }) => (
  <LookupModal
    open={url !== null}
    title={title}
    width="90vw"
    style={{ top: 20 }}
    maskClosable={false}
    onCancel={onClose}
    destroyOnClose
    footer={
      <div style={{ textAlign: 'center' }}>
        <Space>
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      </div>
    }
  >
    {url && <iframe title="RD" src={url} style={{ width: '100%', height: '75vh', border: '1px solid #d9d9d9' }} />}
  </LookupModal>
);
