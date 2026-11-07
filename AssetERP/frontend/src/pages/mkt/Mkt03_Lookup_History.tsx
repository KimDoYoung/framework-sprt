/**
 * 업무활동내역 등록·수정·보기 창 (Z05) — Mkt03_Grid_History의 [등록]·수정 아이콘에서 연다
 * AS-IS: myApp/client/vi/mkt/Mkt03_Lookup_History.java (573줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L99-124: 모달 "업무활동내역" 880×750, 라벨 폭 80 — 활동일·활동처([활동처 바로가기])·활동내용·내용상세(높이 200)·공유([설정])·첨부파일([파일업로드] + 그리드 150)·연결펀드([등록] + 그리드 150), 아래 가운데 [저장][닫기]
 * insert() L126-147 새로 등록 · edit() L149-157 내가 쓴 것 수정 · open() L159-176 남이 쓴 것 보기(저장·등록·파일업로드·삭제 아이콘 없음)
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktHistoryApi, mktShareApi } from '@/api/mkt';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { MktHistory, MktRelateFund } from '@/types/mkt';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Fnd01_Lookup_SelectMulti } from '@/components/lookup/Fnd01_Lookup_SelectMulti';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { Mkt01_Lookup_TargetCompany } from './Mkt01_Lookup_TargetCompany';
import { Mkt05_Lookup_Share } from './Mkt05_Lookup_Share';

const fundGb = gbFor<MktRelateFund>();
const fileGb = gbFor<FileInfo>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

export type MktHistoryTarget =
  | { mode: 'new'; targetCompanyId: number; targetCompanyName: string }
  | { mode: 'edit' | 'view'; row: MktHistory };

interface Props {
  /** 값이 있으면 열린다. new = insert(), edit = edit()(내가 쓴 것), view = open()(남이 쓴 것) */
  target: MktHistoryTarget | null;
  /** updateEnd() L515-520: 저장한 활동내역 (grid.getStore().update) */
  onSaved: (row: MktHistory) => void;
  onClose: () => void;
}

/** 라벨 폭 80 (form.setLabelWidth(80)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 80, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Form {
  historyId: number;
  targetCompanyId: number;
  targetCompanyName: string;
  activityDate: Dayjs | null;
  activityTitle: string;
  activityContent: string;
  shareInfo: string;
}

export const Mkt03_Lookup_History: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const [f, setF] = useState<Form | null>(null);
  // actionName: "NEW" 새로 등록(저장 전) / "EDIT" / "VIEW"
  const [action, setAction] = useState<'NEW' | 'EDIT' | 'VIEW'>('EDIT');
  const [funds, setFunds] = useState<MktRelateFund[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [saving, setSaving] = useState(false);
  const [tempId, setTempId] = useState(0);
  const [fundOpen, setFundOpen] = useState(false);
  const [shareParent, setShareParent] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  const view = action === 'VIEW';
  const historyId = f?.historyId ?? null;

  // retrieveFund() L527-531: mkt.Mkt04_RelateFund.selectByHistoryId
  const retrieveFund = useCallback(async (id: number) => {
    try {
      setFunds(await mktHistoryApi.searchRelateFunds(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieveFile() L533-537: sys.Sys10_File.selectByParentId
  const retrieveFile = useCallback(async (id: number) => {
    try {
      setFiles(await fileApi.searchByParentId(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L99-124) → settings(), getEditor(), show() · insert() / edit() / open()
  useEffect(() => {
    setFunds([]);
    setFiles([]);
    if (!target) { setF(null); return; }
    let alive = true;
    void (async () => {
      try {
        if (target.mode === 'new') {
          // insert() L126-147: 새 ID, 작성자·등록일·활동일(오늘) + insertDefaultShare()
          const id = await mktHistoryApi.nextId();
          if (!alive) return;
          setAction('NEW');
          setF({ historyId: id, targetCompanyId: target.targetCompanyId, targetCompanyName: target.targetCompanyName, activityDate: dayjs(), activityTitle: '', activityContent: '', shareInfo: '' });
          const info = await mktShareApi.insertDefault(target.targetCompanyId, id);
          if (alive && info != null) setF(prev => prev && { ...prev, shareInfo: info });
        } else {
          const r = target.row;
          setAction(target.mode === 'view' ? 'VIEW' : 'EDIT');
          setF({
            historyId: r.historyId, targetCompanyId: r.targetCompanyId, targetCompanyName: r.targetCompanyName ?? '',
            activityDate: r.activityDate ? dayjs(r.activityDate) : null, activityTitle: r.activityTitle ?? '', activityContent: r.activityContent ?? '', shareInfo: r.shareInfo ?? '',
          });
          await Promise.all([retrieveFund(r.historyId), retrieveFile(r.historyId)]);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E8] fileUpload.Change (L340) → upload() L334-361: FileUpload?parentId={historyId} → [E9] SubmitComplete → retrieveFile()
  const onFile = async (file: File | undefined) => {
    if (!file || historyId == null) return;
    try {
      await fileApi.upload(historyId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieveFile(historyId);
  };

  // checkFileDelete() L539-564: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) — 1 다시 조회 / 2 안내 / 3 FileDelete → [E1] 다시 조회
  const checkFileDelete = useCallback(async (row: FileInfo) => {
    try {
      const r = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (r.status === 2) { message.warning(r.message ?? '삭제할 수 없는 파일입니다.'); return; }
      if (r.status === 3) await fileApi.deleteFile(row.fileId);
      await retrieveFile(row.parentId);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  }, [retrieveFile]);

  // buildFileGrid() L436-471 (setChecked SINGLE) — 남이 쓴 것(VIEW)은 삭제 열(5)을 숨긴다
  const fileColumns = useMemo(() => [
    fileGb.text('fileNm', 405, '첨부파일'),                                                                  // L465
    fileGb.text('fileYnCheck' as keyof FileInfo & string, 65, ' '),                                          // L466 (SQL에 없는 열 — 빈 칸)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {                                           // L467 FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(view ? [] : [iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => void checkFileDelete(row))]), // L468
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),                                          // L469 Sys10_Lookup_FileViewer.open(fileId)
  ], [view, checkFileDelete]);

  // buildFundGrid() L415-434 (setChecked SINGLE) — 삭제 아이콘은 mkt.Mkt04_RelateFund.delete를 바로 부른다(저장된 행만). VIEW는 삭제 열(4)을 숨긴다
  const fundColumns = useMemo(() => [
    fundGb.text('fundCode', 80, '코드'),                // L429
    fundGb.text('fundName', 480, '연관펀드명'),         // L430
    ...(view ? [] : [iconCell<MktRelateFund>('delete', 'deleteCell', 80, '삭제', row => {  // L431
      void (async () => {
        try {
          if (row.relateFundId > 0 && historyId != null) await mktHistoryApi.removeRelateFunds(historyId, [row.relateFundId]);
          setFunds(prev => prev.filter(x => x.relateFundId !== row.relateFundId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      })();
    })]),
  ], [view, historyId]);

  if (!f) return null;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF(prev => prev && { ...prev, [k]: v });

  // [E2] insertButton[연결펀드].Select (L195) → insertFundList() L296-332: Fnd01_Lookup_SelectMulti.open(이미 연결된 펀드 ID) → 고른 펀드를 그리드에 더한다(저장은 [저장]에서)
  const onFunds = (list: { fundId: number; fundCode?: string | null; fundName?: string | null }[]) => {
    setFundOpen(false);
    setFunds(prev => {
      let id = tempId;
      const added = list.map(x => { id -= 1; return { relateFundId: id, historyId: f.historyId, fundId: x.fundId, fundCode: x.fundCode ?? null, fundName: x.fundName ?? null }; });
      setTempId(id);
      return [...prev, ...added];
    });
  };

  // [E4] updateButton[저장].Select (L207) → update() L473-513: mkt.Mkt03_History.updateOne → (연결펀드가 있으면) mkt.Mkt04_RelateFund.updateByList → updateEnd() L515-520
  const update = async () => {
    if (f.activityDate == null) return message.warning('활동일을 선택해주세요');
    if (!f.activityTitle) return message.warning('활동내용은 필수입력 항목입니다');
    setSaving(true);
    try {
      const saved = await mktHistoryApi.save({
        historyId: f.historyId, targetCompanyId: f.targetCompanyId, activityDate: f.activityDate.format(FORMAT),
        activityTitle: f.activityTitle, activityContent: f.activityContent === '' ? null : f.activityContent, fundIds: funds.map(x => x.fundId),
      });
      setAction('EDIT');
      onSaved(saved);
      await retrieveFund(f.historyId);
      message.info('저장이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E5] cancleButton[닫기].Select ["NEW".equals(actionName)] (L213) → 등록을 취소하면 복사해 둔 공유정보를 지우고(deleteDefaultShare) 닫는다
  const cancel = async () => {
    if (action === 'NEW') {
      try {
        await mktShareApi.deleteDefault(f.historyId);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
        return;
      }
    }
    onClose();
  };

  return (
    <LookupModal
      open
      title="업무활동내역"
      width={900}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={() => void cancel()}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!view && <Button type="save" onClick={update} loading={saving}>저장</Button>}
            <Button type="close" onClick={() => void cancel()}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <Field label="활동일">
          <DatePicker style={{ width: 120 }} allowClear={false} disabled={view} value={f.activityDate} format={FORMAT} onChange={d => set('activityDate', d)} />
        </Field>
        <Field label="활동처">
          <Space>
            <Input style={{ width: 635 }} disabled value={f.targetCompanyName} />
            {/* [E7] targetCompanyButton[활동처 바로가기].Select (L233) → lookupTargetCompany() L287-294 */}
            <Button type="change" onClick={() => setCompanyId(f.targetCompanyId)}>활동처 바로가기</Button>
          </Space>
        </Field>
        <Field label="활동내용"><Input disabled={view} value={f.activityTitle} onChange={e => set('activityTitle', e.target.value)} /></Field>
        <Field label="내용상세"><Input.TextArea style={{ height: 200 }} disabled={view} value={f.activityContent} onChange={e => set('activityContent', e.target.value)} /></Field>
        <Field label="공유">
          <Space>
            <Input style={{ width: 600 }} readOnly value={f.shareInfo} />
            {/* [E6] shareButton[설정].Select (L227) → lookupShare() L275-285 */}
            <Button type="register" onClick={() => setShareParent(f.historyId)}>설정</Button>
          </Space>
        </Field>
        <Field label="첨부파일">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* [E3] uploadButton[첨부파일].Select (L201) → upload() L334-361: 파일 선택 창을 연다 */}
            <div><Button type="upload" disabled={view} onClick={() => fileForm.current?.click()}>파일업로드</Button></div>
            <div style={{ height: 150 }}>
              <SingleGrid<FileInfo> rowData={files} columnDefs={fileColumns} getRowId={p => String(p.data.fileId)} rowSelection={SINGLE_CHECK} />
            </div>
          </div>
        </Field>
        <Field label="연결펀드">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><Button type="register" disabled={view} onClick={() => setFundOpen(true)}>등록</Button></div>
            <div style={{ height: 150 }}>
              <SingleGrid<MktRelateFund> rowData={funds} columnDefs={fundColumns} getRowId={p => String(p.data.relateFundId)} rowSelection={SINGLE_CHECK} />
            </div>
          </div>
        </Field>
      </div>
      <FileUpdownForm ref={fileForm} onChange={file => void onFile(file)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      <Fnd01_Lookup_SelectMulti open={fundOpen} excludeIds={funds.map(x => x.fundId)} onSelect={onFunds} onClose={() => setFundOpen(false)} />
      <Mkt05_Lookup_Share parentId={shareParent} onResult={info => set('shareInfo', info)} onClose={() => setShareParent(null)} />
      <Mkt01_Lookup_TargetCompany target={companyId != null ? { id: companyId } : null} onClose={() => setCompanyId(null)} />
    </LookupModal>
  );
};
