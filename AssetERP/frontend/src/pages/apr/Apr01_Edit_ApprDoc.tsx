/**
 * 전자결재 문서 상세 (V01 문서 읽기 + V02 결재 처리 + V07 상신·임시저장) — 결재선·연관 그리드·첨부를 보고, 내 차례면 [승인][반려], 승인한 문서면 [승인취소], 아무도 결재 안 한 내 문서면 [상신취소].
 * V07 편집 모드: 새 문서(newClassTreeId, insertApproval) 또는 내 임시저장(99) 문서는 칸을 고치고 [결재요청][저장](임시저장 문서는 [삭제])을 쓴다. 열람기록·댓글(V04), 오타수정·공람·폐기·중요표시(V09), 연관법규·결재완료후 첨부(V10), 불러오기·양식·첨부 등록·옵션(V05), 미리보기 PDF(V11), 날인신청(V14), 링크코드 본문(V15)은 다음 ID.
 * V13 연관 설정: 연관 탭 [등록]·삭제·설정(Apr03_Page_Relate)의 화면 내용 전체를 [저장]·[결재요청]에 relates로 함께 보낸다(Apr01_Appr.update L172-232).
 * AS-IS: myApp/client/vi/apr/Apr01_Edit_ApprDoc.java (5864줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L339-507: 1600×870 모달 "문서상세"(닫기 X 없음), 머리 오른쪽 [열람기록][댓글(n)], 위 150 = 왼쪽 문서구분·상신제목(getApprovalForm01 L4648-4704) + 오른쪽 시행일자·상신일자·인감종류·대표회사·대표서명·수신·참조·비고(getApprovalForm02 L4706-4794),
 *   가운데 = 왼쪽 상신내용(getHtmlForm L4796-4817) + 오른쪽 Apr03_Page_Relate(탭 7개 + 결재선), 푸터 가운데 [미리보기][닫기] + 북마크 별
 * V12: 인감종류 [E32] findLookupStamp·대표회사 [E33] 조회창 → resetApprStep(인감 줄을 넣은 결재선 다시 만들기), 새 문서의 기본 인감 retrieveRoleStamp.
 * 열기: retrieveApproval(apprId | apprModel, adminFlag, callback) L510-525 → getApprModel L535-560(selectById, 임시저장·관리자가 아니면 열람기록, 북마크 조회) → retrieveApproval L643-728
 * 조회창 규격(11a)·12 원칙: LookupModal, 머리 아래 선·푸터 위 선, 안쪽 스크롤은 그리드·상신내용 하나씩. 상신내용은 읽기 전용 HtmlView(AS-IS는 CKEditor — 수정은 V04 오타수정)
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Radio, Space } from 'antd';
import { SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { aprActionApi, aprDetailApi, aprExtraApi, aprWriteApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprActionRes, AprApprActionState, AprApprDetail, AprApprNew, AprApprRelateReq, AprApprSaveReq, AprApprStep, AprApprWriteRes, AprLinkOpen, AprRelateLaw, AprReprCorpLookup, AprStamp, AprStampLine } from '@/types/apr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr01_Edit_NoteMessage } from './Apr01_Edit_NoteMessage';
import { Apr01_Edit_RejectMessage } from './Apr01_Edit_RejectMessage';
import { Apr03_Page_Relate } from './Apr03_Page_Relate';
import { Apr41_Lookup_OpenHistory } from './Apr41_Lookup_OpenHistory';
import { Apr42_Lookup_Comment } from './Apr42_Lookup_Comment';
import { Apr01_Edit_ApprModi } from './Apr01_Edit_ApprModi';
import { Apr13_Lookup_PersonAuth } from './Apr13_Lookup_PersonAuth';
import { Apr50_Lookup_PersonList } from './Apr50_Lookup_PersonList';
import { Apr90_Lookup_DisposalList } from './Apr90_Lookup_DisposalList';
import { Apr20_Lookup_RelateIcsList } from './Apr20_Lookup_RelateIcsList';
import { Apr01_Lookup_ApprFile } from './Apr01_Lookup_ApprFile';
import { Apr01_Lookup_RelateAppr } from './Apr01_Lookup_RelateAppr';
import { Apr01_Lookup_RelateFund } from './Apr01_Lookup_RelateFund';
import { Apr05_Lookup_LoadDoc2 } from './Apr05_Lookup_LoadDoc2';
import { Dcr05_Lookup_FormView } from '../dcr/Dcr05_Lookup_FormView';
import { Apr10_Lookup_DocStamp } from './Apr10_Lookup_DocStamp';
import { Apr15_Lookup_ReprCorp } from './Apr15_Lookup_ReprCorp';

const day = (v?: string | null) => (v ? v.slice(0, 10) : '');
const LABEL_W = 90;

/** 편집 모드 입력값 (editDriver) */
interface EditForm {
  inOutTypeCode: string; title: string; effectDate: string; regDate: string; signCompany: string; signCeo: string;
  receiveName: string; referenceName: string; note: string; content: string;
  /** 인감종류(stampId·stampName 칸)와 위치 콤보(stampPosition, 'StampLocation') */
  stampId: number | null; stampName: string; stampPosition: string;
}
const EMPTY_FORM: EditForm = { inOutTypeCode: '20', title: '', effectDate: '', regDate: '', signCompany: '', signCeo: '', receiveName: '', referenceName: '', note: '', content: '', stampId: null, stampName: '', stampPosition: '' };
const toForm = (d: AprApprDetail): EditForm => ({
  inOutTypeCode: d.inOutTypeCode === '10' ? '10' : '20', title: d.title ?? '', effectDate: day(d.effectDate), regDate: day(d.regDate), signCompany: d.signCompany ?? '',
  signCeo: d.signCeo ?? '', receiveName: d.receiveName ?? '', referenceName: d.referenceName ?? '', note: d.note ?? '', content: d.content ?? '',
  stampId: d.stampId ?? null, stampName: d.stampName ?? '', stampPosition: d.stampPosition ?? '',
});
/** 새 문서 열기 응답 → 화면이 쓰는 문서 (statusCode '10': 처음 상신등록 상태, L4473) */
const newToDoc = (n: AprApprNew): AprApprDetail => ({
  apprId: n.apprId, companyId: 0, classTreeId: n.classTreeId, classTreeFullName: n.classTreeFullName, printFundYn: n.printFundYn,
  title: n.title ?? '', inOutTypeCode: '20', content: n.content ?? '', regDate: n.regDate, effectDate: null, statusCode: n.statusCode,
  regEmpId: n.regEmpId, regEmpName: n.regEmpName, signCompany: n.signCompany, signCeo: n.signCeo,
});

interface Props {
  /** 값이 있으면 열림 — AS-IS retrieveApproval(apprId, …) */
  apprId: number | null;
  /** 값이 있으면 새 문서 작성으로 열림 — AS-IS insertApproval(classTreeModel, …) (V07) */
  newClassTreeId?: number | null;
  /** 값이 있으면 링크코드로 열린 새 문서 — AS-IS insertLinkApproval(classTreeModel, linkCode, gridDataModel, …) (V17). 제목·본문·시행일자를 링크코드별로 채운다 */
  link?: AprLinkOpen | null;
  /** 링크 문서를 [저장]·[결재요청]한 뒤 (AS-IS callbackResult.execute(apprModel) L807·L5780) — 부른 화면이 문서 ID를 자기 행에 기록한다(updateApprId) */
  onLinkSaved?: (apprId: number) => void;
  /** 목록 행의 상태 코드(있으면) — '99'(임시저장)이면 열람기록을 남기지 않는다. 없으면 문서의 상태로 서버가 정한다 */
  statusCode?: string | null;
  /** [닫기] 단추와 결재 처리(승인·반려·승인취소·상신취소) 뒤 (AS-IS callback.execute() 뒤 hide) — 부른 화면이 목록을 다시 읽는 용 */
  onClosed?: () => void;
  onClose: () => void;
}

/** 한 줄: 라벨(오른쪽 정렬) + 칸 */
const Row: React.FC<{ label: string; children: React.ReactNode; grow?: boolean }> = ({ label, children, grow }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: grow ? 1 : undefined, minWidth: 0 }}>
    <span style={{ width: LABEL_W, textAlign: 'right', fontSize: 12, fontWeight: 'bold', flexShrink: 0 }}>{label}</span>
    {children}
  </div>
);

export const Apr01_Edit_ApprDoc: React.FC<Props> = ({ apprId, newClassTreeId = null, link = null, onLinkSaved, statusCode, onClosed, onClose }) => {
  const user = useLoginUser();
  const [doc, setDoc] = useState<AprApprDetail | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentSize, setCommentSize] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  // V09: [오타수정]·[공람설정]·[문서폐기 신청]·북마크 별
  const [typoOpen, setTypoOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [disposalOpen, setDisposalOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  const [relateKey, setRelateKey] = useState(0);
  // V10: [연관법규 추가/수정/삭제]·[결재완료후 첨부파일등록]
  const [icsOpen, setIcsOpen] = useState(false);
  // V05: [불러오기]·[양식] — 본문 편집기는 값을 열 때 한 번만 받아서 새 값을 넣으면 key를 바꿔 다시 연다
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [afterFileOpen, setAfterFileOpen] = useState(false);
  // V16: [연관문서설정]·[연관펀드설정] — 결재완료(30) 문서
  const [relateApprOpen, setRelateApprOpen] = useState(false);
  const [relateFundOpen, setRelateFundOpen] = useState(false);
  const [state, setState] = useState<AprApprActionState | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  // V07 편집 모드
  const [isNew, setIsNew] = useState(false);
  /** 링크 문서의 제목 읽기전용·[저장] 보임 (insertLinkApproval L1572-1573 기본: 제목 읽기전용, [저장] 숨김, 코드별로 바뀜) */
  const [linkLock, setLinkLock] = useState<{ titleReadOnly: boolean; saveVisible: boolean } | null>(null);
  const [seed, setSeed] = useState<{ steps: AprApprStep[]; ics: AprRelateLaw[]; icr: AprRelateLaw[] } | undefined>(undefined);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [requestNoteOpen, setRequestNoteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  // V12: 인감종류 조회창(findLookupStamp)·대표회사 조회창, 인감을 고른 뒤 결재선 다시 만들기(resetApprStep)
  const [stampOpen, setStampOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [stepsReplace, setStepsReplace] = useState<{ version: number; steps: AprApprStep[] }>({ version: 0, steps: [] });
  const stepsRef = useRef<AprApprStep[]>([]);
  /** 연관 탭 다섯 개의 화면 내용 (V13) — 처음 읽기 전에는 없어 보내지 않는다 */
  const relatesRef = useRef<AprApprRelateReq | undefined>(undefined);
  /** 날인신청 줄 수와 제공처·제공목적·비고 (V14) */
  const stampDocRef = useRef<{ count: number; provideCo: string; purpose: string; note: string } | undefined>(undefined);
  /** 내 임시저장(99) 문서이거나 새 문서면 칸을 고칠 수 있다 (makeButton: 상신자 본인의 편집 모드) */
  const editable = isNew || (doc != null && doc.statusCode === '99' && doc.regEmpId === user.userId);
  const treeId = link?.classTreeId ?? newClassTreeId;
  const open = apprId != null || treeId != null;
  const set = (patch: Partial<EditForm>) => setForm(prev => ({ ...prev, ...patch }));

  // [E0] 화면 열림 (생성자 L339-507) → getCommentSize(), getApprovalForm01(), getApprovalForm02(), getHtmlForm()
  // getApprModel() L535-560: apr.Apr01_Appr.selectById → (임시저장이 아니고 관리자가 아니면) insertHistory() L582-596 → retrieveApproval() L643-728 / getApprBookmark() L562-580 / getCommentSize() L5808-5820
  // 새 문서: insertApproval(classTreeModel) L1491-1521·L4461-4519 → 문서 번호·기본 값·결재선·연관법규/내규 (GET apr/apprs/new)
  useEffect(() => {
    setDoc(null);
    setBookmarked(false);
    setCommentSize(0);
    setState(null);
    setIsNew(false);
    setLinkLock(null);
    setSeed(undefined);
    if (apprId == null && treeId == null) return;
    let alive = true;
    void (async () => {
      try {
        if (treeId != null) {
          const n = await aprWriteApi.openNew(treeId);
          if (!alive) return;
          const d = newToDoc(n);
          // 기본 인감: createApprStepLine 뒤 retrieveRoleStamp(sealCode) L4586-4646 — 사용 가능한 인감이면 대외문서로 바꾸고 인감 줄을 넣는다, 아니면 안내하고 사내문서
          let steps = n.steps;
          let stamp: AprStampLine | null = null;
          if (n.sealCode) {
            try {
              stamp = await aprWriteApi.stampLine(n.classTreeId, Number(n.sealCode), true);
            } catch (err) {
              message.error(errorMessage(err, '기본 인감을 읽을 수 없습니다'));
            }
            if (!alive) return;
            if (stamp && !stamp.ok) Modal.info({ title: '확인', content: stamp.message ?? '', okText: '확인' });
            else if (stamp?.outType) steps = stamp.steps;
          }
          setIsNew(true);
          setSeed({
            steps,
            ics: n.relateIcs.map(l => ({ relateId: l.relateId, classTreeId: l.classTreeId, classTreeFullName: l.classTreeFullName, cycleName: l.cycleName, closeDate: null, deadlineId: l.deadlineId ?? null })),
            icr: n.relateIcr.map(l => ({ relateId: l.relateId, classTreeId: l.classTreeId, classTreeFullName: l.classTreeFullName, cycleName: l.cycleName, closeDate: null, deadlineId: l.deadlineId ?? null })),
          });
          const f = toForm(d);
          // insertLinkApproval: 링크코드별 제목·본문·시행일자(서버가 만든다), 본문이 없으면 문서분류 대표 양식(checkContent)
          if (link) {
            const ls = await aprWriteApi.linkSeed(link.classTreeId, link.linkCode, link.refId, link.args);
            if (!alive) return;
            if (ls.title != null) { f.title = ls.title; d.title = ls.title; }
            if (ls.content != null) { f.content = ls.content; d.content = ls.content; }
            f.effectDate = day(ls.effectDate);
            d.effectDate = ls.effectDate;
            d.linkCode = link.linkCode;
            // 증명서 발급(B01~B04, L2450-2451): 수신·참조를 "-"로 채운다
            if (ls.receiveName != null) { f.receiveName = ls.receiveName; d.receiveName = ls.receiveName; }
            if (ls.referenceName != null) { f.referenceName = ls.referenceName; d.referenceName = ls.referenceName; }
            setLinkLock({ titleReadOnly: ls.titleReadOnly, saveVisible: ls.saveVisible });
          }
          if (stamp?.ok && stamp.outType) { f.inOutTypeCode = '10'; f.stampId = stamp.stampId ?? null; f.stampName = stamp.stampName ?? ''; }
          setForm(f);
          setDoc(d);
          return;
        }
        const d = await aprDetailApi.getDetail(apprId!);
        if (!alive) return;
        setDoc(d);
        setForm(toForm(d));
        if ((statusCode ?? d.statusCode) !== '99') void aprDetailApi.recordOpen(apprId!);
        const [bm, cs, st] = await Promise.all([aprDetailApi.isBookmarked(apprId!), aprDetailApi.getCommentSize(apprId!), aprActionApi.getState(apprId!)]);
        if (alive) { setBookmarked(bm); setCommentSize(cs); setState(st); }
      } catch (err) {
        if (alive) { message.error(errorMessage(err, '문서를 열 수 없습니다')); onClose(); }
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apprId, treeId, link?.linkCode, link?.refId, JSON.stringify(link?.args ?? null), reloadKey]);

  const next = (text: string) => message.info(text);

  /** resetApprStep L5197-5210: 인감 줄(인감책임자·준법감시인·컴플라이언스)까지 넣은 결재선으로 바꾼다. 새 문서는 다시 그릴 때도 이 결재선을 쓰도록 seed도 바꾼다 */
  const applyStampLine = (res: AprStampLine) => {
    const steps = res.steps as AprApprStep[];
    setStepsReplace(prev => ({ version: prev.version + 1, steps }));
    setSeed(prev => (prev ? { ...prev, steps } : prev));
  };

  // [E32] stampName[인감종류].TriggerClick (L4721) → findLookupStamp() L5160-5194: 고른 인감(없음이면 빈 인감)을 칸에 넣고 결재선 재생성. 사용 부서·기한은 검사하지 않는다
  const pickStamp = async (stamp: AprStamp | null) => {
    setStampOpen(false);
    if (!doc) return;
    try {
      const res = await aprWriteApi.stampLine(doc.classTreeId, stamp?.stampId ?? null, false);
      set({ stampId: stamp?.stampId ?? null, stampName: stamp?.stampName ?? '' });
      applyStampLine(res);
    } catch (err) {
      message.error(errorMessage(err, '결재선 생성 실패'));
    }
  };

  // [E33] signCompany[대표회사].TriggerClick [result != null] (L4727) → 대표회사·대표서명을 넣고, 대표명의에 인감이 있으면 인감종류도 채워 결재선 재생성
  const pickReprCorp = async (row: AprReprCorpLookup | null) => {
    setCorpOpen(false);
    if (!row || !doc) return;
    set({ signCompany: row.corpName ?? '', signCeo: row.reprName ?? '' });
    if (row.stampId == null) return;
    try {
      const res = await aprWriteApi.stampLine(doc.classTreeId, row.stampId, false);
      if (res.stampId == null) return;
      set({ stampId: res.stampId, stampName: res.stampName ?? '' });
      applyStampLine(res);
    } catch (err) {
      message.error(errorMessage(err, '결재선 생성 실패'));
    }
  };

  /** 처리가 끝나면 창을 닫는다 — getServiceResult L5759-5783: callback.execute() 뒤 hide() */
  const finish = (res: AprApprActionRes) => {
    if (res.notice) message.info(res.notice);
    if (res.makePdf) message.info('인감이 있는 문서의 PDF 만들기는 V04에서 연결합니다.');
    onClosed?.();
    onClose();
  };

  /** 결과가 ok가 아니면 AS-IS SimpleMessage처럼 안내하고 멈춘다 */
  const handled = (res: AprApprActionRes): boolean => {
    if (res.ok) return true;
    if (res.message) message.warning(res.message);
    return false;
  };

  // [E9] confirmButton[승인].Select (L1099) · [E10] rejectButton[반려].Select (L1105) → confirmCheck(actionCode) L1133-1199:
  //   apr.Apr04_ApprStep.confirmCheck가 'Y'가 아니면 "이전 결재권자의 결재가 취소되어 결재를 진행할 수 없습니다." — 맞으면 의견 창(Apr01_Edit_NoteMessage / Apr01_Edit_RejectMessage)
  const confirmCheck = async (action: 'confirm' | 'reject') => {
    if (apprId == null) return;
    try {
      if (!handled(await aprActionApi.confirmCheck(apprId))) return;
      if (action === 'confirm') setNoteOpen(true); else setRejectOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '결재 확인 실패'));
    }
  };

  // 의견 창의 [결재]·[반려] → confirm(request) L1201-1205 → apr.Apr04_ApprStep.confirmUpdate → getServiceResult()
  const confirm = async (action: 'confirm' | 'reject', text: string) => {
    if (apprId == null) return;
    try {
      const res = await aprActionApi.confirm(apprId, action, text);
      if (handled(res)) { setNoteOpen(false); setRejectOpen(false); finish(res); }
    } catch (err) {
      message.error(errorMessage(err, '결재 처리 실패'));
    }
  };

  // [E7] cancelApprovalButton[승인취소].Select [YES] (L732) · [E8] msgBox.DialogHide [YES] (L735) → makeCancelApprovalButton L730-788: "해당문서의 결재를 취소하시겠습니까?"
  //   → nextTurnCheck → cancleApprStep() L790-813 (apr.Apr04_ApprStep.clearApprStepId)
  const cancelApproval = () => {
    Modal.confirm({
      title: '확인', content: '해당문서의 결재를 취소하시겠습니까?', width: 400, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (apprId == null) return;
        try {
          const res = await aprActionApi.cancelApproval(apprId);
          if (handled(res)) finish(res);
        } catch (err) {
          message.error(errorMessage(err, '승인취소 실패'));
        }
      },
    });
  };

  // [E13] cancelButton[상신취소].Select (L4096) → cancelCheck01() L1207-1222: 결재중인 문서는 "결재중인 문서는 상신취소가 불가능합니다"
  //   → cancelCheck02() L1224-1247: 특정 화면에서 상신된 문서면 확인 [YES] [E12] → deleteChk01() 폐기, 아니면 cancel() 임시저장으로
  const cancelRequest = async (confirmed = false) => {
    if (apprId == null) return;
    try {
      const res = await aprActionApi.cancelRequest(apprId, confirmed);
      if (res.needConfirm) {
        Modal.confirm({
          title: '확인', content: res.message, width: 560, okText: '예', cancelText: '아니오',
          onOk: () => cancelRequest(true),
        });
        return;
      }
      if (handled(res)) finish(res);
    } catch (err) {
      message.error(errorMessage(err, '상신취소 실패'));
    }
  };

  /** getStampDocMap() L5130-5158: 날인신청 줄이 있으면 제공처는 수신, 제공목적은 상신제목으로 대신한다 */
  const stampDocMap = () => {
    const s = stampDocRef.current;
    if (!s || s.count === 0) return undefined;
    return { provideCo: s.provideCo || form.receiveName || null, purpose: s.purpose || form.title || null, note: s.note || null };
  };
  const stampDocError = (): string | null => {
    const s = stampDocRef.current;
    return s && s.count > 0 && !s.provideCo && !form.receiveName ? '제공처를 입력해주세요' : null;
  };

  /** 요청 본문 — save() L5060-5070 · update() L4905-4926 */
  const buildReq = (mode: 'save' | 'request', msg: string | null, confirmed: boolean): AprApprSaveReq => {
    // getHtmlText().replaceAll("text-decoration-line", "text-decoration"), 작은따옴표 → 큰따옴표, 결재요청은 <p>로 감싼다
    let html = form.content.replaceAll('text-decoration-line', 'text-decoration').replaceAll("'", '"');
    if (mode === 'request') html = `<p>${html}</p>`;
    return {
      mode, confirmed, message: msg,
      classTreeId: doc?.classTreeId, linkCode: doc?.linkCode ?? null,
      title: form.title, content: html, note: form.note || null,
      effectDate: form.effectDate ? `${form.effectDate}T00:00:00` : null,
      regDate: form.regDate ? `${form.regDate}T00:00:00` : null,
      stampId: form.stampId, receiveName: form.receiveName || null, referenceName: form.referenceName || null,
      inOutTypeCode: form.inOutTypeCode, signCompany: form.signCompany || null, signCeo: form.signCeo || null,
      stampPosition: form.stampPosition || null, formType: null,
      steps: stepsRef.current.map(s => ({
        apprStepId: s.apprStepId, stepTypeCode: s.stepTypeCode, seq: s.seq ?? '001', stepStatusCode: s.stepStatusCode ?? null,
        stepEmpId: s.stepEmpId, lockYn: s.lockYn ? 'true' : 'false', addEmpId: null,
      })),
      relates: relatesRef.current ? { ...relatesRef.current, stampDoc: stampDocMap() } : undefined,
    };
  };

  /** save() L5007-5058 — 서버도 같은 순서로 다시 검사한다 */
  const checkSave = (): string | null => {
    const out = form.inOutTypeCode === '10';
    if (out && !form.signCompany) return '대외문서에 대표회사는 필수입력항목입니다.';
    if (!form.title) return '제목은 반드시 입력하셔야 합니다';
    if (form.title.length > 200) return '상신제목의 글자수가 초과하였습니다';
    if (!form.effectDate) return '시행일은 필수입력 항목입니다';
    if (!form.regDate) return '상신일은 필수입력 항목입니다';
    if (!form.content) return '내용은 필수입력 항목입니다';
    if (out) {
      if (!form.stampId) return '대외문서는 인감선택이 필수입니다';
      if (!form.receiveName) return '수신자는 필수입력 항목입니다';
    }
    return stampDocError();
  };

  /** beforePDFChk L4443-4447 → updateChk L4837-4847 → preCheck L5389-5437 */
  const checkRequest = (): string | null => {
    if (form.inOutTypeCode === '10') {
      if (!form.signCompany) return '대외문서에 대표회사는 필수입력항목입니다.';
    } else if (form.stampId) return '사내문서는 인감사용이 불가능합니다.';
    if (!form.title) return '상신제목은 필수입력 항목입니다';
    if (form.title.length > 200) return '상신제목의 글자수가 초과하였습니다';
    if (!form.effectDate) return '시행일은 필수입력 항목입니다';
    if (!form.regDate) return '상신일은 필수입력 항목입니다';
    if (!form.content) return '내용은 필수입력 항목입니다';
    return stampDocError();
  };

  const afterWrite = (res: AprApprWriteRes) => {
    if (res.notice && res.notice !== 'confirm') message.info(res.notice);
    onClosed?.();
    onClose();
  };

  const callSave = async (mode: 'save' | 'request', msg: string | null, confirmed: boolean) => {
    if (!doc) return;
    setSaving(true);
    try {
      const res = await aprWriteApi.save(doc.apprId, buildReq(mode, msg, confirmed));
      if (res.ok) { onLinkSaved?.(doc.apprId); afterWrite(res); return; }
      if (res.notice === 'confirm') {
        Modal.confirm({
          title: '확인', content: res.message, width: 490, okText: '예', cancelText: '아니오',
          onOk: () => callSave(mode, msg, true),
        });
        return;
      }
      if (res.message) message.warning(res.message);
    } catch (err) {
      message.error(errorMessage(err, mode === 'save' ? '저장 실패' : '결재요청 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E25] saveButton[저장].Select (L4346) → save() L5007-5128: apr.Apr01_Appr.update, 상태 99(임시저장)
  const save = () => {
    const err = checkSave();
    if (err) { message.warning(err); return; }
    void callSave('save', null, false);
  };

  // [E24] updateButton[결재요청].Select (L4327) → apprStepLockChk01() L4407-4430(결재권자가 없으면 "계속 진행하시겠습니까?") → beforePDFChk() → updateChk() → preCheck() → 결재의견 창(updateContinue L4892) → update(msg) L4904
  const confirmedStepLine = useRef(false);
  const stampFieldsConfirmed = useRef(false);
  const requestApproval = () => {
    const err = checkRequest();
    if (err) { message.warning(err); return; }
    // apprStepLockChk L4376-4405 → fieldChk(): 날인신청 줄이 없는데 제공처·제공목적·비고에 글이 있으면 한 번 묻는다. 날인부수(stampQtyChk)는 [+]가 늘 1 이상으로 넣어 걸릴 일이 없다
    const sd = stampDocRef.current;
    if (sd && sd.count === 0 && (sd.provideCo || sd.purpose || sd.note) && !stampFieldsConfirmed.current) {
      Modal.confirm({
        title: '확인', content: '[날인신청]이 등록되지 않아 [제공처, 제공목적, 비고] 입력 내용이 삭제됩니다. 계속하시겠습니까?', width: 680, okText: '예', cancelText: '아니오',
        onOk: () => { stampFieldsConfirmed.current = true; requestApproval(); },
      });
      return;
    }
    stampFieldsConfirmed.current = false;
    // checkStepLine L1872-1885: 결재·합의가 하나도 없으면 한 번 묻는다
    if (!stepsRef.current.some(st => st.stepTypeCode === '10' || st.stepTypeCode === '20')) {
      Modal.confirm({
        title: '확인', content: '결재선에 상신자 외 결재권자가 없습니다. 계속 진행하시겠습니까?', width: 490, okText: '예', cancelText: '아니오',
        onOk: () => { confirmedStepLine.current = true; setRequestNoteOpen(true); },
      });
      return;
    }
    confirmedStepLine.current = false;
    setRequestNoteOpen(true);
  };

  // [E14] deleteButton[삭제].Select (L4106) → deleteChk01() L1275-1300 → apr.Apr01_Appr.deleteByApprId (임시저장 문서는 완전 삭제)
  const deleteDoc = () => {
    Modal.confirm({
      title: '확인', content: '해당 문서를 삭제하시겠습니까?', width: 400, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (!doc) return;
        try {
          const res = await aprWriteApi.remove(doc.apprId);
          if (res.ok) afterWrite(res); else if (res.message) message.warning(res.message);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E3] header.Dom 클릭 (L380) — 원본도 빈 핸들러
  // header tool: [E1] historyButton[열람기록].Select (L348) → Apr41_Lookup_OpenHistory.open(apprId) — V04
  //              [E2] commentButton[댓글].Select (L355) → getCommentSize() L5808-5820 (건수 갱신) — 댓글 창은 Apr42_Lookup_Comment.open(apprModel, cb) — V04
  // [E18] makeDisposalListButton L4142-4171: apr.Apr90_DisposalList.checkDisposal — 안 되면 서버 문구, 되면 Apr90_Lookup_DisposalList.open
  const disposal = async () => {
    if (apprId == null) return;
    try {
      const c = await aprExtraApi.checkDisposal(apprId);
      if (!c.ok) { Modal.info({ title: '확인', content: c.message ?? '폐기할 수 없습니다', okText: '확인' }); return; }
      setDisposalOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // getApprBookmark() L562-580: 북마크 별을 다시 읽는다
  const refreshBookmark = () => {
    if (apprId == null) return;
    aprDetailApi.isBookmarked(apprId).then(setBookmarked).catch(err => message.error(errorMessage(err, '조회 실패')));
  };
  const refreshCommentSize = () => {
    if (apprId == null) return;
    aprDetailApi.getCommentSize(apprId).then(setCommentSize).catch(err => message.error(errorMessage(err, '조회 실패')));
  };
  const title = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span>{doc?.classTreeFullName ?? '문서상세'}</span>
      {!isNew && (
        <Space size={4}>
          <Button type="view" onClick={() => setHistoryOpen(true)}>열람기록</Button>
          <Button type="view" onClick={() => { refreshCommentSize(); setCommentOpen(true); }}>댓글 {commentSize}</Button>
        </Space>
      )}
    </div>
  );

  return (
    <LookupModal
      open={open}
      title={title}
      width={1600}
      style={{ top: 20 }}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* [E6] bookMarkAnchor.MouseDown (L493) → Apr50_Lookup_PersonList.open(apprId, cb) — 중요표시 설정 창은 V09 */}
          <span
            role="button"
            aria-label="북마크"
            style={{ cursor: 'pointer', fontSize: 24, color: bookmarked ? '#faad14' : '#bfbfbf' }}
            onMouseDown={() => { if (!isNew && apprId != null) setBookmarkOpen(true); }}
          >
            {bookmarked ? <StarFilled /> : <StarOutlined />}
          </span>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Space>
              {/* [E24] updateButton[결재요청] · [E25] saveButton[저장] · [E14] deleteButton[삭제] — 편집 모드(내 임시저장·새 문서) */}
              {editable && <Button type="register" loading={saving} onClick={requestApproval}>결재요청</Button>}
              {editable && !(linkLock && !linkLock.saveVisible) && <Button type="save" loading={saving} onClick={save}>저장</Button>}
              {editable && !isNew && <Button type="delete" onClick={deleteDoc}>삭제</Button>}
              {/* [E9] confirmButton[승인] · [E10] rejectButton[반려] — myTurnCheck L1097-1112: 내 차례일 때만 */}
              {state?.canConfirm && <Button type="save" onClick={() => void confirmCheck('confirm')}>승인</Button>}
              {state?.canConfirm && <Button type="cancel" onClick={() => void confirmCheck('reject')}>반려</Button>}
              {/* [E20] makeIcsEditButton[연관법규 추가/수정/삭제] (L4186) — 결재 전·결재중(10·20) 문서 (retrieveApproval L702-704) */}
              {!isNew && doc != null && (doc.statusCode === '10' || doc.statusCode === '20') && <Button type="register" onClick={() => setIcsOpen(true)}>연관법규 추가/수정/삭제</Button>}
              {/* [E15] makeFileAddButton[결재완료후 첨부파일등록] (L4117) — 결재완료(30) 문서 (makeAfterAddButton L4115-4140) */}
              {!isNew && doc?.statusCode === '30' && <Button type="attach" onClick={() => setAfterFileOpen(true)}>결재완료후 첨부파일등록</Button>}
              {/* [E16] makeApprAddButton[연관문서설정] (L4123) → apprAdd() L1332 · [E17] makeFundAddButton[연관펀드설정] (L4130) → fundAdd() L1342 — 같은 결재완료(30) 문서 */}
              {!isNew && doc?.statusCode === '30' && <Button type="register" onClick={() => setRelateApprOpen(true)}>연관문서설정</Button>}
              {!isNew && doc?.statusCode === '30' && <Button type="register" onClick={() => setRelateFundOpen(true)}>연관펀드설정</Button>}
              {/* [E21] makeTypoButton[오타수정] (L4264) — 결재 전·결재중 문서에서 내 차례일 때 (makeTypoButton L4195-4286) */}
              {!isNew && state?.canTypo && <Button type="view" onClick={() => setTypoOpen(true)}>오타수정</Button>}
              {/* [E19] makePersonAuthAddButton[공람설정] (L4175) — 결재완료(30) 문서 (retrieveApproval L706-709) */}
              {!isNew && doc?.statusCode === '30' && <Button type="register" onClick={() => setAuthOpen(true)}>공람설정</Button>}
              {/* [E18] makeDisposalListButton[문서폐기 신청] (L4144) — 결재완료·반려 문서의 상신자 본인 (L706-716) */}
              {!isNew && doc != null && (doc.statusCode === '30' || doc.statusCode === '40') && doc.regEmpId === user.userId
                && <Button type="delete" onClick={() => void disposal()}>문서폐기 신청</Button>}
              {/* [E4] pdfButton[미리보기].Select (L461) → 대외문서면 makePreviewPDF(null), 사내문서(품의·보고)면 "시스템에서 제공하는 기본 양식을 적용하여 보시겠습니까?" 확인 [E5] 뒤 PDF — PDFViewer는 V04 */}
              <Button type="view" onClick={() => next('PDF 미리보기는 V11에서 연결합니다.')}>미리보기</Button>
              {/* [E13] cancelButton[상신취소] — myTurnCheck(true) L1116-1118: 아무도 결재하지 않은 내 문서 */}
              {state?.canCancelRequest && <Button type="cancel" onClick={() => void cancelRequest()}>상신취소</Button>}
              {/* [E11] closeButton[닫기].Select [callback != null] (L1121) → callback.execute(), hide() */}
              <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
              {/* [E7] cancelApprovalButton[승인취소] — retrieveApproval L725-727: 결재완료·반려가 아니고 내가 승인한 단계를 되돌릴 수 있을 때(AS-IS는 닫기 뒤에 붙는다) */}
              {state?.canCancelApproval && <Button type="cancel" onClick={cancelApproval}>승인취소</Button>}
            </Space>
          </div>
          <span style={{ width: 24 }} />
        </div>
      }
    >
      {doc && (
        <div style={{ height: 'min(740px, calc(100vh - 190px))', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* north 150: 왼쪽 문서구분·상신제목, 오른쪽 시행일자~비고 */}
          <div style={{ display: 'flex', gap: 24, background: '#f5f5f5', borderRadius: 4, padding: '10px 14px' }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* 문서구분 라디오: setRadio(inOutTypeCode) L4825-4834 — 읽기에서는 바꿀 수 없다 */}
              <Row label="문서구분">
                <Radio.Group
                  value={editable ? form.inOutTypeCode : (doc.inOutTypeCode === '10' ? '10' : '20')}
                  disabled={!editable}
                  onChange={e => set({ inOutTypeCode: e.target.value })}
                >
                  <Radio value="10">대외문서(공문)</Radio>
                  <Radio value="20">사내문서(품의·보고)</Radio>
                </Radio.Group>
              </Row>
              <Row label="상신제목" grow>
                <Input value={editable ? form.title : (doc.title ?? '')} readOnly={!editable || (linkLock?.titleReadOnly ?? false)} onChange={e => set({ title: e.target.value })} style={{ flex: 1 }} />
              </Row>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="시행일자">
                  {editable
                    ? <DatePicker value={form.effectDate ? dayjs(form.effectDate) : null} onChange={d => set({ effectDate: d ? d.format('YYYY-MM-DD') : '' })} allowClear={false} style={{ width: 130 }} />
                    : <Input value={day(doc.effectDate)} readOnly style={{ width: 110 }} />}
                </Row>
                {/* 상신일자는 관리자만 고친다(regDate.setReadOnly L1516-1518) */}
                <Row label="상신일자">
                  {editable
                    ? <DatePicker value={form.regDate ? dayjs(form.regDate) : null} disabled style={{ width: 130 }} />
                    : <Input value={day(doc.regDate)} readOnly style={{ width: 110 }} />}
                </Row>
                {/* [E32] 인감종류 트리거 → Apr10_Lookup_DocStamp (findLookupStamp L4721), 오른쪽은 위치 콤보(StampLocation) */}
                <Row label="인감종류" grow>
                  {editable
                    ? <Input value={form.stampName} readOnly style={{ flex: 1 }}
                        addonAfter={<SearchOutlined aria-label="인감종류 찾기" style={{ cursor: 'pointer' }} onClick={() => setStampOpen(true)} />} />
                    : <Input value={doc.stampName ?? ''} readOnly style={{ flex: 1 }} />}
                  {editable
                    ? <SystemCodeComboBox kindCd="StampLocation" value={form.stampPosition || undefined} onChange={c => set({ stampPosition: c ?? '' })} style={{ width: 90 }} />
                    : <Input value={doc.stampPositionName ?? ''} readOnly style={{ width: 90 }} />}
                </Row>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="대표회사" grow>
                  {/* [E33] 대표회사 트리거 → Apr15_Lookup_ReprCorp (L4727) */}
                  <Input value={editable ? form.signCompany : (doc.signCompany ?? '')} placeholder="대외문서 하단표기" readOnly={!editable} onChange={e => set({ signCompany: e.target.value })} style={{ flex: 1 }}
                    addonAfter={editable ? <SearchOutlined aria-label="대표회사 찾기" style={{ cursor: 'pointer' }} onClick={() => setCorpOpen(true)} /> : undefined} />
                </Row>
                <Row label="대표서명" grow>
                  <Input value={editable ? form.signCeo : (doc.signCeo ?? '')} placeholder="대외문서 하단표기" readOnly={!editable} onChange={e => set({ signCeo: e.target.value })} style={{ flex: 1 }} />
                </Row>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Row label="수    신" grow>
                  <Input value={editable ? form.receiveName : (doc.receiveName ?? '')} readOnly={!editable} onChange={e => set({ receiveName: e.target.value })} style={{ flex: 1 }} />
                </Row>
                <Row label="참    조" grow>
                  <Input value={editable ? form.referenceName : (doc.referenceName ?? '')} readOnly={!editable} onChange={e => set({ referenceName: e.target.value })} style={{ flex: 1 }} />
                </Row>
              </div>
              <Row label="비    고" grow>
                <Input value={editable ? form.note : (doc.note ?? '')} readOnly={!editable} onChange={e => set({ note: e.target.value })} style={{ flex: 1 }} />
              </Row>
            </div>
          </div>
          {/* center: 왼쪽 상신내용 / 오른쪽 탭 + 결재선 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 'bold', fontSize: 12 }}>상신내용</span>
                {/* getHtmlForm L4796-4817: [E30] copyButton[불러오기] (L4674) → loadDoc() · [E31] formButton[양식] (L4680) → loadForm() — 편집 모드에서만 켜진다 (setReadOnly L5847).
                    [E22] fileUpload.Change (L4294) · [E23] fileUploadForm.SubmitComplete (L4304) · [E34] fileUpload.Change (L5792)은 본체의 숨은 올리기 폼이라 Apr03_Page_Relate [등록]이 대신한다(V05) */}
                <Button type="register" disabled={!editable} onClick={() => setLoadDocOpen(true)}>불러오기</Button>
                <Button type="register" disabled={!editable} onClick={() => setFormOpen(true)}>양식</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                {/* 편집 모드는 HTML 편집기(AS-IS CKEditor, getHtmlForm L4796-4817) — 값은 열 때 한 번만 넣는다 */}
                {editable
                  ? <HtmlEditor key={`${doc.apprId}-${editorKey}`} value={form.content} onChange={html => set({ content: html })} height={Math.max(300, window.innerHeight - 450)} />
                  : <HtmlView html={doc.content} height="100%" />}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Apr03_Page_Relate
                key={`${doc.apprId}-${reloadKey}-${relateKey}`}
                doc={doc}
                editable={editable}
                isNew={isNew}
                seed={seed}
                onStepsChange={steps => { stepsRef.current = steps; }}
                onRelatesChange={relates => { relatesRef.current = relates; }}
                stamp={{ id: form.stampId ?? null, name: form.stampName ?? '' }}
                onStampDocChange={v => { stampDocRef.current = v; }}
                stepsReplace={stepsReplace}
                canRetouch={!!state?.canRetouchSteps}
                onRetouched={() => { onClosed?.(); setReloadKey(k => k + 1); }}
              />
            </div>
          </div>
        </div>
      )}
      <Apr01_Edit_NoteMessage open={noteOpen} onSubmit={text => void confirm('confirm', text)} onClose={() => setNoteOpen(false)} />
      {/* 결재요청의 결재의견 창 (updateContinue L4892-4901: Apr01_Edit_NoteMessage.editMessage → update(msg)) */}
      <Apr01_Edit_NoteMessage
        open={requestNoteOpen}
        onSubmit={text => { setRequestNoteOpen(false); void callSave('request', text, confirmedStepLine.current); }}
        onClose={() => setRequestNoteOpen(false)}
      />
      <Apr01_Edit_RejectMessage open={rejectOpen} onSubmit={text => void confirm('reject', text)} onClose={() => setRejectOpen(false)} />
      {/* V09: 오타수정·공람설정·문서폐기 신청·중요표시 창. 오타수정 저장 뒤(callback L4235-4247) 머리·본문·결재선을 다시 그린다 */}
      <Apr01_Edit_ApprModi
        doc={typoOpen ? doc : null}
        onSaved={updated => { setTypoOpen(false); setDoc(updated); setForm(toForm(updated)); setRelateKey(k => k + 1); onClosed?.(); }}
        onClose={() => setTypoOpen(false)}
      />
      {/* V05: [불러오기] loadDoc() L5580 — 제목·본문을 가져온다 / [양식] loadForm() L5593 — 본문만 */}
      <Apr05_Lookup_LoadDoc2
        open={loadDocOpen}
        onResult={d => { set({ title: d.title, content: d.content }); setEditorKey(k => k + 1); setLoadDocOpen(false); }}
        onClose={() => setLoadDocOpen(false)}
      />
      <Dcr05_Lookup_FormView
        open={formOpen}
        classTreeId={doc?.classTreeId ?? null}
        onResult={html => { set({ content: html }); setEditorKey(k => k + 1); setFormOpen(false); }}
        onClose={() => setFormOpen(false)}
      />
      <Apr20_Lookup_RelateIcsList
        target={icsOpen && doc != null && apprId != null ? { apprId, statusCode: doc.statusCode } : null}
        onClosed={() => setRelateKey(k => k + 1)}
        onClose={() => setIcsOpen(false)}
      />
      {/* V12: 인감종류·대표회사 조회창 */}
      <Apr10_Lookup_DocStamp classTreeId={stampOpen && doc != null ? doc.classTreeId : null} onResult={s => void pickStamp(s)} onClose={() => setStampOpen(false)} />
      <Apr15_Lookup_ReprCorp open={corpOpen} companyAddYn={false} onResult={r => void pickReprCorp(r)} onClose={() => setCorpOpen(false)} />
      <Apr01_Lookup_ApprFile apprId={afterFileOpen && apprId != null ? apprId : null} onClosed={() => setRelateKey(k => k + 1)} onClose={() => setAfterFileOpen(false)} />
      {/* callback.execute() → relateList.setRelateApprList(apprModel)·setRelateFundList(apprModel): 연관 탭을 다시 읽는다 */}
      <Apr01_Lookup_RelateAppr apprId={relateApprOpen && apprId != null ? apprId : null} onClosed={() => setRelateKey(k => k + 1)} onClose={() => setRelateApprOpen(false)} />
      <Apr01_Lookup_RelateFund apprId={relateFundOpen && apprId != null ? apprId : null} onClosed={() => setRelateKey(k => k + 1)} onClose={() => setRelateFundOpen(false)} />
      <Apr13_Lookup_PersonAuth apprId={authOpen && apprId != null ? apprId : null} onClose={() => setAuthOpen(false)} />
      <Apr90_Lookup_DisposalList
        apprId={disposalOpen && apprId != null ? apprId : null}
        onSubmitted={() => Modal.info({ title: '확인', content: '문서 폐기신청이 완료되었습니다', okText: '확인' })}
        onClose={() => setDisposalOpen(false)}
      />
      <Apr50_Lookup_PersonList apprId={bookmarkOpen && apprId != null ? apprId : null} onChanged={refreshBookmark} onClose={() => setBookmarkOpen(false)} />
      {/* V04: 열람기록·댓글 창 */}
      <Apr41_Lookup_OpenHistory apprId={historyOpen && apprId != null ? apprId : null} onClose={() => setHistoryOpen(false)} />
      <Apr42_Lookup_Comment apprId={commentOpen && apprId != null ? apprId : null} onChanged={refreshCommentSize} onClose={() => setCommentOpen(false)} />
    </LookupModal>
  );
};
