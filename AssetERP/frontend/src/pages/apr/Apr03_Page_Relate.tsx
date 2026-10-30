/**
 * 문서 상세의 오른쪽 패널 (V01) — 위 탭 7개(첨부파일·연관법규·연관내규·연관펀드·연관일임·연관문서·날인신청) + 아래 결재선 그리드
 * AS-IS: myApp/client/vi/apr/Apr03_Page_Relate.java (2181줄) + Apr01_Grid_ApprFile (861줄) + Apr16_Grid_StampDoc/StampApplList — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L210-346: [첨부파일 옵션설정][등록] 툴바 40 + 탭(가운데 위 0.5) + [결재선 설정][직급순 재정렬] 툴바 40 + 결재선 그리드(아래 0.5)
 * V01은 읽기만이다: 툴바의 네 단추는 편집 모드(상신·반려·임시저장 본인 / 관리자)에서만 켜지므로 V03에서 더한다(retrieve L925-997 editable). 연관 그리드의 삭제·설정 열은 편집 모드에서만 보인다 → 이 단계에서는 숨긴 상태
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { aprDetailApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { AprApprDetail, AprApprFile, AprApprAdv, AprApprFund, AprApprStampAppl, AprApprStep, AprRelateAppr, AprRelateLaw } from '@/types/apr';
import { FileInfo } from '@/types/sys';
import { PageTabs } from '@/components/tabs/PageTabs';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Apr01_Edit_Message } from './Apr01_Edit_Message';

const gbFile = gbFor<AprApprFile>();
const gbFund = gbFor<AprApprFund>();
const gbAdv = gbFor<AprApprAdv>();
const gbAppr = gbFor<AprRelateAppr>();
const gbLaw = gbFor<AprRelateLaw>();
const gbStamp = gbFor<AprApprStampAppl>();
const gbStep = gbFor<AprApprStep>();

const NEXT_V04 = '이 창은 V04(사후 처리)에서 연결합니다.';

/** specialCharacters(size) — 숫자를 작은 네모 안에, 0보다 크면 탭 글자가 빨강(clearPanel L2093-2170) */
const tabLabel = (title: string, count: number) => (
  <span style={{ color: count > 0 ? '#E3463D' : '#000000', fontSize: 12, fontWeight: 'bold' }}>
    {title}
    <span style={{ display: 'inline-block', position: 'relative', top: -1, marginLeft: 8, width: 14, height: 14, lineHeight: '14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.3)', borderRadius: 4, background: 'white', fontSize: 10 }}>{count}</span>
  </span>
);

/** addApprStep: 굵게·가운데, 인감·승인은 파랑, 반려는 빨강 */
const stepStyle = (p: { value?: string | null }) => {
  const v = p.value ?? '';
  const color = v === '인감' || v === '승인' ? '#4472C4' : v === '반려' ? '#DD5E5E' : undefined;
  return <span style={{ fontWeight: 'bold', color }}>{v}</span>;
};
const boldCenter = (p: { value?: string | null }) => <span style={{ fontWeight: 'bold' }}>{p.value ?? ''}</span>;

interface Props {
  doc: AprApprDetail;
}

export const Apr03_Page_Relate: React.FC<Props> = ({ doc }) => {
  const user = useLoginUser();
  const [files, setFiles] = useState<AprApprFile[]>([]);
  const [ics, setIcs] = useState<AprRelateLaw[]>([]);
  const [icr, setIcr] = useState<AprRelateLaw[]>([]);
  const [funds, setFunds] = useState<AprApprFund[]>([]);
  const [advs, setAdvs] = useState<AprApprAdv[]>([]);
  const [apprs, setApprs] = useState<AprRelateAppr[]>([]);
  const [stamps, setStamps] = useState<AprApprStampAppl[]>([]);
  const [steps, setSteps] = useState<AprApprStep[]>([]);
  const [activeKey, setActiveKey] = useState('0');
  const [opinion, setOpinion] = useState<string | null>(null);
  const [viewFile, setViewFile] = useState<AprApprFile | null>(null);

  // [E0] 화면 열림 (생성자 L210-346) → pannelEvents() L348-413
  // [E1] apprFileList (Apr01_Grid_ApprFile).callbackOnCreate (L135) · [E2] relateCorpDocList (Apr16_Grid_StampDoc).callbackOnCreate (L146) · [E8]~[E17] 연관 그리드 store Add/Remove → clearPanel():
  //   탭 글자의 개수·색(0보다 크면 빨강)과 처음 값이 있는 탭 열기를 모두 아래 상태(개수)에서 바로 계산한다
  // retrieve() L925-997: retrieveRelateFundGrid·AdvGrid·ApprGrid·IcsGrid·IcrGrid·ApprStepGrid + 첨부파일(setApprFileList)·날인신청(setCorpDocList)
  const retrieve = useCallback(async () => {
    try {
      const id = doc.apprId;
      const [fileList, icsList, icrList, fundList, advList, apprList, stampList, stepList] = await Promise.all([
        aprDetailApi.getFiles(id), aprDetailApi.getRelateIcs(id), aprDetailApi.getRelateIcr(id), aprDetailApi.getFunds(id),
        aprDetailApi.getAdvs(id), aprDetailApi.getRelateApprs(id), aprDetailApi.getStampAppls(id), aprDetailApi.getSteps(id),
      ]);
      setFiles(fileList); setIcs(icsList); setIcr(icrList); setFunds(fundList); setAdvs(advList); setApprs(apprList); setStamps(stampList);
      // 결재선은 서버가 주는 순서(seq)대로 둔다 — buildApprStepGrid L1605의 결재상태 정렬(StoreSortInfo)은 쓰지 않았다(작업방법 "다른 점")
      setSteps(stepList);
      // clearPanel(0): 처음 값이 있는 탭을 연다
      const counts = [fileList.length, icsList.length, icrList.length, fundList.length, advList.length, apprList.length, stampList.length];
      const first = counts.findIndex(c => c > 0);
      setActiveKey(String(first < 0 ? 0 : first));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [doc.apprId]);

  useEffect(() => { void retrieve(); }, [retrieve]);

  // fileDownloadCheck() L839-856: 결재선에 내가 있거나 결재완료(30)가 아니면 받기 열을 숨긴다
  const canDown = useMemo(() => doc.statusCode === '30' || steps.some(s => s.apprEmpId != null && s.apprEmpId === user.userId), [doc.statusCode, steps, user.userId]);

  // buildGrid() (Apr01_Grid_ApprFile L690-727): 첨부파일 · "확정문서" · 받기 · (삭제=편집 모드만) · 보기 · 출력
  const fileCols = useMemo<ColDef<AprApprFile>[]>(() => {
    const cols: ColDef<AprApprFile>[] = [
      gbFile.text('fileName', canDown ? 405 : 465, '첨부파일'),
      { colId: 'fileYnCheck', headerName: ' ', width: 65, valueGetter: p => (p.data?.fileYn === 'true' ? '확정문서' : ' ') },
    ];
    if (canDown) cols.push(iconCell<AprApprFile>('down', 'downAction', 50, '받기', row => { void fileApi.download(row.fileId); }));
    cols.push(iconCell<AprApprFile>('view', 'viewAction', 50, '보기', row => setViewFile(row)));
    cols.push(gbFile.booleanYn2('printYn', 50, '출력'));
    return cols;
  }, [canDown]);

  // buildRelateIcsGrid L1506-1551 / buildRelateIcrGrid L1554-1599: 법규명(내규명) 405 · 주기 80 · 마감일 100 · 설정/삭제(편집 모드만) · 상세보기 60
  const lawCols = (title: string): ColDef<AprRelateLaw>[] => [
    gbLaw.textArea('classTreeFullName', 405, title),
    gbLaw.text('cycleName', 80, '주기'),
    gbLaw.date('closeDate', 100, '마감일'),
    // [E] viewCell → Apr20_Lookup_RelateIcs.view / Apr22_Lookup_RelateIcr.view — 연관 설정 창은 V03에서
    iconCell<AprRelateLaw>('view', 'viewAction', 60, '상세보기', () => message.info('연관법규·내규 창은 V03에서 연결합니다.')),
  ];

  // buildRelateFundGrid L1390-1412: 펀드유형 80 · 코드 80 · 연관펀드명 310(삭제 숨김 시 390) · 결재이후 80 · 출력 80
  const fundCols = useMemo<ColDef<AprApprFund>[]>(() => [
    gbFund.text('fundTypeName', 80, '펀드유형'),
    gbFund.text('fundCode', 80, '코드'),
    gbFund.text('fundName', 390, '연관펀드명'),
    gbFund.booleanYn2('afterYn', 80, '결재이후'),
    gbFund.boolean('printYn', 80, '출력'),
  ], []);

  // buildRelateAdvGrid L1415-1434: 코드 130 · 일임계좌명 500(삭제 숨김 시 580)
  const advCols = useMemo<ColDef<AprApprAdv>[]>(() => [
    gbAdv.text('manageCode', 130, '코드'),
    gbAdv.text('manageName', 580, '일임계좌명'),
  ], []);

  // buildRelateApprGrid L1437-1503: 구분 50 · 등록일 100 · 문서명 400(삭제 숨김 시 480) · 미리보기 80
  const apprCols = useMemo<ColDef<AprRelateAppr>[]>(() => [
    gbAppr.textCenter('inOutTypeName', 50, '구분'),
    gbAppr.date('targetRegDate', 100, '등록일'),
    gbAppr.text('targetTitle', 480, '문서명'),
    // [E] viewCell → PDFViewer(apr.Apr10_StampPDF7) — 문서 PDF 미리보기는 V04
    iconCell<AprRelateAppr>('view', 'viewAction', 80, '미리보기', () => message.info(`PDF 미리보기: ${NEXT_V04}`)),
  ], []);

  // Apr16_Grid_StampApplList: 구분 110 · 인감 및 대표명의 220 · 부수 40 · 반출 40
  const stampCols = useMemo<ColDef<AprApprStampAppl>[]>(() => [
    gbStamp.text('applTypeName', 110, '구분'),
    gbStamp.text('stampReprCorpName', 220, '인감 및 대표명의'),
    gbStamp.longCenter('applQty', 40, '부수'),
    gbStamp.booleanYn2('stampOutYn', 40, '반출'),
  ], []);

  // buildApprStepGrid L1602-1680: 구분 65 · 결재상태 65 · 결재일 100 · ▲ 25 · 결재자 280 · ▼ 25 · 의견 45 · 보기 25 · 수정 45 · 보기 25
  const stepCols = useMemo<ColDef<AprApprStep>[]>(() => [
    gbStep.text('stepTypeName', 65, '구분', { cellRenderer: stepStyle, cellStyle: { textAlign: 'center' } }),
    gbStep.text('stepStatusName', 65, '결재상태', { cellRenderer: stepStyle, cellStyle: { textAlign: 'center' } }),
    gbStep.date('apprDate', 100, '결재일'),
    // ▲▼ = changeRow("up"/"down") L1682-1725 — 결재선 수정은 V03(상신·임시저장)에서
    { colId: 'upAction', headerName: '', width: 25, cellRenderer: () => '▲', onCellClicked: () => message.info('결재선 수정은 V03에서 연결합니다.'), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    gbStep.textHtml('stepApprName', 280, '결재자'),
    { colId: 'downAction', headerName: '', width: 25, cellRenderer: () => '▼', onCellClicked: () => message.info('결재선 수정은 V03에서 연결합니다.'), cellStyle: { cursor: 'pointer', textAlign: 'center' } },
    gbStep.text('opinionYnStr', 45, ' ', { cellRenderer: boldCenter, cellStyle: { textAlign: 'center' } }),
    // opinionCell L1621-1640: 의견이 없으면 "해당 문서에 대한 의견이 없습니다", 있으면 Apr01_Edit_Message
    iconCell<AprApprStep>('view', 'opinionAction', 25, ' ', row => {
      if ((row.opinionYnStr ?? '').length > 1) setOpinion(row.note ?? row.rejectReason ?? '');
      else message.info('해당 문서에 대한 의견이 없습니다');
    }),
    gbStep.text('typoYnStr', 45, ' ', { cellRenderer: boldCenter, cellStyle: { textAlign: 'center' } }),
    // typoCell L1641-1666: 수정사항이 없으면 "해당 문서에 대한 수정사항이 없습니다", 있으면 Apr01_Edit_ApprModi(오타수정 창) — V04
    iconCell<AprApprStep>('view', 'typoAction', 25, ' ', row => {
      if ((row.typoYnStr ?? '').length > 1) message.info(`오타수정 내역 창: ${NEXT_V04}`);
      else message.info('해당 문서에 대한 수정사항이 없습니다');
    }),
  ], []);

  const toFileInfo = (f: AprApprFile): FileInfo => ({ fileId: f.fileId, parentId: doc.apprId, fileNm: f.fileName, fileExt: f.fileExt ?? null });

  // [E22] plainTabPanel.Selection (L2024) → enableFileButton(): 첨부파일 탭일 때만 [첨부파일 옵션설정]이 켜진다 — 그 단추 자체가 V03(편집 모드)이라 이 단계에서는 탭만 바꾼다
  // [E3] optionsButton[첨부파일 옵션설정] · [E4] insertButton[등록] · [E5][E6] reArrangeButton[직급순 재정렬] · [E7] apprStepLineButton[결재선 설정] · [E18][E19][E21] fileUpload · [E20] editor.callbackOnCreate — 편집 모드 전용이라 V03(상신·임시저장)에서 연결한다
  const items = [
    { key: '0', label: tabLabel('첨부파일', files.length), children: <SingleGrid<AprApprFile> rowData={files} columnDefs={fileCols} getRowId={p => String(p.data.fileId)} /> },
    { key: '1', label: tabLabel('연관법규', ics.length), children: <SingleGrid<AprRelateLaw> rowData={ics} columnDefs={lawCols('법규명')} getRowId={p => String(p.data.relateId)} /> },
    { key: '2', label: tabLabel('연관내규', icr.length), children: <SingleGrid<AprRelateLaw> rowData={icr} columnDefs={lawCols('내규명')} getRowId={p => String(p.data.relateId)} /> },
    { key: '3', label: tabLabel('연관펀드', funds.length), children: <SingleGrid<AprApprFund> rowData={funds} columnDefs={fundCols} getRowId={p => String(p.data.relateFundId)} /> },
    { key: '4', label: tabLabel('연관일임', advs.length), children: <SingleGrid<AprApprAdv> rowData={advs} columnDefs={advCols} getRowId={p => String(p.data.relateAdvId)} /> },
    { key: '5', label: tabLabel('연관문서', apprs.length), children: <SingleGrid<AprRelateAppr> rowData={apprs} columnDefs={apprCols} getRowId={p => String(p.data.relateApprId)} /> },
    { key: '6', label: tabLabel('날인신청', stamps.length), children: <SingleGrid<AprApprStampAppl> rowData={stamps} columnDefs={stampCols} getRowId={p => String(p.data.stampDocId)} /> },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
      {/* plainTabPanel (가운데 위 0.5) */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <PageTabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={items.map(it => ({ ...it, children: <div style={{ height: '100%' }}>{it.children}</div> }))}
          style={{ height: '100%' }}
          size="small"
        />
      </div>
      {/* apprStepGrid (아래 0.5) */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprApprStep>
          rowData={steps}
          columnDefs={stepCols}
          getRowId={p => String(p.data.apprStepId)}
          getRowHeight={p => ((p.data?.stepApprName ?? '').includes('<br>') ? 56 : undefined)}
        />
      </div>
      <Apr01_Edit_Message message={opinion} onClose={() => setOpinion(null)} />
      <Sys10_Lookup_FileViewer file={viewFile ? toFileInfo(viewFile) : null} onClose={() => setViewFile(null)} />
    </div>
  );
};
