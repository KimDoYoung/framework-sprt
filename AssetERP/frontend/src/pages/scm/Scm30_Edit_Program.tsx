/**
 * 프로그램 등록·수정·상세보기 편집창 (EE18 read, EE19 insert·edit·versionEdit) — Scm13_Page_Deploy 소스보기(read) · Scm30_Tab_Program 등록/소스보기(insert·edit) · Scm30_Lookup_Program 소스보기(versionEdit)가 연다
 * AS-IS: myApp/client/vi/scm/Scm30_Edit_Program.java (465줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert(grid, callback) L91-107 "프로그램 등록": 새 프로그램 번호(GridInsertRow getSeq), 사용 □ 켬, versionCode 1, insertWay "new"
 * edit(grid, programModel, callback) L109-133 "프로그램 수정": 시스템·구분·프로그램ID·소스 입력 막음, 파일 조회, versionCode 2, insertWay "edit"
 * versionEdit(lastVersion, grid, tabGrid, programModel, callback) L135-159 "프로그램 수정": edit와 같지만 파일 조회를 하지 않는다 (Version 조회창의 소스보기)
 * read(programModel, callback) L161-186 "프로그램": 시스템·구분·프로그램ID·소스·프로그램명·비고·사용여부 읽기 전용, [파일업로드][다운로드][삭제] 막음, [저장] 숨김, 버전 표시, 파일 조회
 * 모달 1000×800: 시스템·구분·사용여부 / 프로그램ID·버전 / 프로그램명·등록일시 / 소스 / 파일명 + 3버튼 / 비고 / [저장][닫기]
 * (modal-style: 헤더 아래 선·푸터 위 선, 라벨 오른쪽 정렬 — 11 §4a)
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Input, InputNumber, message, Space } from 'antd';
import { fileApi } from '@/api/file';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { DevProgram, Program } from '@/types/scm';

const LABEL: React.CSSProperties = { width: 100, textAlign: 'right', paddingRight: 10, flex: 'none', fontSize: 12 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

type EditProgram = Program | DevProgram;

interface Props {
  open: boolean;
  /** read(기본)·edit·versionEdit 에서 고른 프로그램. insert 에서는 쓰지 않는다 */
  mode?: 'read' | 'insert' | 'edit' | 'versionEdit';
  program?: EditProgram | null;
  /** [저장] 뒤 서버가 돌려준 한 줄 (AS-IS grid.getStore().update(result)) */
  onSaved?: (saved: Program) => void;
  onClose: () => void;
}

export const Scm30_Edit_Program: React.FC<Props> = ({ open, mode = 'read', program = null, onSaved, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const insert = mode === 'insert';
  const read = mode === 'read';
  const [programId, setProgramId] = useState<number | null>(null);
  const [form, setForm] = useState({
    systemCd: '', programType: '', programCd: '', programNm: '', source: '', note: '', useYn: false,
    version: null as number | null, regDateStr: '',
  });
  const [fileName, setFileName] = useState('');
  const [fileId, setFileId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm(prev => ({ ...prev, ...patch }));

  // fileRetrieve() L364-380: sys.Sys10_File.selectByParentId(programId) — 올린 파일 하나의 이름·번호
  const fileRetrieve = async (id: number) => {
    try {
      const list = await fileApi.searchByParentId(id);
      setFileName(list[0]?.fileNm ?? '');
      setFileId(list[0]?.fileId ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L195-305) → getEditor(), show() — 모드(insert·edit·versionEdit·read)에 따라 폼을 채운다
  useEffect(() => {
    if (!open) return;
    setFileName(''); setFileId(null);
    if (insert) {
      // insert() L91-107: 새 프로그램 번호, 사용 □ 켬
      setProgramId(null);
      setForm({ systemCd: '', programType: '', programCd: '', programNm: '', source: '', note: '', useYn: true, version: null, regDateStr: '' });
      scmApi.nextProgramId().then(setProgramId).catch(err => message.error(errorMessage(err, '채번 실패')));
    } else if (program) {
      setProgramId(program.programId);
      setForm({
        systemCd: program.systemCd ?? '', programType: program.programType ?? '', programCd: program.programCd ?? '', programNm: program.programNm ?? '',
        source: program.source ?? '', note: program.note ?? '', useYn: program.useYn === 'true',
        version: program.version ?? null, regDateStr: program.regDateStr ?? '',
      });
      if (mode === 'versionEdit') {
        // versionEdit() L135-159 는 파일 조회를 하지 않는다(파일명 비어 있음). 내려받기는 행의 파일 번호로 한다
        setFileId((program as Program).fileId ?? null);
      } else {
        void fileRetrieve(program.programId);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, program]);

  // [E4] uploadButton[파일업로드].Select (L245) → sys.Sys10_File.selectByParentId: 파일이 있으면 "이미 업로드된 파일이 있습니다.", 없으면 fileUpload.click()
  const upload = async () => {
    if (programId == null) return;
    try {
      const list = await fileApi.searchByParentId(programId);
      if (list.length > 0) { message.warning('이미 업로드된 파일이 있습니다.'); return; }
      fileForm.current?.click();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E1] fileUpload.Change (L218)·[E9] fileUpload.Change (L448, 올린 뒤 다시 만든 입력) → FileUpload?parentId=programId → [E2] fileUploadForm.SubmitComplete (L228) → resetFileUpload(), fileRetrieve()
  const onFile = async (file: File | undefined) => {
    if (!file || programId == null) return;
    try {
      await fileApi.upload(programId, file);
      await fileRetrieve(programId);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  // [E5] downloadButton[다운로드].Select (L266) → fileDownload() L421-429
  const download = () => {
    if (fileId == null) return;
    fileApi.download(fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
  };

  // [E6] deleteButton[삭제].Select (L272) → fileDelete() L431-439 → [E3] fileDeleteForm.SubmitComplete (L235): 파일명 비움
  const deleteFile = async () => {
    if (fileId == null) return;
    try {
      await fileApi.deleteFile(fileId);
      setFileName(''); setFileId(null);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E7] updateButton[저장].Select (L278) → update() L382-419: 필수 검사 → scm.Scm30_Program.modelUpdate(versionCode 1 등록 / 2 수정) → 그리드 갱신, hide()
  const update = async () => {
    if (!form.systemCd) { message.warning('시스템을 선택해주세요'); return; }
    if (!form.programType) { message.warning('구분을 선택해주세요'); return; }
    if (!form.programCd.trim()) { message.warning('프로그램ID를 입력해주세요'); return; }
    if (programId == null) return;
    setSaving(true);
    try {
      const saved = await scmApi.saveProgram({
        programId,
        systemCd: form.systemCd, programType: form.programType, programCd: form.programCd.trim(), programNm: form.programNm || null,
        source: form.source || null, note: form.note || null, useYn: form.useYn ? 'true' : 'false',
        version: form.version, regDate: insert ? null : program?.regDate ?? null,
        insertWay: insert ? 'new' : 'edit',
      });
      onSaved?.(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const title = insert ? '프로그램 등록' : read ? '프로그램' : '프로그램 수정';

  return (
    <LookupModal
      open={open}
      title={title}
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
          <Space>
            {/* read()는 [저장]을 숨긴다 */}
            {!read && <Button type="save" loading={saving} onClick={update}>저장</Button>}
            {/* [E8] closeButton[닫기].Select (L284) → callback(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={ROW}>
          <span style={LABEL}>시스템</span>
          <SystemCodeComboBox kindCd="SystemCode" disabled={!insert} style={{ width: 230 }} value={form.systemCd || undefined}
            onChange={c => set({ systemCd: c ?? '' })} />
          <span style={{ ...LABEL, marginLeft: 20 }}>구분</span>
          <SystemCodeComboBox kindCd="ProgramType" disabled={!insert} style={{ width: 230 }} value={form.programType || undefined}
            onChange={c => set({ programType: c ?? '' })} />
          <span style={{ ...LABEL, marginLeft: 190 }}>사용여부</span>
          <Checkbox disabled={read} checked={form.useYn} onChange={e => set({ useYn: e.target.checked })} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>프로그램ID</span>
          <Input disabled={!insert} style={{ width: 480 }} value={form.programCd} onChange={e => set({ programCd: e.target.value })} />
          <span style={{ ...LABEL, marginLeft: 190 }}>버전</span>
          <InputNumber disabled style={{ width: 250 }} value={form.version} placeholder="(자동생성)" />
        </div>
        <div style={ROW}>
          <span style={LABEL}>프로그램명</span>
          <Input disabled={read} style={{ width: 480 }} value={form.programNm} placeholder="미입력시 전버전의 프로그램명으로 등록됩니다." onChange={e => set({ programNm: e.target.value })} />
          <span style={{ ...LABEL, marginLeft: 190 }}>등록일시</span>
          <Input disabled style={{ width: 250 }} value={form.regDateStr} placeholder="(자동생성)" />
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          <span style={{ ...LABEL, paddingTop: 5 }}>소스</span>
          <Input.TextArea disabled={!insert} style={{ width: 860, height: 380, resize: 'none' }} value={form.source} onChange={e => set({ source: e.target.value })} />
        </div>
        <div style={ROW}>
          <span style={LABEL}>파일명</span>
          <Input disabled readOnly style={{ width: 570 }} value={fileName} />
          <Space style={{ marginLeft: 10 }}>
            <Button type="upload" disabled={read} onClick={upload}>파일업로드</Button>
            <Button type="download" disabled={read} onClick={download}>다운로드</Button>
            <Button type="delete" disabled={read} onClick={deleteFile}>삭제</Button>
          </Space>
        </div>
        <div style={{ ...ROW, alignItems: 'flex-start' }}>
          <span style={{ ...LABEL, paddingTop: 5 }}>비고</span>
          <Input.TextArea disabled={read} style={{ width: 860, height: 80, resize: 'none' }} value={form.note} onChange={e => set({ note: e.target.value })} />
        </div>
      </div>
      <FileUpdownForm ref={fileForm} onChange={onFile} />
    </LookupModal>
  );
};
