/**
 * 프로그램 상세보기 편집창 (EE18) — Scm13_Page_Deploy 그리드의 소스보기 [View] 아이콘이 연다 (read 모드만)
 * AS-IS: myApp/client/vi/scm/Scm30_Edit_Program.java (465줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * read(programModel, callback) L161-186 "프로그램": 시스템·구분·프로그램ID·소스·프로그램명·비고·사용여부 읽기 전용, [파일업로드][다운로드][삭제] 막음, [저장] 숨김, 버전 표시, 파일 조회
 * 모달 1000×800: 시스템·구분·사용여부 / 프로그램ID·버전 / 프로그램명·등록일시 / 소스 / 파일명 + 3버튼 / 비고 / [닫기] (insert·edit·versionEdit 모드는 EE19 Scm30_Tab_Program이 쓸 때 더한다)
 * (modal-style: 헤더 아래 선·푸터 위 선, 라벨 오른쪽 정렬 — 11 §4a)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, Input, InputNumber, message, Space } from 'antd';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { DevProgram } from '@/types/scm';

const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

interface Props {
  open: boolean;
  /** read(programModel, callback) — 고른 프로그램 */
  program: DevProgram | null;
  onClose: () => void;
}

export const Scm30_Edit_Program: React.FC<Props> = ({ open, program, onClose }) => {
  const [fileName, setFileName] = useState('');

  // [E0] 화면 열림 (생성자 L195-305) → getEditor(), show() — read() L161-186 이 칸을 채우고 fileRetrieve() 를 부른다
  // fileRetrieve() L364-380: sys.Sys10_File.selectByParentId(programId) — 올린 파일이 있으면 파일명
  useEffect(() => {
    if (!open || !program) return;
    setFileName('');
    fileApi.searchByParentId(program.programId)
      .then(list => setFileName(list[0]?.fileNm ?? ''))
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, program]);

  return (
    <LookupModal
      open={open}
      title="프로그램"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        body: { padding: '12px 2px', maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E8] closeButton[닫기].Select (L284) → callback(), hide() — [저장]은 read()가 숨긴다 */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={ROW}>
          <span style={LABEL}>시스템</span>
          <SystemCodeComboBox kindCd="SystemCode" disabled style={{ width: 230 }} value={program?.systemCd || undefined} />
          <span style={{ ...LABEL, marginLeft: 20 }}>구분</span>
          <SystemCodeComboBox kindCd="ProgramType" disabled style={{ width: 230 }} value={program?.programType || undefined} />
          <span style={{ ...LABEL, marginLeft: 190 }}>사용여부</span>
          <Checkbox disabled checked={program?.useYn === 'true'} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>프로그램ID</span>
          <Input disabled style={{ width: 480 }} value={program?.programCd ?? ''} />
          <span style={{ ...LABEL, marginLeft: 190 }}>버전</span>
          <InputNumber disabled style={{ width: 250 }} value={program?.version ?? null} placeholder="(자동생성)" />
        </div>
        <div style={ROW}>
          <span style={LABEL}>프로그램명</span>
          <Input disabled style={{ width: 480 }} value={program?.programNm ?? ''} />
          <span style={{ ...LABEL, marginLeft: 190 }}>등록일시</span>
          <Input disabled style={{ width: 250 }} value={program?.regDateStr ?? ''} placeholder="(자동생성)" />
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          <span style={{ ...LABEL, paddingTop: 5 }}>소스</span>
          <Input.TextArea disabled style={{ width: 860, height: 380, resize: 'none' }} value={program?.source ?? ''} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>파일명</span>
          <Input disabled readOnly style={{ width: 570 }} value={fileName} />
          <Space style={{ marginLeft: 10 }}>
            <Button type="upload" disabled>파일업로드</Button>
            <Button type="download" disabled>다운로드</Button>
            <Button type="delete" disabled>삭제</Button>
          </Space>
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          <span style={{ ...LABEL, paddingTop: 5 }}>비고</span>
          <Input.TextArea disabled style={{ width: 860, height: 80, resize: 'none' }} value={program?.note ?? ''} />
        </div>
      </div>
    </LookupModal>
  );
};
