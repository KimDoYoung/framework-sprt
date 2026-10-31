/**
 * 문서 상세의 오른쪽 패널 (V01) — 위 탭 7개(첨부파일·연관법규·연관내규·연관펀드·연관일임·연관문서·날인신청) + 아래 결재선 그리드
 * AS-IS: myApp/client/vi/apr/Apr03_Page_Relate.java (2181줄) + Apr01_Grid_ApprFile (861줄) + Apr16_Grid_StampDoc/StampApplList — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L210-346: [첨부파일 옵션설정][등록] 툴바 40 + 탭(가운데 위 0.5) + [결재선 설정][직급순 재정렬] 툴바 40 + 결재선 그리드(아래 0.5)
 * V01은 읽기만이다: 툴바의 네 단추는 편집 모드(상신·반려·임시저장 본인 / 관리자)에서만 켜진다(retrieve L925-997 editable). 연관 그리드의 삭제·설정 열은 편집 모드에서만 보인다 → 연관 설정은 V05
 * V05: 첨부 툴바 [첨부파일 옵션설정]·[등록](첨부 탭 올리기)·삭제 열을 켠다(연관 탭의 [등록]은 V13).
 * V13 연관 설정: 연관 탭 [등록](insert L1029-1093) — 펀드 Fnd01_Lookup_SelectMulti·일임 Adv02_Lookup_SelectMulti·문서 Apr21_Lookup_RelateAppr·법규 Ics01/내규 Icr01 "deadline" 조회창,
 *   편집 모드의 삭제·설정 열(openButton L1887-1910)과 상세보기(Apr20_Lookup_RelateIcs.view·Apr22_Lookup_RelateIcr.view). 목록은 이 안에 두고 [저장]·[결재요청] 때 부른 쪽이 onRelatesChange 값을 보낸다.
 * V14 날인신청 탭: 원본 Apr16_Grid_StampDoc(왼쪽 [+][-]와 Apr16_Grid_StampApplList 그리드, 오른쪽 제공처·제공목적·비고) — [+]는 SettingPopup 메뉴 → Apr16_Lookup_StampApplQty, 줄은 그 자리에서 DB에 넣고 지운다.
 * V07 편집 모드(editable): 결재선 툴바 [결재선 설정](Apr04_Edit_ApprStep)·[직급순 재정렬](arrayStepTypeCode L1920-1974)과 ▲▼(changeRow L1682-1725)를 켠다. 
 *   새 문서(isNew)는 아직 DB에 없으므로 서버를 읽지 않고 seed(새 문서 열기 응답)로 채운다.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { aprAttachApi, aprDetailApi, aprExtraApi, aprRelateEditApi, aprStampApplApi, aprStepEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { AprTypo, AprApprDetail, AprApprFile, AprApprAdv, AprApprFund, AprApprRelateReq, AprApprStampAppl, AprApprStep, AprLinkRelateAdv, AprLinkRelateAppr, AprLinkRelateFund, AprLoadDoc2, AprRelateAppr, AprRelateIcsRow, AprRelateLaw } from '@/types/apr';
import { FundMulti } from '@/types/fnd';
import { AdvAccount } from '@/types/adv';
import { IcsLawDeadline } from '@/types/ics';
import { IcrClassTreeDeadline } from '@/types/icr';
import { FileInfo } from '@/types/sys';
import { PageTabs } from '@/components/tabs/PageTabs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { Apr01_Edit_Message } from './Apr01_Edit_Message';
import { Apr01_Edit_ApprModi } from './Apr01_Edit_ApprModi';
import { Apr04_Edit_ApprStep, renumber } from './Apr04_Edit_ApprStep';
import { Apr04_Edit_RetouchApprStep } from './Apr04_Edit_RetouchApprStep';
import { Apr01_Lookup_ApprFileList } from './Apr01_Lookup_ApprFileList';
import { Sys61_Lookup_FileList } from '../sys/Sys61_Lookup_FileList';
import { Sys61_Lookup_DelList } from '../sys/Sys61_Lookup_DelList';
import { Fnd01_Lookup_SelectMulti } from '@/components/lookup/Fnd01_Lookup_SelectMulti';
import { Adv02_Lookup_SelectMulti } from '@/components/lookup/Adv02_Lookup_SelectMulti';
import { Ics01_Lookup_SelectMulti } from '../ics/Ics01_Lookup_SelectMulti';
import { Icr01_Lookup_SelectMulti } from '../icr/Icr01_Lookup_SelectMulti';
import { Apr21_Lookup_RelateAppr } from './Apr21_Lookup_RelateAppr';
import { Apr20_Lookup_RelateIcs } from './Apr20_Lookup_RelateIcs';
import { Apr22_Lookup_RelateIcr } from './Apr22_Lookup_RelateIcr';
import { Apr16_Grid_StampDoc } from './Apr16_Grid_StampDoc';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';

const gbFile = gbFor<AprApprFile>();
const gbFund = gbFor<AprApprFund>();
const gbAdv = gbFor<AprApprAdv>();
const gbAppr = gbFor<AprRelateAppr>();
const gbLaw = gbFor<AprRelateLaw>();
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
  /** 편집 모드(상신·임시저장 본인) — 결재선 툴바와 ▲▼를 켠다 (V07) */
  editable?: boolean;
  /** 새 문서 — 서버를 읽지 않고 seed로 채운다 */
  isNew?: boolean;
  seed?: { steps: AprApprStep[]; ics: AprRelateLaw[]; icr: AprRelateLaw[]; apprs?: AprLinkRelateAppr[]; funds?: AprLinkRelateFund[]; advs?: AprLinkRelateAdv[] };
  /** 연관 탭 다섯 개가 바뀔 때마다, 처음 읽은 뒤부터 (저장 때 부른 쪽이 쓴다, V13) */
  onRelatesChange?: (relates: AprApprRelateReq | undefined) => void;
  /** 문서의 인감 (setStampId L1999-2006) — 날인신청 [+]의 법인인감증명서·인감날인이 처음 값으로 쓴다 (V14) */
  stamp?: { id: number | null; name: string };
  /** 날인신청 줄 수와 오른쪽 세 칸 (getCorpDocInfo L193-200·getStampList) — 부른 쪽이 저장 때 기본값(제공처 = 수신, 제공목적 = 상신제목)을 정한다 */
  onStampDocChange?: (v: { count: number; provideCo: string; purpose: string; note: string }) => void;
  /** 결재선이 바뀔 때마다 (저장 때 부른 쪽이 쓴다) */
  onStepsChange?: (steps: AprApprStep[]) => void;
  /** 내 차례인 결재자의 [결재선 수정] (enableButton L2008-2014, V08) — 저장이 끝나면 부른 쪽이 문서를 다시 연다 */
  canRetouch?: boolean;
  onRetouched?: () => void;
  /**
   * 인감을 고른 뒤 결재선을 새로 만든다 (V12: resetApprStep L5197-5210). version이 바뀔 때마다 결재선을 steps로 바꾸고,
   * 원본은 이때 연관문서 그리드(getRelateApprGrid)를 비운다 — 그대로 따른다(원본 이상한점 #34)
   */
  stepsReplace?: { version: number; steps: AprApprStep[] };
}

export const Apr03_Page_Relate: React.FC<Props> = ({ doc, editable = false, isNew = false, seed, onRelatesChange, stamp, onStampDocChange, onStepsChange, canRetouch = false, onRetouched, stepsReplace }) => {
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
  const [typoView, setTypoView] = useState<AprTypo | null>(null);
  const [viewFile, setViewFile] = useState<AprApprFile | null>(null);
  const [stepEditOpen, setStepEditOpen] = useState(false);
  const [retouchOpen, setRetouchOpen] = useState(false);
  // V05: 첨부 옵션설정(세 갈래)·등록
  const [fileOptOpen, setFileOptOpen] = useState<'options' | 'rejected' | 'deleted' | null>(null);
  const upload = useRef<FileUpdownFormHandle>(null);
  // V13: 연관 설정 — 어느 조회창이 열렸는지, 법규·내규 설정/상세보기 창, 처음 읽었는지(읽기 전에는 저장 값을 내보내지 않는다)
  const [lookup, setLookup] = useState<'ics' | 'icr' | 'fund' | 'adv' | 'appr' | null>(null);
  const [lawWin, setLawWin] = useState<{ kind: 'ics' | 'icr'; view: boolean; relateId: number; row: AprRelateIcsRow } | null>(null);
  const [loaded, setLoaded] = useState(false);
  // V14: 날인신청 — 오른쪽 세 칸, 이미 결재한 사람이 있어 [+][-]가 꺼짐(chkYn)
  const [stampMeta, setStampMeta] = useState({ provideCo: '', purpose: '', note: '' });
  const [stampLocked, setStampLocked] = useState(true);
  /** DBUtil.setSeq 대신 — 저장 전 새 줄의 임시 번호(음수). 서버가 저장할 때 새 번호를 받는다 */
  const tmpId = useRef(0);
  const isManager = user.userId < 0 || user.companyId === 0;

  // [E0] 화면 열림 (생성자 L210-346) → pannelEvents() L348-413
  // [E1] apprFileList (Apr01_Grid_ApprFile).callbackOnCreate (L135) · [E2] relateCorpDocList (Apr16_Grid_StampDoc).callbackOnCreate (L146) · [E8]~[E17] 연관 그리드 store Add/Remove → clearPanel():
  //   탭 글자의 개수·색(0보다 크면 빨강)과 처음 값이 있는 탭 열기를 모두 아래 상태(개수)에서 바로 계산한다
  // retrieve() L925-997: retrieveRelateFundGrid·AdvGrid·ApprGrid·IcsGrid·IcrGrid·ApprStepGrid + 첨부파일(setApprFileList)·날인신청(setCorpDocList)
  // retrieve L254-275 + chkYn L277-297: 줄·제공처·제공목적·비고와 [+][-] 켜짐
  const loadStampAppl = useCallback(async () => {
    try {
      const sa = await aprStampApplApi.get(doc.apprId);
      setStamps(sa.rows); setStampLocked(sa.locked);
      setStampMeta({ provideCo: sa.meta.provideCo ?? '', purpose: sa.meta.purpose ?? '', note: sa.meta.note ?? '' });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [doc.apprId]);

  const retrieve = useCallback(async () => {
    if (isNew) {
      // 새 문서(insertApproval L4500-4518): createIcsLine·createIcrLine·createApprStepLine 결과가 seed
      setIcs(seed?.ics ?? []); setIcr(seed?.icr ?? []); setSteps(seed?.steps ?? []);
      // 링크 문서의 연관문서 자동등록(insertRelateApprList L517-552, 여비교통비 관리 A43): 구분은 inoutCode 10이면 대외, 아니면 사내
      setApprs((seed?.apprs ?? []).map<AprRelateAppr>(a => ({
        relateApprId: newId(), targetApprId: a.targetApprId, inOutTypeCode: a.inOutTypeCode, inOutTypeName: a.inOutTypeCode === '10' ? '대외' : '사내', targetRegDate: a.regDate, targetTitle: a.title,
      })));
      // 공모주(A26·A38) 연관펀드 자동등록(insertRelateFundList(List) L452-515): 출력(printYn)·결재이후(afterYn)는 false로 넣는다
      setFunds((seed?.funds ?? []).map<AprApprFund>(f => ({
        relateFundId: newId(), fundId: f.fundId, fundTypeName: f.fundTypeName, fundCode: f.fundCode, fundName: f.fundName, afterYn: 'false', printYn: 'false',
      })));
      setAdvs((seed?.advs ?? []).map<AprApprAdv>(a => ({ relateAdvId: newId(), advId: a.advId, manageCode: a.manageCode, manageName: a.manageName })));
      // 탭 순서: 첨부 · 연관법규 · 연관내규 · 연관펀드 · 연관일임 · 연관문서 · 날인신청
      const first = [0, (seed?.ics ?? []).length, (seed?.icr ?? []).length, (seed?.funds ?? []).length, (seed?.advs ?? []).length, (seed?.apprs ?? []).length].findIndex(c => c > 0);
      setActiveKey(String(first < 0 ? 0 : first));
      void loadStampAppl();
      setLoaded(true);
      return;
    }
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
      void loadStampAppl();
      setLoaded(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.apprId, isNew]);

  useEffect(() => { void retrieve(); }, [retrieve]);
  useEffect(() => { onStepsChange?.(steps); }, [steps]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (loaded) onStampDocChange?.({ count: stamps.length, ...stampMeta }); }, [stamps, stampMeta, loaded]); // eslint-disable-line react-hooks/exhaustive-deps
  // 창이 닫히거나 다시 그려질 때는 옛 값을 지운다(읽기 전의 저장이 연관 줄을 지우지 않게)
  useEffect(() => () => onRelatesChange?.(undefined), []); // eslint-disable-line react-hooks/exhaustive-deps
  // getRelateFundList L1740·AdvList L1758·ApprList L1767·IcsList L1776·IcrList L1785: 화면에 남은 줄 전체. 새 줄(임시 번호 < 0)은 번호 없이 보낸다
  useEffect(() => {
    if (!editable || !loaded) return;
    const id = (n: number) => (n > 0 ? n : null);
    const law = (r: AprRelateLaw) => ({ relateId: id(r.relateId), classTreeId: r.classTreeId, deadlineId: r.deadlineId ?? null, standCode: r.standCode ?? null, standDate: r.standDate ?? null, closeDate: r.closeDate ?? null, standYn: r.standYn ?? null });
    onRelatesChange?.({
      funds: funds.map(f => ({ relateFundId: id(f.relateFundId), fundId: f.fundId as number, printYn: f.printYn ?? null, afterYn: f.afterYn ?? null })),
      advs: advs.map(a => ({ relateAdvId: id(a.relateAdvId), advId: a.advId as number })),
      apprs: apprs.map(a => ({ relateApprId: id(a.relateApprId), targetApprId: a.targetApprId })),
      ics: ics.map(law), icr: icr.map(law),
    });
  }, [funds, advs, apprs, ics, icr, editable, loaded]); // eslint-disable-line react-hooks/exhaustive-deps
  // 다시 그릴 때(key)는 처음 version을 이미 반영한 것으로 본다
  const appliedVersion = useRef(stepsReplace?.version ?? 0);
  useEffect(() => {
    if (!stepsReplace || stepsReplace.version === appliedVersion.current) return;
    appliedVersion.current = stepsReplace.version;
    setSteps(stepsReplace.steps);
    setApprs([]);
  }, [stepsReplace]);

  // changeRow L1682-1725 (▲▼): 상신자는 못 바꾸고, 위로는 둘째 줄까지, 아래로는 끝까지. 번호는 위에서부터 다시 매긴다
  const changeRow = (action: 'up' | 'down', row: AprApprStep) => {
    if (!editable) return;
    if (row.stepTypeCode === '00') { message.warning('상신자는 수정할 수 없습니다'); return; }
    const idx = steps.findIndex(s => s.apprStepId === row.apprStepId);
    const next = [...steps];
    if (action === 'down' && idx + 1 < next.length) { next.splice(idx, 1); next.splice(idx + 1, 0, row); }
    else if (action === 'up' && idx > 1) { next.splice(idx, 1); next.splice(idx - 1, 0, row); }
    else return;
    setSteps(renumber(next));
  };

  // [E5][E6] reArrangeButton[직급순 재정렬] → "직급순으로 결재선을 재정렬하겠습니까?" → arrayStepTypeCode() L1920-1950 + arrayPosCode() L1952-1974:
  //   상신자 → 결재·합의·인감 → 참조 순으로 묶고, 각 묶음을 직위 코드 900부터 1까지 큰 순으로 다시 센다(1~900 밖이거나 직위가 없는 줄은 원본도 빠진다)
  const reArrange = () => {
    Modal.confirm({
      title: '확인', content: '직급순으로 결재선을 재정렬하겠습니까?', width: 400, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          const pos = new Map((await aprStepEditApi.posCodes(steps.map(s => s.stepEmpId))).map(p => [p.personId, p.posCode ?? '']));
          const byPos = (list: AprApprStep[]) => {
            const out: AprApprStep[] = [];
            for (let i = 900; i > 0; i--) list.forEach(s => { if (pos.get(s.stepEmpId) === String(i)) out.push(s); });
            return out;
          };
          const g1 = steps.filter(s => s.stepTypeCode === '00');
          const g2 = byPos(steps.filter(s => ['10', '20', '40'].includes(s.stepTypeCode)));
          const g3 = byPos(steps.filter(s => s.stepTypeCode === '30'));
          setSteps(renumber([...g1.slice(0, 1), ...g2, ...g3]));
        } catch (err) {
          message.error(errorMessage(err, '재정렬 실패'));
        }
      },
    });
  };

  // [E7] apprStepLineButton[결재선 설정] (L289): 결재중 문서는 Apr04_Edit_RetouchApprStep(V08), 아니면 결재선이 만들어진 뒤 Apr04_Edit_ApprStep
  const openStepEditor = () => {
    if (steps.length === 0) { message.warning('결재선을 생성 중입니다. 잠시만 기다려주세요'); return; }
    setStepEditOpen(true);
  };

  // 첨부 목록만 다시 읽는다 (Apr01_Grid_ApprFile.retrieve L109-143: 표지(titleYn)는 뺀다)
  const refreshFiles = useCallback(async () => {
    try {
      const list = await aprAttachApi.getEditFiles(doc.apprId);
      setFiles(list.filter(f => f.titleYn !== 'true').map(f => ({ fileId: f.fileId, fileName: f.fileName, fileExt: f.fileExt, fileYn: f.fileYn, printYn: String(f.printYn) })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [doc.apprId]);

  // 첨부 툴바 (retrieve L925-997): [첨부파일 옵션설정]은 반려(40)면 "첨부파일 추가/삭제", 결재완료(30)면 "삭제된 첨부파일 내역"(둘 다 늘 켜짐), 그 밖에는 관리자·편집 모드일 때만
  const optionsMode: 'options' | 'rejected' | 'deleted' = doc.statusCode === '40' ? 'rejected' : doc.statusCode === '30' ? 'deleted' : 'options';
  const optionsLabel = optionsMode === 'rejected' ? '첨부파일 추가/삭제' : optionsMode === 'deleted' ? '삭제된 첨부파일 내역' : '첨부파일 옵션설정';
  const optionsEnabled = optionsMode !== 'options' || isManager || editable;
  // [E3] optionsButton[첨부파일 옵션설정].Select (L254) → options() L999-1027
  const options = () => {
    if (optionsMode === 'options' && files.length === 0) {
      Modal.info({ title: '확인', content: '등록된 첨부파일이 없습니다', okText: '확인' });
      return;
    }
    setFileOptOpen(optionsMode);
  };
  // [E4] insertButton[등록].Select (L260) → insert() L1029-1093: 첨부파일 탭이면 파일 선택 → FileUpload?parentId={apprId}, 연관 탭이면 각 연관 설정 창.
  //   날인신청 탭(relateCorpDocList)에는 갈래가 없다 — 그대로 아무 일도 안 한다
  const insert = () => {
    if (activeKey === '0') upload.current?.click();
    else if (activeKey === '1') setLookup('ics');
    else if (activeKey === '2') setLookup('icr');
    else if (activeKey === '3') setLookup('fund');
    else if (activeKey === '4') setLookup('adv');
    else if (activeKey === '5') setLookup('appr');
  };
  const newId = () => --tmpId.current;
  // insertRelateFundList L415-450: 고른 펀드마다 연관펀드 한 줄 — 출력(printYn)은 문서분류의 대외문서 출력여부, 결재이후(afterYn)는 비운다. 맨 아래에 붙인다(03 원칙 17)
  const onFundsPicked = (list: FundMulti[]) => setFunds(prev => [...prev, ...list.map<AprApprFund>(f => ({
    relateFundId: newId(), fundId: f.fundId, fundTypeName: f.kofiaFundTypeName, fundCode: f.fundCode, fundName: f.fundName, afterYn: null, printYn: doc.printFundYn ?? 'false',
  }))]);
  // insertRelateAdvList L796-831
  const onAdvsPicked = (list: AdvAccount[]) => setAdvs(prev => [...prev, ...list.map<AprApprAdv>(a => ({
    relateAdvId: newId(), advId: a.accountId, manageCode: a.manageCode, manageName: a.manageName,
  }))]);
  // Apr21_Lookup_RelateAppr.insert L222-249
  const onApprsPicked = (list: AprLoadDoc2[]) => {
    setLookup(null);
    setApprs(prev => [...prev, ...list.map<AprRelateAppr>(d => ({
      relateApprId: newId(), targetApprId: d.apprId, inOutTypeCode: d.inOutTypeCode, inOutTypeName: d.inOutTypeCode === '10' ? '대외' : '사내', targetRegDate: d.regDate, targetTitle: d.title,
    }))]);
  };
  // insertRelateIcsList L833-877·insertRelateIcrList L879-923: 고른 법규(내규)·기한마다 한 줄 — 기준·마감일은 [설정]에서 정한다
  const onLawsPicked = (list: (IcsLawDeadline | IcrClassTreeDeadline)[], kind: 'ics' | 'icr') => {
    const rows = list.map<AprRelateLaw>(m => ({
      relateId: newId(), classTreeId: m.classTreeId, classTreeFullName: m.classTreeFullName, cycleName: m.cycleName, closeDate: null, deadlineId: m.deadlineId ?? null, standCode: null, standDate: null, standYn: null,
    }));
    (kind === 'ics' ? setIcs : setIcr)(prev => [...prev, ...rows]);
  };
  // 삭제 열: 연관문서는 목록에서 빼고(L1495), 펀드·일임·법규·내규는 AS-IS가 그 자리에서 DB를 지웠다 — TOBE는 [저장] 때 화면에 남은 줄로 바꾼다(작업방법 "다른 점")
  const removeFund = (row: AprApprFund) => setFunds(prev => prev.filter(r => r.relateFundId !== row.relateFundId));
  const removeAdv = (row: AprApprAdv) => setAdvs(prev => prev.filter(r => r.relateAdvId !== row.relateAdvId));
  const removeAppr = (row: AprRelateAppr) => setApprs(prev => prev.filter(r => r.relateApprId !== row.relateApprId));
  const removeLaw = (kind: 'ics' | 'icr', row: AprRelateLaw) => (kind === 'ics' ? setIcs : setIcr)(prev => prev.filter(r => r.relateId !== row.relateId));
  // [설정]·[상세보기] — 법규(내규) 정보는 기한을 포함해 읽고 기준·마감은 그 줄의 값을 얹는다 (Apr20_Lookup_RelateIcs.open/view)
  const openLaw = async (kind: 'ics' | 'icr', row: AprRelateLaw, view: boolean) => {
    try {
      const info = kind === 'ics'
        ? await aprRelateEditApi.getRelateIcsInfo(row.classTreeId, row.deadlineId ?? null, true)
        : await aprRelateEditApi.getRelateIcrInfo(row.classTreeId, row.deadlineId ?? null);
      setLawWin({ kind, view, relateId: row.relateId, row: { ...info, relateIcsId: row.relateId, standCode: row.standCode ?? null, standDate: row.standDate ?? null, closeDate: row.closeDate ?? null, standYn: row.standYn ?? null } });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  const onLawSet = (patch: { standCode: string | null; standDate: string | null; closeDate: string | null; standYn: string }) => {
    if (!lawWin) return;
    (lawWin.kind === 'ics' ? setIcs : setIcr)(prev => prev.map(r => (r.relateId === lawWin.relateId ? { ...r, ...patch } : r)));
  };
  const onFilesChange = async (picked: File[]) => {
    if (picked.length === 0) return;
    try {
      for (const f of picked) await fileApi.upload(doc.apprId, f);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await refreshFiles();
    setActiveKey('0');
  };
  // 삭제 열 (Apr01_Grid_ApprFile showDelete L778-783): 편집 모드·관리자·반려 문서의 상신자 — checkFileDelete() L741-767
  const canDelete = editable || isManager || (doc.statusCode === '40' && doc.regEmpId === user.userId);
  const checkFileDelete = async (row: AprApprFile) => {
    try {
      const { status, message: text } = await fileApi.checkFileDeleteResult(row.fileId, doc.apprId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await refreshFiles();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        Modal.info({ title: '확인', content: text ?? '해당 파일은 삭제할 수 없습니다', okText: '확인' });
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await refreshFiles();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // fileDownloadCheck() L839-856: 결재선에 내가 있거나 결재완료(30)가 아니면 받기 열을 숨긴다
  const canDown = useMemo(() => doc.statusCode === '30' || steps.some(s => s.apprEmpId != null && s.apprEmpId === user.userId), [doc.statusCode, steps, user.userId]);

  // buildGrid() (Apr01_Grid_ApprFile L690-727): 첨부파일 · "확정문서" · 받기 · (삭제=편집 모드만) · 보기 · 출력
  const fileCols = useMemo<ColDef<AprApprFile>[]>(() => {
    const cols: ColDef<AprApprFile>[] = [
      gbFile.text('fileName', (canDown ? 405 : 465) - (canDelete ? 50 : 0), '첨부파일'),
      { colId: 'fileYnCheck', headerName: ' ', width: 65, valueGetter: p => (p.data?.fileYn === 'true' ? '확정문서' : ' ') },
    ];
    if (canDown) cols.push(iconCell<AprApprFile>('down', 'downAction', 50, '받기', row => { void fileApi.download(row.fileId); }));
    if (canDelete) cols.push(iconCell<AprApprFile>('delete', 'deleteAction', 50, '삭제', row => { void checkFileDelete(row); }));
    cols.push(iconCell<AprApprFile>('view', 'viewAction', 50, '보기', row => setViewFile(row)));
    cols.push(gbFile.booleanYn2('printYn', 50, '출력'));
    return cols;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDown, canDelete]);

  // buildRelateIcsGrid L1506-1551 / buildRelateIcrGrid L1554-1599: 법규명(내규명) 405 · 주기 80 · 마감일 100 · 설정/삭제(편집 모드만) · 상세보기 60
  //   편집 모드(openButton L1887-1910)는 설정·삭제 열, 아니면 상세보기 열(retrieve L925-997: 삭제가 숨으면 상세보기가 보인다)
  const lawCols = (title: string, kind: 'ics' | 'icr'): ColDef<AprRelateLaw>[] => [
    gbLaw.textArea('classTreeFullName', 405, title),
    gbLaw.text('cycleName', 80, '주기'),
    gbLaw.date('closeDate', 100, '마감일'),
    ...(editable ? [
      iconCell<AprRelateLaw>('edit', 'editAction', 60, '설정', row => { void openLaw(kind, row, false); }),
      iconCell<AprRelateLaw>('delete', 'deleteAction', 60, '삭제', row => removeLaw(kind, row)),
    ] : [
      iconCell<AprRelateLaw>('view', 'viewAction', 60, '상세보기', row => { void openLaw(kind, row, true); }),
    ]),
  ];

  // buildRelateFundGrid L1390-1412: 펀드유형 80 · 코드 80 · 연관펀드명 310(삭제 숨김 시 390) · 결재이후 80 · 출력 80
  //   편집 모드(openButton)에는 삭제 열(80)이 켜지고 펀드명은 310
  const fundCols = useMemo<ColDef<AprApprFund>[]>(() => [
    gbFund.text('fundTypeName', 80, '펀드유형'),
    gbFund.text('fundCode', 80, '코드'),
    gbFund.text('fundName', editable ? 310 : 390, '연관펀드명'),
    gbFund.booleanYn2('afterYn', 80, '결재이후'),
    ...(editable ? [iconCell<AprApprFund>('delete', 'deleteAction', 80, '삭제', row => removeFund(row))] : []),
    gbFund.boolean('printYn', 80, '출력'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable]);

  // buildRelateAdvGrid L1415-1434: 코드 130 · 일임계좌명 500(삭제 숨김 시 580)
  const advCols = useMemo<ColDef<AprApprAdv>[]>(() => [
    gbAdv.text('manageCode', 130, '코드'),
    gbAdv.text('manageName', editable ? 500 : 580, '일임계좌명'),
    ...(editable ? [iconCell<AprApprAdv>('delete', 'deleteAction', 80, '삭제', row => removeAdv(row))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable]);

  // buildRelateApprGrid L1437-1503: 구분 50 · 등록일 100 · 문서명 400(삭제 숨김 시 480) · 미리보기 80
  const apprCols = useMemo<ColDef<AprRelateAppr>[]>(() => [
    gbAppr.textCenter('inOutTypeName', 50, '구분'),
    gbAppr.date('targetRegDate', 100, '등록일'),
    gbAppr.text('targetTitle', editable ? 400 : 480, '문서명'),
    // [E] viewCell → PDFViewer(apr.Apr10_StampPDF7) — 문서 PDF 미리보기는 V04
    iconCell<AprRelateAppr>('view', 'viewAction', 80, '미리보기', () => message.info(`PDF 미리보기: ${NEXT_V04}`)),
    ...(editable ? [iconCell<AprRelateAppr>('delete', 'deleteAction', 80, '삭제', row => removeAppr(row))] : []),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable]);


  // buildApprStepGrid L1602-1680: 구분 65 · 결재상태 65 · 결재일 100 · ▲ 25 · 결재자 280 · ▼ 25 · 의견 45 · 보기 25 · 수정 45 · 보기 25
  const stepCols = useMemo<ColDef<AprApprStep>[]>(() => [
    gbStep.text('stepTypeName', 65, '구분', { cellRenderer: stepStyle, cellStyle: { textAlign: 'center' } }),
    gbStep.text('stepStatusName', 65, '결재상태', { cellRenderer: stepStyle, cellStyle: { textAlign: 'center' } }),
    gbStep.date('apprDate', 100, '결재일'),
    // ▲▼ = changeRow("up"/"down") L1682-1725 — 결재선 수정은 V03(상신·임시저장)에서
    { colId: 'upAction', headerName: '', width: 25, cellRenderer: () => (editable ? '▲' : ''), onCellClicked: p => p.data && changeRow('up', p.data), cellStyle: { cursor: editable ? 'pointer' : 'default', textAlign: 'center' } },
    gbStep.textHtml('stepApprName', 280, '결재자'),
    { colId: 'downAction', headerName: '', width: 25, cellRenderer: () => (editable ? '▼' : ''), onCellClicked: p => p.data && changeRow('down', p.data), cellStyle: { cursor: editable ? 'pointer' : 'default', textAlign: 'center' } },
    gbStep.text('opinionYnStr', 45, ' ', { cellRenderer: boldCenter, cellStyle: { textAlign: 'center' } }),
    // opinionCell L1621-1640: 의견이 없으면 "해당 문서에 대한 의견이 없습니다", 있으면 Apr01_Edit_Message
    iconCell<AprApprStep>('view', 'opinionAction', 25, ' ', row => {
      if ((row.opinionYnStr ?? '').length > 1) setOpinion(row.note ?? row.rejectReason ?? '');
      else message.info('해당 문서에 대한 의견이 없습니다');
    }),
    gbStep.text('typoYnStr', 45, ' ', { cellRenderer: boldCenter, cellStyle: { textAlign: 'center' } }),
    // typoCell L1641-1666: 수정사항이 없으면 "해당 문서에 대한 수정사항이 없습니다", 있으면 apr.Apr92_ApprModi.selectByPersonId(결재자, 문서) → Apr01_Edit_ApprModi.open(수정 전 내용) — V09
    iconCell<AprApprStep>('view', 'typoAction', 25, ' ', row => {
      if ((row.typoYnStr ?? '').length > 1) {
        aprExtraApi.getTypo(doc.apprId, row.apprEmpId).then(t => { if (t) setTypoView(t); }).catch(err => message.error(errorMessage(err, '조회 실패')));
      } else message.info('해당 문서에 대한 수정사항이 없습니다');
    }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [editable, steps]);

  const toFileInfo = (f: AprApprFile): FileInfo => ({ fileId: f.fileId, parentId: doc.apprId, fileNm: f.fileName, fileExt: f.fileExt ?? null });

  // [E22] plainTabPanel.Selection (L2024) → enableFileButton(): 첨부파일 탭일 때만 [첨부파일 옵션설정]이 켜진다 — 그 단추 자체가 V03(편집 모드)이라 이 단계에서는 탭만 바꾼다
  // [E3] optionsButton[첨부파일 옵션설정] · [E4] insertButton[등록] · [E5][E6] reArrangeButton[직급순 재정렬] · [E7] apprStepLineButton[결재선 설정] · [E18][E19][E21] fileUpload · [E20] editor.callbackOnCreate — 편집 모드 전용이라 V03(상신·임시저장)에서 연결한다
  const items = [
    { key: '0', label: tabLabel('첨부파일', files.length), children: <SingleGrid<AprApprFile> rowData={files} columnDefs={fileCols} getRowId={p => String(p.data.fileId)} /> },
    { key: '1', label: tabLabel('연관법규', ics.length), children: <SingleGrid<AprRelateLaw> rowData={ics} columnDefs={lawCols('법규명', 'ics')} getRowId={p => String(p.data.relateId)} /> },
    { key: '2', label: tabLabel('연관내규', icr.length), children: <SingleGrid<AprRelateLaw> rowData={icr} columnDefs={lawCols('내규명', 'icr')} getRowId={p => String(p.data.relateId)} /> },
    { key: '3', label: tabLabel('연관펀드', funds.length), children: <SingleGrid<AprApprFund> rowData={funds} columnDefs={fundCols} getRowId={p => String(p.data.relateFundId)} /> },
    { key: '4', label: tabLabel('연관일임', advs.length), children: <SingleGrid<AprApprAdv> rowData={advs} columnDefs={advCols} getRowId={p => String(p.data.relateAdvId)} /> },
    { key: '5', label: tabLabel('연관문서', apprs.length), children: <SingleGrid<AprRelateAppr> rowData={apprs} columnDefs={apprCols} getRowId={p => String(p.data.relateApprId)} /> },
    { key: '6', label: tabLabel('날인신청', stamps.length), children: <Apr16_Grid_StampDoc apprId={doc.apprId} rows={stamps} meta={stampMeta} locked={stampLocked} editable={editable} stamp={stamp ?? { id: null, name: '' }} onMetaChange={setStampMeta} onChanged={() => void loadStampAppl()} /> },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
      {/* 첨부 툴바(hlc01 40): [첨부파일 옵션설정][등록] — 관리자·편집 모드(반려·결재완료 문서의 옵션 단추는 늘) 켜진다 */}
      <div style={{ display: 'flex', gap: 6 }}>
        <Button type="register" disabled={!optionsEnabled} onClick={options}>{optionsLabel}</Button>
        <Button type="register" disabled={!(isManager || editable)} onClick={insert}>등록</Button>
      </div>
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
      {/* [결재선 수정] — 결재중 문서에서 내 차례인 결재자(합의 제외)에게만 켜진다. [직급순 재정렬]은 편집 모드가 아니라 꺼진 채 */}
      {!editable && canRetouch && (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button type="register" onClick={() => setRetouchOpen(true)}>결재선 수정</Button>
        </div>
      )}
      {/* 결재선 툴바(hlc02 40): [결재선 설정][직급순 재정렬] — 편집 모드 전용 */}
      {editable && (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button type="register" onClick={openStepEditor}>결재선 설정</Button>
          <Button type="register" onClick={reArrange}>직급순 재정렬</Button>
        </div>
      )}
      {/* apprStepGrid (아래 0.5) */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprApprStep>
          rowData={steps}
          columnDefs={stepCols}
          getRowId={p => String(p.data.apprStepId)}
          getRowHeight={p => ((p.data?.stepApprName ?? '').includes('<br>') ? 56 : undefined)}
        />
      </div>
      <Apr04_Edit_ApprStep open={stepEditOpen} steps={steps} onConfirm={setSteps} onClose={() => setStepEditOpen(false)} />
      <Apr04_Edit_RetouchApprStep open={retouchOpen} apprId={doc.apprId} steps={steps} onSaved={() => onRetouched?.()} onClose={() => setRetouchOpen(false)} />
      <FileUpdownForm ref={upload} onChange={() => undefined} onChangeFiles={onFilesChange} />
      <Apr01_Lookup_ApprFileList apprId={fileOptOpen === 'options' ? doc.apprId : null} onClosed={() => void refreshFiles()} onClose={() => setFileOptOpen(null)} />
      <Sys61_Lookup_FileList parentId={fileOptOpen === 'rejected' ? doc.apprId : null} onClosed={() => void refreshFiles()} onClose={() => setFileOptOpen(null)} />
      <Sys61_Lookup_DelList parentId={fileOptOpen === 'deleted' ? doc.apprId : null} onClose={() => setFileOptOpen(null)} />
      {/* V13 연관 설정 조회창: insertRelateFundList(이미 연관된 펀드는 뺀다)·insertRelateAdvList·Apr21_Lookup_RelateAppr·insertRelateIcsList/IcrList("deadline") */}
      <Fnd01_Lookup_SelectMulti open={lookup === 'fund'} excludeIds={funds.map(f => f.fundId as number)} onSelect={onFundsPicked} onClose={() => setLookup(null)} />
      <Adv02_Lookup_SelectMulti open={lookup === 'adv'} onSelect={onAdvsPicked} onClose={() => setLookup(null)} />
      <Apr21_Lookup_RelateAppr open={lookup === 'appr'} onResult={onApprsPicked} onClose={() => setLookup(null)} />
      <Ics01_Lookup_SelectMulti open={lookup === 'ics'} actionCode="deadline" onResultDeadlines={list => { setLookup(null); onLawsPicked(list, 'ics'); }} onClose={() => setLookup(null)} />
      <Icr01_Lookup_SelectMulti open={lookup === 'icr'} actionCode="deadline" onResultDeadlines={list => { setLookup(null); onLawsPicked(list, 'icr'); }} onClose={() => setLookup(null)} />
      <Apr20_Lookup_RelateIcs row={lawWin?.kind === 'ics' ? lawWin.row : null} view={lawWin?.view} onSet={onLawSet} onClose={() => setLawWin(null)} />
      <Apr22_Lookup_RelateIcr row={lawWin?.kind === 'icr' ? lawWin.row : null} view={lawWin?.view} onSet={onLawSet} onClose={() => setLawWin(null)} />
      <Apr01_Edit_Message message={opinion} onClose={() => setOpinion(null)} />
      <Apr01_Edit_ApprModi typo={typoView} onClose={() => setTypoView(null)} />
      <Sys10_Lookup_FileViewer file={viewFile ? toFileInfo(viewFile) : null} onClose={() => setViewFile(null)} />
    </div>
  );
};
