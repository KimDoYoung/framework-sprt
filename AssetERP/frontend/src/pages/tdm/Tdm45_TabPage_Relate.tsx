/**
 * 매뉴얼 규정/양식 연결(N27)의 오른쪽 5단 목록 — 고른 점검항목의 관련조문·연관법규·연관내규·연관양식·연관문서분류
 * AS-IS: myApp/client/vi/tdm/Tdm45_TabPage_Relate.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L52-65: 세로 5등분(각 0.2) — refBasisGrid(관련조문 290 + 수정 40) · icsGrid(연관법규 250 + 보기 40 + 삭제 40) · icrGrid(연관내규) ·
 *   formGrid(연관양식 250 + 보기 + 삭제) · dcrGrid(연관문서분류 290 + 삭제 40). 모두 행번호 숨김
 * UX보강(10): 해당 없음
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmManlList, TdmManlRelates } from '@/types/tdm';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Icr01_Lookup_ClassTreeDetail } from '@/components/lookup/Icr01_Lookup_ClassTreeDetail';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Tdm43_Lookup_RefBasis } from './Tdm43_Lookup_RefBasis';

type IcsRow = TdmManlRelates['ics'][number];
type IcrRow = TdmManlRelates['icr'][number];
type FormRow = TdmManlRelates['forms'][number];
type DcrRow = TdmManlRelates['dcrs'][number];

const refGb = gbFor<TdmManlList>();
const icsGb = gbFor<IcsRow>();
const icrGb = gbFor<IcrRow>();
const formGb = gbFor<FormRow>();
const dcrGb = gbFor<DcrRow>();

interface Props {
  /** manlGrid에서 한 건만 골랐을 때 그 행, 아니면 null (AS-IS retrieve() L250-270 — 하나가 아니면 목록을 비우고 tabPage는 비활성) */
  manl: TdmManlList | null;
  /** 연결을 더한 뒤처럼 같은 행을 다시 읽게 하는 번호 (AS-IS tabPage.retrieve() 호출마다 +1) */
  nonce: number;
  /** manlGrid.getStore().update(model) — 관련조문 수정·연결 삭제 뒤 */
  onRowChanged: (row: TdmManlList) => void;
}

const confirmBox = (what: string, width?: number) => new Promise<boolean>(resolve => {
  Modal.confirm({ title: '삭제', content: `선택한 ${what}를 삭제하시겠습니까?`, okText: '예', cancelText: '아니오', width, onOk: () => resolve(true), onCancel: () => resolve(false) });
});

export const Tdm45_TabPage_Relate: React.FC<Props> = ({ manl, nonce, onRowChanged }) => {
  const [ics, setIcs] = useState<IcsRow[]>([]);
  const [icr, setIcr] = useState<IcrRow[]>([]);
  const [forms, setForms] = useState<FormRow[]>([]);
  const [dcrs, setDcrs] = useState<DcrRow[]>([]);
  const [refEdit, setRefEdit] = useState<TdmManlList | null>(null);
  const [icsDetail, setIcsDetail] = useState<number | null>(null);
  const [icrDetail, setIcrDetail] = useState<number | null>(null);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);

  // retrieve() L250-270 · retrieveIcs·Icr·Form·Dcr() L272-322: tdm.Tdm45_ManlRelateIcs.selectByManlId · Tdm46_… · sys.Sys11_RelateFile.selectByParentId · Tdm47_…
  const manlId = manl?.manlId;
  const manlOrgId = manl?.manlOrgId;
  const retrieve = useCallback(async () => {
    setIcs([]); setIcr([]); setForms([]); setDcrs([]);
    if (manlId == null || manlOrgId == null) return;
    try {
      const r = await tdmApi.getManlRelates(manlOrgId, manlId);
      setIcs(r.ics); setIcr(r.icr); setForms(r.forms); setDcrs(r.dcrs);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [manlId, manlOrgId]);
  // [E0] 화면 열림 (생성자 L52-65) → 초기화. 목록은 부모가 고른 행이 바뀔 때마다 retrieve()
  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  // deleteEnd() L324-335: tdm.Tdm43_Manl.selectById(manlId) → manlGrid.getStore().update(...)
  const deleteEnd = async () => {
    if (!manl) return;
    try {
      onRowChanged(await tdmApi.getManlRow(manl.manlId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E1] messageBox.DialogHide [YES] (L105) → GridDeleteData tdm.Tdm45_ManlRelateIcs.delete → deleteEnd()
  // [E2] messageBox.DialogHide [YES] (L146) → tdm.Tdm46_ManlRelateIcr.delete → deleteEnd()
  // [E3] messageBox.DialogHide [YES] (L187) → sys.Sys11_RelateFile.delete → deleteEnd()
  // [E4] messageBox.DialogHide [YES] (L221) → tdm.Tdm47_ManlRelateDcr.delete → deleteEnd()
  const remove = async (what: string, width: number | undefined, kind: 'ics' | 'icr' | 'form' | 'dcr', relateId: number | undefined, drop: () => void) => {
    if (!manl || relateId == null) return;
    if (!await confirmBox(what, width)) return;
    try {
      await tdmApi.deleteManlRelate(manl.manlOrgId, manl.manlId, kind, relateId);
      drop();
      await deleteEnd();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // refBasisBuildGrid() L67-90 (관련조문 290 + 수정 40, 칸 높이 150)
  const refCols = useMemo(() => [
    refGb.textArea('refBasis', 290, '관련조문'),  // L85 addTextLimitArea
    iconCell<TdmManlList>('edit', 'modi', 40, '수정', row => setRefEdit(row)),  // L86 → Tdm43_Lookup_RefBasis
  ], []);
  // icsBuildGrid() L92-131
  const icsCols = useMemo(() => [
    icsGb.text('icsClassTreeName', 250, '연관법규'),  // L126
    iconCell<IcsRow>('view', 'view', 40, '보기', row => setIcsDetail(row.icsClassTreeId)),  // L127 → Ics01_Lookup_ClassTreeDetail.open
    iconCell<IcsRow>('delete', 'del', 40, '삭제', row => void remove('법규', undefined, 'ics', row.manlRelateIcsId, () => setIcs(p => p.filter(r => r !== row)))),  // L128
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [manl]);
  // icrBuildGrid() L133-172
  const icrCols = useMemo(() => [
    icrGb.text('icrClassTreeName', 250, '연관내규'),  // L167
    iconCell<IcrRow>('view', 'view', 40, '보기', row => setIcrDetail(row.icrClassTreeId)),  // L168 → Icr01_Lookup_ClassTreeDetail.open
    iconCell<IcrRow>('delete', 'del', 40, '삭제', row => void remove('내규', undefined, 'icr', row.manlRelateIcrId, () => setIcr(p => p.filter(r => r !== row)))),  // L169
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [manl]);
  // formBuildGrid() L174-213
  const formCols = useMemo(() => [
    formGb.text('fileName', 250, '연관양식'),  // L208
    iconCell<FormRow>('view', 'view', 40, '보기', row => setViewFile({ fileId: row.fileId, parentId: manl?.manlId ?? 0, fileNm: row.fileName ?? '', fileExt: (row.fileName ?? '').split('.').pop() })),  // L209 → Sys10_Lookup_FileViewer.open
    iconCell<FormRow>('delete', 'del', 40, '삭제', row => void remove('양식', undefined, 'form', row.relateFileId, () => setForms(p => p.filter(r => r !== row)))),  // L210
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [manl]);
  // dcrBuildGrid() L215-248 (확인창 폭 370)
  const dcrCols = useMemo(() => [
    dcrGb.textArea('dcrClassTreeFullName', 290, '연관문서분류'),  // L244
    iconCell<DcrRow>('delete', 'del', 40, '삭제', row => void remove('문서분류', 370, 'dcr', row.manlRelateDcrId, () => setDcrs(p => p.filter(r => r !== row)))),  // L245
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [manl]);

  const cell = (child: React.ReactNode) => <div style={{ flex: 1, minHeight: 0, borderBottom: '1px solid #e8e8e8' }}>{child}</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: manl ? 1 : 0.5, pointerEvents: manl ? 'auto' : 'none' }}>
      {cell(<SingleGrid<TdmManlList> rowNumber={false} rowHeight={150} rowData={manl ? [manl] : []} columnDefs={refCols} getRowId={p => String(p.data.manlId)} />)}
      {cell(<SingleGrid<IcsRow> rowNumber={false} rowData={ics} columnDefs={icsCols} getRowId={p => String(p.data.manlRelateIcsId)} />)}
      {cell(<SingleGrid<IcrRow> rowNumber={false} rowData={icr} columnDefs={icrCols} getRowId={p => String(p.data.manlRelateIcrId)} />)}
      {cell(<SingleGrid<FormRow> rowNumber={false} rowData={forms} columnDefs={formCols} getRowId={p => String(p.data.relateFileId)} />)}
      {cell(<SingleGrid<DcrRow> rowNumber={false} rowData={dcrs} columnDefs={dcrCols} getRowId={p => String(p.data.manlRelateDcrId)} />)}
      <Tdm43_Lookup_RefBasis target={refEdit} onSaved={row => { setRefEdit(row); onRowChanged(row); }} onClose={() => setRefEdit(null)} />
      <Ics01_Lookup_ClassTreeDetail classTreeId={icsDetail} onClose={() => setIcsDetail(null)} />
      <Icr01_Lookup_ClassTreeDetail classTreeId={icrDetail} onClose={() => setIcrDetail(null)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
};
