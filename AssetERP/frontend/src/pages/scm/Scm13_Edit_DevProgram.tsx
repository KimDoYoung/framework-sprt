/**
 * 변경프로그램 등록·수정·상세보기 편집창 (EE16) — Scm13_Lookup_DevProgram의 [소스] 아이콘(상세보기)이 연다. 등록·수정은 EE17(Scm11_Edit_DevStep)이 연다
 * AS-IS: myApp/client/vi/scm/Scm13_Edit_DevProgram.java (439줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert(devStepModel, callback) L98-123 "변경프로그램 등록": 새 프로그램 번호(getSeq), 시스템 = 진행단계의 시스템, versionCode 1, insertWay "new"
 * edit(programModel, callback) L132-147 "변경프로그램 수정": 구분·프로그램ID·소스 입력 막음, 파일 조회, versionCode 2, insertWay "edit"
 * open(programModel) L149-168 "변경프로그램 상세보기": edit와 같고 [파일업로드][다운로드][삭제][저장]을 모두 막음
 * 모달 1000×850: 시스템(막힘)·구분 / 프로그램ID·버전(자동) / 프로그램명·등록일시 / 소스 / 파일명 + 3버튼 / 비고 / 배포대상·배포순서 / [저장][닫기]
 * (modal-style: 헤더 아래 선·푸터 위 선, 라벨 오른쪽 정렬 — 11 §4a)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Input, InputNumber, message, Space } from 'antd';
import { fileApi } from '@/api/file';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevProgram } from '@/types/scm';
import { Button } from '@/components/button';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';


interface Props {
  open: boolean;
  mode: 'insert' | 'edit' | 'view';
  /** insert: 개발 번호와 시스템 구분 코드(진행단계의 시스템) */
  devId?: number | null;
  systemCd?: string | null;
  /** edit·view: 고른 개발 프로그램 */
  program?: DevProgram | null;
  /** callback.execute() — [저장]이 끝난 뒤 */
  onSaved?: () => void;
  onClose: () => void;
}

export const Scm13_Edit_DevProgram: React.FC<Props> = ({ open, mode, devId, systemCd, program, onSaved, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const insert = mode === 'insert';
  const view = mode === 'view';
  const [programId, setProgramId] = useState<number | null>(null);
  const [form, setForm] = useState({
    systemCd: '', programType: '', programCd: '', programNm: '', source: '', note: '',
    version: null as number | null, regDateStr: '', deployTgtYn: false, deploySeq: null as number | null,
  });
  const [fileName, setFileName] = useState('');
  const [fileId, setFileId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<typeof form>) => setForm(prev => ({ ...prev, ...patch }));

  // [E0] 화면 열림 (생성자 L170-218) → settings(), getEditor(), show() — 열 때 모드(insert·edit·open)에 따라 폼을 채운다

  // fileRetrieve() L343-359: sys.Sys10_File.selectByParentId(programId) — 올린 파일 하나의 이름·번호
  const fileRetrieve = async (id: number) => {
    try {
      const list = await fileApi.searchByParentId(id);
      setFileName(list[0]?.fileNm ?? '');
      setFileId(list[0]?.fileId ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  useEffect(() => {
    if (!open) return;
    if (insert) {
      // insert() L98-123: 새 프로그램 번호, 시스템 = 진행단계의 시스템
      setFileName(''); setFileId(null); setProgramId(null);
      setForm({ systemCd: systemCd ?? '', programType: '', programCd: '', programNm: '', source: '', note: '', version: null, regDateStr: '', deployTgtYn: false, deploySeq: null });
      scmApi.nextProgramId().then(setProgramId).catch(err => message.error(errorMessage(err, '채번 실패')));
    } else if (program) {
      setProgramId(program.programId);
      setForm({
        systemCd: program.systemCd ?? '', programType: program.programType ?? '', programCd: program.programCd ?? '', programNm: program.programNm ?? '',
        source: program.source ?? '', note: program.note ?? '', version: program.version ?? null, regDateStr: program.regDateStr ?? '',
        deployTgtYn: program.deployTgtYn === 'true', deploySeq: program.deploySeq ?? null,
      });
      void fileRetrieve(program.programId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E4] uploadButton[파일업로드].Select (L235) → sys.Sys10_File.selectByParentId: 파일이 있으면 "이미 업로드된 파일이 있습니다.", 없으면 fileUpload.click()
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

  // [E1] fileUpload.Change (L183)·[E9] fileUpload.Change (L422, 올린 뒤 다시 만든 입력) → FileUpload?parentId=programId → [E2] fileUploadForm.SubmitComplete (L193) → resetFileUpload(), fileRetrieve()
  const onFile = async (file: File | undefined) => {
    if (!file || programId == null) return;
    try {
      await fileApi.upload(programId, file);
      await fileRetrieve(programId);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  // [E5] downloadButton[다운로드].Select (L256) → fileDownload() L397-404
  const download = () => {
    if (fileId == null) return;
    fileApi.download(fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
  };

  // [E6] deleteButton[삭제].Select (L262) → fileDelete() L406-413 → [E3] fileDeleteForm.SubmitComplete (L200): 파일명 비움
  const deleteFile = async () => {
    if (fileId == null) return;
    try {
      await fileApi.deleteFile(fileId);
      setFileName(''); setFileId(null);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E7] updateButton[저장].Select (L268) → update() L361-395: 필수 검사 → scm.Scm13_DevProgram.modelUpdate → callback.execute(), hide()
  const update = async () => {
    if (!form.systemCd) { message.warning('시스템을 선택해주세요'); return; }
    if (!form.programType) { message.warning('구분을 선택해주세요'); return; }
    if (!form.programCd.trim()) { message.warning('프로그램ID를 입력해주세요'); return; }
    if (programId == null) return;
    setSaving(true);
    try {
      await scmApi.saveDevProgram({
        devProgramId: program?.devProgramId ?? null,
        devId: (insert ? devId : program?.devId) ?? null,
        programId,
        deployTgtYn: form.deployTgtYn ? 'true' : 'false',
        deploySeq: form.deploySeq,
        systemCd: form.systemCd, programType: form.programType, programCd: form.programCd.trim(), programNm: form.programNm || null,
        source: form.source || null, note: form.note || null, version: form.version,
        regDate: insert ? null : program?.regDate ?? null,
        insertWay: insert ? 'new' : 'edit',
      });
      onSaved?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const title = insert ? '변경프로그램 등록' : view ? '변경프로그램 상세보기' : '변경프로그램 수정';

  return (
    <EditModal
      open={open}
      title={title}
      width={1000}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{
        body: { maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" loading={saving} disabled={view} onClick={update}>저장</Button>
            {/* [E8] closeButton[닫기].Select (L274) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* 라벨 칸 폭 85('프로그램명' 기준, AS-IS 100). 모달 폭 1000 그대로 — 안쪽 960을 칸 비율대로 나눔 */}
      <EditRow>
        <EditField label="시스템" labelWidth={85} width={476}>
          <SystemCodeComboBox kindCd="SystemCode" disabled style={{ width: '100%' }} value={form.systemCd || undefined} />
        </EditField>
        <EditField label="구분" labelWidth={85} width={476}>
          <SystemCodeComboBox kindCd="ProgramType" disabled={!insert} style={{ width: '100%' }} value={form.programType || undefined}
            onChange={c => set({ programType: c ?? '' })} />
        </EditField>
      </EditRow>
      <EditRow>
        <EditField label="프로그램ID" labelWidth={85} width={592}>
          <Input disabled={!insert} value={form.programCd} onChange={e => set({ programCd: e.target.value })} />
        </EditField>
        <EditField label="버전" labelWidth={85} width={360}>
          <InputNumber disabled style={{ width: '100%' }} value={form.version} placeholder="(자동생성)" />
        </EditField>
      </EditRow>
      <EditRow>
        <EditField label="프로그램명" labelWidth={85} width={592}>
          <Input value={form.programNm} placeholder="미입력시 전버전의 프로그램명으로 등록됩니다." onChange={e => set({ programNm: e.target.value })} />
        </EditField>
        <EditField label="등록일시" labelWidth={85} width={360}>
          <Input disabled value={form.regDateStr} />
        </EditField>
      </EditRow>
      <EditField label="소스" labelWidth={85}>
        <Input.TextArea disabled={!insert} style={{ height: 380, resize: 'none' }} value={form.source} onChange={e => set({ source: e.target.value })} />
      </EditField>
      <EditField label="파일명" labelWidth={85}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Input disabled readOnly style={{ flex: 1 }} value={fileName} />
          <Space>
            <Button type="upload" disabled={view} onClick={upload}>파일업로드</Button>
            <Button type="download" disabled={view} onClick={download}>다운로드</Button>
            <Button type="delete" disabled={view} onClick={deleteFile}>삭제</Button>
          </Space>
        </div>
      </EditField>
      <EditField label="비고" labelWidth={85}>
        <Input.TextArea style={{ height: 80, resize: 'none' }} value={form.note} onChange={e => set({ note: e.target.value })} />
      </EditField>
      <EditRow>
        <EditField label="배포대상" labelWidth={85} width={476}>
          <Checkbox checked={form.deployTgtYn} onChange={e => set({ deployTgtYn: e.target.checked })} />
        </EditField>
        <EditField label="배포순서" labelWidth={85} width={476}>
          <InputNumber style={{ width: '100%' }} value={form.deploySeq} onChange={v => set({ deploySeq: v })} />
        </EditField>
      </EditRow>
      <FileUpdownForm ref={fileForm} onChange={onFile} />
    </EditModal>
  );
};
