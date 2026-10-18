/**
 * 점검항목의 관련조문·연관법규·연관내규·연관양식·연관문서분류 탭 (E13-2) — Tdm43_Edit_Manl 안에 놓인다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Page_Relate.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L90-121: 위 [추가] 버튼 + 5개 탭(관련조문 TextArea · 연관법규·연관내규·연관양식(그리드 법규명/내규명/파일명 350 + 보기 35 + 삭제 35) · 연관문서분류(문서분류명 450 + 삭제 35))
 * 탭 제목 옆 건수 배지(clearPanel L709-767) — 건수가 있으면 파랑. 열리면 건수가 있는 첫 탭을 보인다
 * 연관내규·연관문서분류의 [추가]·내규 보기는 ICR·DCR 조회창(다른 도메인, TOBE 없음)이 없어 안내만 한다. 이미 연결된 것의 조회·삭제는 한다
 */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Tabs } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmManlFormFile, TdmManlItem, TdmManlRelates } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Ics01_Lookup_SelectMulti } from '../ics/Ics01_Lookup_SelectMulti';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Tdm43_Lookup_RelateFormFileList } from './Tdm43_Lookup_RelateFormFileList';

type IcsRow = TdmManlRelates['ics'][number];
type IcrRow = TdmManlRelates['icr'][number];
type FormRow = TdmManlRelates['forms'][number];
type DcrRow = TdmManlRelates['dcrs'][number];

/** 저장할 때 서버로 보내는 "창을 연 뒤 새로 고른" 연결 (이미 저장된 것은 id가 있어 제외) */
export interface RelateNew {
  relateIcsClassTreeIds: number[];
  relateIcrClassTreeIds: number[];
  relateFormFileIds: number[];
  relateDcrClassTreeIds: number[];
}

export interface Tdm43_Page_RelateHandle {
  /** AS-IS getRefBasis() L565-567 */
  getRefBasis: () => string;
  /** AS-IS getRelateIcsList·IcrList·FormList·DcrList L505-563 중 새로 추가한 행 */
  getNew: () => RelateNew;
  /** 저장한 뒤 연결 목록을 다시 읽는다(새로 넣은 연결에 id가 붙는다) */
  reload: () => Promise<void>;
}

interface Props {
  /** AS-IS retrieve(manlModel) L257-265 — 점검항목(등록은 새 번호만 채운 모델) */
  manl: TdmManlItem;
  /** AS-IS updateYn(boolean) L123-125 — false면 [추가]·삭제 아이콘이 없다(보기 창) */
  updateYn: boolean;
}

const icsGb = gbFor<IcsRow>();
const icrGb = gbFor<IcrRow>();
const formGb = gbFor<FormRow>();
const dcrGb = gbFor<DcrRow>();
const NEXT_STEP = '내규(ICR)·문서분류(DCR) 조회창은 아직 변환하지 않았습니다(별도 ID).';

export const Tdm43_Page_Relate = forwardRef<Tdm43_Page_RelateHandle, Props>(({ manl, updateYn }, ref) => {
  // [E0] 화면 열림 (생성자 L90-121) → settings(): 5개 탭(관련조문·연관법규·연관내규·연관양식·연관문서분류)과 [추가] 버튼. 목록은 아래 load()가 연다(retrieve)
  const [tab, setTab] = useState('ref');
  const [refBasis, setRefBasis] = useState(manl.refBasis ?? '');
  const [ics, setIcs] = useState<IcsRow[]>([]);
  const [icr, setIcr] = useState<IcrRow[]>([]);
  const [forms, setForms] = useState<FormRow[]>([]);
  const [dcrs, setDcrs] = useState<DcrRow[]>([]);
  const [icsLookup, setIcsLookup] = useState(false);
  const [formLookup, setFormLookup] = useState(false);
  const [icsDetail, setIcsDetail] = useState<number | null>(null);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const loadedFor = useRef<number | null>(null);
  const loadRef = useRef<(keepTab?: boolean) => Promise<void>>(async () => undefined);

  useImperativeHandle(ref, () => ({
    getRefBasis: () => refBasis,
    reload: () => loadRef.current(true),
    getNew: () => ({
      relateIcsClassTreeIds: ics.filter(r => r.manlRelateIcsId == null).map(r => r.icsClassTreeId),
      relateIcrClassTreeIds: icr.filter(r => r.manlRelateIcrId == null).map(r => r.icrClassTreeId),
      relateFormFileIds: forms.filter(r => r.relateFileId == null).map(r => r.fileId),
      relateDcrClassTreeIds: dcrs.filter(r => r.manlRelateDcrId == null).map(r => r.dcrClassTreeId),
    }),
  }), [refBasis, ics, icr, forms, dcrs]);

  // retrieve() L257-265 → retrieveRelateIcsGrid·IcrGrid·FormGrid·DcrGrid → clearPanel(0): 건수가 있는 첫 탭을 보인다
  const load = async (keepTab = false): Promise<void> => tdmApi.getManlRelates(manl.manlOrgId, manl.manlId).then(r => {
    setIcs(r.ics); setIcr(r.icr); setForms(r.forms); setDcrs(r.dcrs);
    if (keepTab) return;
    const first = [r.ics.length, r.icr.length, r.forms.length, r.dcrs.length].findIndex(n => n > 0);
    setTab(first < 0 ? 'ref' : ['ics', 'icr', 'form', 'dcr'][first]);
  }).catch(err => { message.error(errorMessage(err, '조회 실패')); });
  loadRef.current = load;
  useEffect(() => {
    if (loadedFor.current === manl.manlId) return;
    loadedFor.current = manl.manlId;
    setRefBasis(manl.refBasis ?? '');
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manl.manlId, manl.manlOrgId, manl.refBasis]);

  /** clearPanel(num) L709-767: 탭 제목 "연관법규 [n]" — 건수가 있으면 파랑 굵게 */
  const label = (title: string, n: number) => (
    <b style={{ color: n > 0 ? '#106EBE' : '#000', fontSize: 12 }}>
      {title}
      <span style={{ display: 'inline-block', marginLeft: 8, minWidth: 14, height: 14, lineHeight: '14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.3)', borderRadius: 7, fontSize: 10, padding: '0 2px' }}>{n}</span>
    </b>
  );

  // 삭제 아이콘: HtmlMessageBox "삭제" + "선택한 …을 삭제하시겠습니까?" → [YES] → GridDeleteData.delete(…) (저장 안 한 새 연결은 서버 호출 없이 그리드에서만 뺀다)
  // [E4] relateIcsGrid.StoreRemove (L195)·[E6] relateIcrGrid.StoreRemove (L209)·[E8] relateFormGrid.StoreRemove (L223)·[E10] relateDcrGrid.StoreRemove (L237) → clearPanel(n): 그리드에서 빼면 탭 제목 건수가 줄어든다
  // [E11] messageBox.DialogHide [YES] (L380) → tdm.Tdm45_ManlRelateIcs.delete·[E12] (L416) → Tdm46_ManlRelateIcr.delete·[E13] (L452) → sys.Sys11_RelateFile.delete·[E14] (L481) → Tdm47_ManlRelateDcr.delete
  const confirmDelete = (what: string, width: number | undefined, id: number | undefined, kind: 'ics' | 'icr' | 'form' | 'dcr', remove: () => void) => {
    Modal.confirm({
      title: '삭제',
      content: `선택한 ${what}를 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width,
      onOk: async () => {
        try {
          if (id != null) await tdmApi.deleteManlRelate(manl.manlOrgId, manl.manlId, kind, id);
          remove();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildRelateIcsGrid() L367-401
  const icsCols = useMemo(() => [
    icsGb.text('icsClassTreeName', 350, '법규명'),  // L396
    iconCell<IcsRow>('view', 'view', 35, '보기', row => setIcsDetail(row.icsClassTreeId)),  // L397 → Ics01_Lookup_ClassTreeDetail.open
    ...(updateYn ? [iconCell<IcsRow>('delete', 'del', 35, '삭제', row =>  // L398 [E11]
      confirmDelete('법규', undefined, row.manlRelateIcsId, 'ics', () => setIcs(p => p.filter(r => r !== row))))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [updateYn]);
  // buildRelateIcrGrid() L403-437 — 보기(Icr01_Lookup_ClassTreeDetail)는 ICR 조회창이 없어 안내
  const icrCols = useMemo(() => [
    icrGb.text('icrClassTreeName', 350, '내규명'),  // L432
    iconCell<IcrRow>('view', 'view', 35, '보기', () => message.info(NEXT_STEP)),  // L433
    ...(updateYn ? [iconCell<IcrRow>('delete', 'del', 35, '삭제', row =>  // L434 [E12]
      confirmDelete('내규', undefined, row.manlRelateIcrId, 'icr', () => setIcr(p => p.filter(r => r !== row))))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [updateYn]);
  // buildRelateFormGrid() L439-473
  const formCols = useMemo(() => [
    formGb.text('fileName', 350, '파일명'),  // L468
    iconCell<FormRow>('view', 'view', 35, '보기', row => setViewFile({ fileId: row.fileId, parentId: manl.manlId, fileNm: row.fileName ?? '', fileExt: (row.fileName ?? '').split('.').pop() })),  // L469 → Sys10_Lookup_FileViewer.open
    ...(updateYn ? [iconCell<FormRow>('delete', 'del', 35, '삭제', row =>  // L470 [E13]
      confirmDelete('양식', undefined, row.relateFileId, 'form', () => setForms(p => p.filter(r => r !== row))))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [updateYn, manl.manlId]);
  // buildRelateDcrGrid() L475-502
  const dcrCols = useMemo(() => [
    dcrGb.textArea('dcrClassTreeFullName', 450, '문서분류명'),  // L498
    ...(updateYn ? [iconCell<DcrRow>('delete', 'del', 35, '삭제', row =>  // L499 [E14]
      confirmDelete('문서분류', 380, row.manlRelateDcrId, 'dcr', () => setDcrs(p => p.filter(r => r !== row))))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [updateYn]);

  // [E2] insertButton[추가].Select (L181) → insert() L245-255: 활성 탭에 따라 연관법규·내규·양식·문서분류 조회창을 연다
  // [E5 생략] relateIcrGrid.StoreAdd (L203)·[E9 생략] relateDcrGrid.StoreAdd (L231): ICR·DCR 조회창이 없어 연관내규·연관문서분류에 새 연결을 더하는 곳이 없다
  const insert = () => {
    if (tab === 'ics') setIcsLookup(true);                    // insertRelateIcsList() L569-602 → Ics01_Lookup_SelectMulti.openUnConn("classTree", "TDM45", manlId)
    else if (tab === 'icr') message.info(NEXT_STEP);          // insertRelateIcrList() L604-637 → Icr01_Lookup_SelectMulti
    else if (tab === 'form') setFormLookup(true);             // insertRelateFormList() L639-672 → Tdm43_Lookup_RelateFormFileList.open(manlId)
    else if (tab === 'dcr') message.info(NEXT_STEP);          // insertRelateDcrList() L674-708 → Dcr01_Lookup_SelectMulti
  };

  // inputIcsLine·inputFormLine L315-352: 고른 행을 그리드에 더하고 그 탭을 보인다 (저장은 Tdm43_Edit_Manl [저장]에서)
  // [E3] relateIcsGrid.StoreAdd (L189) → clearPanel(1): 탭 제목 건수가 늘고 그 탭을 보인다(setTab('ics'))
  const addIcs = (list: { classTreeId: number; classTreeCode?: string | null; classTreeName?: string | null }[]) => {
    setIcs(prev => [...prev, ...list.filter(m => !prev.some(r => r.icsClassTreeId === m.classTreeId))
      .map(m => ({ icsClassTreeId: m.classTreeId, icsClassTreeCode: m.classTreeCode, icsClassTreeName: m.classTreeName }))]);
    setTab('ics');
  };
  // [E7] relateFormGrid.StoreAdd (L217) → clearPanel(3)
  const addForms = (list: TdmManlFormFile[]) => {
    setForms(prev => [...prev, ...list.filter(m => !prev.some(r => r.fileId === m.fileId))
      .map(m => ({ fileId: m.fileId, fileName: m.fileName, regDate: m.regDate }))]);
    setTab('form');
  };

  // [E1] plainTabPanel.Selection (L163) → buttonSettings(): 연관 탭이 아니면(관련조문) [추가]를 끈다
  const addEnabled = updateYn && tab !== 'ref';

  const grid = <T extends object>(rows: T[], cols: ColDefs<T>, key: (r: T, i: number) => string) => (
    <div style={{ height: 170 }}><SingleGrid<T> rowData={rows} columnDefs={cols} getRowId={p => key(p.data, 0)} /></div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div><Button type="register" disabled={!addEnabled} onClick={insert}>추가</Button></div>
      <Tabs
        size="small"
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: 'ref', label: <b style={{ fontSize: 12 }}>관련조문</b>,
            children: <Input.TextArea style={{ height: 170, resize: 'none' }} readOnly={!updateYn} value={refBasis} onChange={e => setRefBasis(e.target.value)} /> },
          { key: 'ics', label: label('연관법규', ics.length), children: grid(ics, icsCols, r => String(r.manlRelateIcsId ?? `n${r.icsClassTreeId}`)) },
          { key: 'icr', label: label('연관내규', icr.length), children: grid(icr, icrCols, r => String(r.manlRelateIcrId ?? `n${r.icrClassTreeId}`)) },
          { key: 'form', label: label('연관양식', forms.length), children: grid(forms, formCols, r => String(r.relateFileId ?? `n${r.fileId}`)) },
          { key: 'dcr', label: label('연관문서분류', dcrs.length), children: grid(dcrs, dcrCols, r => String(r.manlRelateDcrId ?? `n${r.dcrClassTreeId}`)) },
        ]}
      />
      <Ics01_Lookup_SelectMulti open={icsLookup} actionCode="classTree" relateTable="TDM45" relateId={manl.manlId}
        onResult={addIcs} onClose={() => setIcsLookup(false)} />
      <Tdm43_Lookup_RelateFormFileList relateId={formLookup ? manl.manlId : null} onResult={addForms} onClose={() => setFormLookup(false)} />
      <Ics01_Lookup_ClassTreeDetail classTreeId={icsDetail} onClose={() => setIcsDetail(null)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
});

type ColDefs<T> = import('ag-grid-community').ColDef<T>[];
