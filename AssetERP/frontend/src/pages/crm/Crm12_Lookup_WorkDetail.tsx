/**
 * 업무활동내역 창 (EE85) — AS-IS는 Crm12_Grid_WorkDetail(영업 업무활동 그리드)의 [등록]·수정·보기가 연다 (TOBE는 CRM 화면이 없어 연결 안 함)
 * AS-IS: myApp/client/vi/crm/Crm12_Lookup_WorkDetail.java (579줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L101-125: 880×700 모달 "업무활동내역", 폼 + [저장][닫기]. getEditor() L368-419:
 *   활동일 180 / 거래처(읽기 전용) 800 / 활동내용 800 / 내용상세 200 / 연결펀드 [등록] + 그리드 150(코드 80·연관펀드명 480·삭제 80) /
 *   첨부파일 [파일업로드] + 그리드 150(첨부파일 405·공백 65·받기 50·삭제 50·보기 50) / 공유(읽기 전용 600)+[설정]+[비공개] 체크
 * insert() L127 = 새 건(번호를 먼저 받고 거래처 기본 공유를 복사), edit() L151 = 수정, open() L165 = 보기(저장·등록·업로드 막고 삭제 열을 감춘다)
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { crmWorkDetailApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { FILE_DELETE_STATUS, fileApi } from '@/api/file';
import { CrmRelateFund } from '@/types/crm';
import { FundMulti } from '@/types/fnd';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Fnd01_Lookup_SelectMulti } from '@/components/lookup/Fnd01_Lookup_SelectMulti';
import { FileUpdownForm, type FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { Crm15_Lookup_Share } from './Crm15_Lookup_Share';

const gbFund = gbFor<CrmRelateFund>();
const gbFile = gbFor<FileInfo>();

const LABEL: React.CSSProperties = { width: 80, flex: 'none', textAlign: 'right', paddingRight: 10, fontSize: 12 };

type Action = 'NEW' | 'EDIT' | 'VIEW';

interface Props {
  open: boolean;
  /** insert()(NEW): 거래처를 주면 새 건, edit()/open(): workDetailId를 주면 그 건을 읽는다 */
  action: Action;
  workDetailId?: number | null;
  /** NEW — 거래처 (insert(contactId, contactName, …)) */
  contact?: { contactId: number; contactName: string };
  /** 저장 성공(L512·L517) — 부른 쪽이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

export const Crm12_Lookup_WorkDetail: React.FC<Props> = ({ open, action, workDetailId: inId, contact, onSaved, onClose }) => {
  const view = action === 'VIEW';
  const [id, setId] = useState<number | null>(null);
  const [contactId, setContactId] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [workDate, setWorkDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
  const [workName, setWorkName] = useState('');
  const [workContent, setWorkContent] = useState('');
  const [privateYn, setPrivateYn] = useState(false);
  const [shareInfo, setShareInfo] = useState('');
  const [funds, setFunds] = useState<CrmRelateFund[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fundOpen, setFundOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [ready, setReady] = useState(false);
  const upload = useRef<FileUpdownFormHandle>(null);

  // retrieve01() L529-533 · retrieve02() L535-539
  const retrieveFunds = async (wid: number) => setFunds(await crmWorkDetailApi.searchFunds(wid));
  const retrieveFiles = async (wid: number) => setFiles(await fileApi.searchByParentId(wid));
  const retrieve = async (wid: number) => {
    try { await Promise.all([retrieveFunds(wid), retrieveFiles(wid)]); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  };

  // [E0] 화면 열림 (생성자 L101-125) → insert() L127-149 / edit() L151-163 / open() L165-184
  useEffect(() => {
    if (!open) { setReady(false); return; }
    setFunds([]); setFiles([]);
    const run = async () => {
      try {
        if (action === 'NEW') {
          if (!contact) { onClose(); return; }
          const wid = await crmWorkDetailApi.nextId();
          setId(wid); setContactId(contact.contactId); setContactName(contact.contactName);
          setWorkDate(dayjs().format('YYYY-MM-DD')); setWorkName(''); setWorkContent(''); setPrivateYn(false); setShareInfo('');
          setReady(true);
          // insertDefaultShare() L256-270 — 거래처 기본 공유를 이 건으로 복사하고 공유 요약을 채운다
          const info = await crmWorkDetailApi.insertDefaultShare(wid, contact.contactId);
          if (info != null) setShareInfo(info);
          await retrieve(wid);
        } else if (inId != null) {
          const d = await crmWorkDetailApi.get(inId);
          setId(d.workDetailId); setContactId(d.contactId); setContactName(d.contactName ?? '');
          setWorkDate(d.workDate ?? dayjs().format('YYYY-MM-DD')); setWorkName(d.workName ?? ''); setWorkContent(d.workContent ?? '');
          setPrivateYn(d.privateYn ?? false); setShareInfo(d.shareInfo ?? '');
          setReady(true);
          await retrieve(d.workDetailId);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        onClose();
      }
    };
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, action, inId]);

  // setShareEnabled() L251-254 — 보기는 공유 칸·[설정]·비공개를 막고, 비공개 체크면 공유 칸·[설정]을 막는다
  const shareEnabled = !view && !privateYn;

  // [E7] shareButton[설정].Select (L243) → lookupShare() L290-300: Crm15_Lookup_Share.open(workDetailId, 결과 문자열 → shareInfo)
  const lookupShare = () => setShareOpen(true);

  // [E3] insertButton[연결펀드].Select (L214) → insertRelateFundList() L302-337: Fnd01_Lookup_SelectMulti.open(이미 연결된 펀드 번호들, …) → 고른 펀드를 그리드에 더한다
  const onFundsPicked = (list: FundMulti[]) => {
    setFundOpen(false);
    setFunds(prev => [...prev, ...list.map(f => ({ workDetailId: id, fundId: f.fundId, fundCode: f.fundCode, fundName: f.fundName }))]);
  };

  // 연결펀드 그리드 삭제 아이콘 (L427-434) — GridDeleteData crm.Crm13_RelateFund.delete
  const deleteFund = async (row: CrmRelateFund) => {
    try {
      if (row.relateFundId != null) await crmWorkDetailApi.deleteFund(row.relateFundId);
      setFunds(prev => prev.filter(f => f.fundId !== row.fundId));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E4] uploadButton[첨부파일].Select (L220) → upload() L339-366 → [E8] 파일을 고르면 FileUpload?parentId= 로 올리고 [E9] 끝나면 retrieve02()
  const onFile = async (file: File | undefined) => {
    if (id == null || !file) return;
    try {
      await fileApi.upload(id, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await retrieveFiles(id);
  };

  // checkFileDelete() L541-566: sys.Sys11_RelateFile.checkFileDelete — 1 연결만 지움 → retrieve02, 2 안내 문구, 3 FileDelete → [E2] retrieve02
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        if (id != null) await retrieveFiles(id);
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '확인', content: text ?? '해당 파일은 삭제할 수 없습니다', okText: '확인' });
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        if (id != null) await retrieveFiles(id);
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E5] updateButton[저장].Select (L226) → updateRow() L479-522
  const updateRow = async () => {
    if (!workDate) { message.warning('활동일을 선택해주세요'); return; }
    if (!workName.trim()) { message.warning('활동내용은 필수입력 항목입니다'); return; }
    if (id == null || contactId == null) return;
    try {
      await crmWorkDetailApi.save({
        workDetailId: id, contactId, workDate, workName, workContent: workContent || null, privateYn,
        fundIds: funds.map(f => f.fundId),
      });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E6] cancleButton[닫기].Select ["NEW".equals(actionName)] (L232) → 등록 취소면 deleteDefaultShare() L272-288 뒤 hide(), 아니면 hide()
  const cancel = async () => {
    if (action === 'NEW' && id != null) {
      try {
        await crmWorkDetailApi.deleteDefaultShare(id);
      } catch (err) {
        message.error(errorMessage(err, '처리 실패'));
        return;
      }
    }
    onClose();
  };

  // buildRelateFundGrid() L421-440 (단일 선택) — VIEW는 삭제 열(4번째)을 감춘다
  const fundColumns = useMemo(() => [
    gbFund.text('fundCode', 80, '코드'),
    gbFund.text('fundName', 480, '연관펀드명'),
    ...(view ? [] : [iconCell<CrmRelateFund>('delete', 'actionCell', 80, '삭제', row => void deleteFund(row))]),
  ], [view]);

  // buildRelateFileGrid() L442-477 (단일 선택) — VIEW는 삭제 열(5번째)을 감춘다
  const fileColumns = useMemo(() => [
    gbFile.text('fileNm', 405, '첨부파일'),
    { colId: 'fileYnCheck', headerName: ' ', width: 65, headerClass: 'gb-hdr' },
    iconCell<FileInfo>('down', 'downCell', 50, '받기', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    ...(view ? [] : [iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', row => void checkFileDelete(row))]),
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [view, id]);

  const row: React.CSSProperties = { display: 'flex', alignItems: 'center' };

  return (
    <>
      <LookupModal
        open={open && ready}
        title="업무활동내역"
        width={880}
        maskClosable={false}
        onCancel={() => void cancel()}
        destroyOnHidden
        focusFirst={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {!view && <Button type="save" onClick={updateRow}>저장</Button>}
              <Button type="close" onClick={() => void cancel()}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20, maxHeight: 560, overflowY: 'auto' }}>
          <div style={row}>
            <span style={LABEL}>활동일</span>
            <DatePicker style={{ width: 180 }} allowClear={false} disabled={view} format="YYYY-MM-DD" value={workDate ? dayjs(workDate) : null}
              onChange={d => d && setWorkDate(d.format('YYYY-MM-DD'))} />
          </div>
          <div style={row}>
            <span style={LABEL}>거래처</span>
            <Input disabled style={{ width: 700 }} value={contactName} />
          </div>
          <div style={row}>
            <span style={LABEL}>활동내용</span>
            <Input style={{ width: 700 }} disabled={view} value={workName} onChange={e => setWorkName(e.target.value)} />
          </div>
          <div style={{ display: 'flex' }}>
            <span style={LABEL}>내용상세</span>
            <Input.TextArea style={{ width: 700, height: 200, resize: 'none' }} disabled={view} value={workContent} onChange={e => setWorkContent(e.target.value)} />
          </div>
          <div style={{ ...row, marginTop: 10 }}>
            <span style={LABEL}>연결펀드</span>
            {/* [E3] */}
            <Button type="register" disabled={view} onClick={() => setFundOpen(true)}>등록</Button>
          </div>
          <div style={{ height: 150, marginLeft: 85, width: 700 }}>
            <SingleGrid<CrmRelateFund> rowData={funds} columnDefs={fundColumns} getRowId={p => String(p.data.relateFundId ?? `n${p.data.fundId}`)} />
          </div>
          <div style={{ ...row, marginTop: 10 }}>
            <span style={LABEL}>첨부파일</span>
            {/* [E4] */}
            <Button type="upload" disabled={view} onClick={() => upload.current?.click()}>파일업로드</Button>
          </div>
          <div style={{ height: 150, marginLeft: 85, width: 700 }}>
            <SingleGrid<FileInfo> rowData={files} columnDefs={fileColumns} getRowId={p => String(p.data.fileId)} />
          </div>
          <div style={{ ...row, marginTop: 10, gap: 10 }}>
            <span style={LABEL}>공유</span>
            <Input readOnly disabled={!shareEnabled} style={{ width: 520 }} value={shareInfo} />
            <Button type="register" disabled={!shareEnabled} onClick={lookupShare}>설정</Button>
            {/* [E1] privateYn[비공개].ValueChange [privateYn.getValue()] (L191) → setShareEnabled() */}
            <Checkbox checked={privateYn} disabled={view} onChange={e => setPrivateYn(e.target.checked)}>비공개</Checkbox>
          </div>
        </div>
      </LookupModal>
      <Crm15_Lookup_Share workDetailId={shareOpen ? id : null} onResult={setShareInfo} onClose={() => setShareOpen(false)} />
      <Fnd01_Lookup_SelectMulti open={fundOpen} excludeIds={funds.map(f => f.fundId)} onSelect={onFundsPicked} onClose={() => setFundOpen(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      <FileUpdownForm ref={upload} onChange={f => void onFile(f)} />
    </>
  );
};
