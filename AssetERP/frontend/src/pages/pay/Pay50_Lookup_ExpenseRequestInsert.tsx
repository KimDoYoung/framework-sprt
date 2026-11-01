/**
 * 사업비 지출요청 등록·수정·보기 창 (Y08) — Pay50_Tab_ExpenseRequest의 [등록]·수정 아이콘이 연다 (모드 pass는 지출결의서 [바로등록])
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_ExpenseRequestInsert.java (1303줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L303-422: 모달 930×860 "사업비 지출요청 내역등록"(수정 "…내역수정", 보기 "…내역", 바로등록 "지출결의서 바로등록"), 라벨 115, 폭 860 줄 —
 *   구분·발생일자·승인자 / 지출처 + 선급계좌 / 지출내역 / 내역상세 + 양식 콤보 / 편집기 200 / 면세구분·지급요청일 / 공급가액·지급방법(+선급관리계좌) / 세액·지급계좌 / 합계·계정과목 /
 *   증빙문서([조회][불러오기][신규문서 작성][연결제거] + 그리드 110) / 증빙파일([파일업로드] + 그리드 110), 아래 가운데 ([불러오기]) [저장][닫기]
 * 번호(expenseId)는 열 때 먼저 받아(insert L200-253 dbUtil.setSeq) 첨부파일·증빙문서를 그 번호에 붙이고, [저장]에서 행을 만든다. view()는 칸을 모두 읽기 전용으로 하고 [저장]을 숨긴다(disabled L1236-1260).
 * 다음 단계: [신규문서 작성]의 전자결재 편집창(Apr01_Edit_ApprDoc.insertApproval) — 문서분류만 정하고 안내한다(Act80_Lookup_RelateAppr와 같음)
 * UX보강(10): 편집창 규격(11 §4a — 머리말 아래 선·푸터 위 선·라벨 오른쪽 정렬)
 */
import type { GetRef } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { sysApi } from '@/api/sys';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { PayExpense, PayExpenseMineSaveReq, PayExpenseRelateAppr } from '@/types/pay';
import { FileInfo } from '@/types/sys';
import { AprLoadDoc2 } from '@/types/apr';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Sys17_Lookup_Account } from '@/components/lookup/Sys17_Lookup_Account';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { Ast01_Lookup_CorpAccount } from '../ast/Ast01_Lookup_CorpAccount';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc2 } from '../apr/Apr05_Lookup_LoadDoc2';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Pay50_Lookup_Content } from './Pay50_Lookup_Content';
import { Pay50_Lookup_ExpenseCopy } from './Pay50_Lookup_ExpenseCopy';
import { Pay52_Lookup_AccountCode } from './Pay52_Lookup_AccountCode';

const FORMAT = 'YYYY-MM-DD';
const LABEL_BLUE = '#0069B4';
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
const NEXT_STEP = '전자결재 문서 창(Apr01_Edit_ApprDoc 새 문서)은 다음 단계에서 연결합니다.';
const fmt = (v: number | string | undefined) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const parse = (v: string | undefined) => (v ? v.replace(/,/g, '') : '');
/** 빈 글자는 null (GWT TextField.getCurrentValue()) */
const nz = (v: string | null | undefined) => (v === undefined || v === null || v === '' ? null : v);
/** 지급방법이 현금(20)·법인카드(15)·선급비용(17)이면 지급요청계좌가 없다 (payMethodValueChangeEvent L823-848) */
const NO_ACCOUNT = ['20', '15', '17'];

export type ExpenseRequestMode = 'insert' | 'edit' | 'view' | 'pass';

/** 편집 폼 (editDriver) */
interface Form {
  expenseCode: string | null; expenseName: string | null;
  occDate: string | null; dueDate: string | null;
  confirmerId: number | null; confirmerName: string | null;
  corpId: number | null; corpName: string | null; astId: number | null; astName: string | null;
  desc: string | null;
  taxType: string | null; taxTypeName: string | null;
  amt: number | null; tax: number | null; settleAmt: number | null;
  payMethodCode: string | null; payMethodName: string | null; payAccountInfo: string | null;
  depositId: number | null; depositName: string | null;
  accountCode: string | null; accountName: string | null;
}

const EMPTY: Form = {
  expenseCode: '10', expenseName: '사업비요청', occDate: null, dueDate: null, confirmerId: null, confirmerName: null,
  corpId: null, corpName: null, astId: null, astName: null, desc: null, taxType: null, taxTypeName: null,
  amt: 0, tax: 0, settleAmt: 0, payMethodCode: null, payMethodName: null, payAccountInfo: null, depositId: null, depositName: null,
  accountCode: null, accountName: null,
};

const fromExpense = (m: PayExpense): Form => ({
  expenseCode: m.expenseCode, expenseName: m.expenseName, occDate: m.occDate, dueDate: m.dueDate,
  confirmerId: m.confirmerId, confirmerName: m.confirmerOrgName,
  corpId: m.corpId, corpName: m.corpName, astId: m.astId, astName: m.astName, desc: m.desc,
  taxType: m.taxType, taxTypeName: m.taxTypeName, amt: m.amt, tax: m.tax, settleAmt: m.settleAmt,
  payMethodCode: m.payMethodCode, payMethodName: m.payMethodName,
  payAccountInfo: NO_ACCOUNT.includes(m.payMethodCode ?? '') ? null : m.payAccountInfo,
  depositId: m.depositId, depositName: m.depositName, accountCode: m.accountCode, accountName: m.accountName,
});

/** 칸 하나: 라벨(폭 115, 오른쪽 정렬, 필수는 파란색) + 입력. 폭은 칸 전체(라벨 포함) */
const Field: React.FC<{ label?: string; width: number; required?: boolean; children: React.ReactNode }> = ({ label, width, required, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
    <label style={{ width: 115, flexShrink: 0, textAlign: 'right', paddingRight: 10, color: required ? LABEL_BLUE : undefined }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{children}</div>
);

const gbRelate = gbFor<PayExpenseRelateAppr>();
const gbFile = gbFor<FileInfo>();

interface Props {
  open: boolean;
  /** insert = 등록, edit = 수정(승인상태 없는 건), view = 보기, pass = 지출결의서 바로등록(insertPass) */
  mode: ExpenseRequestMode;
  /** edit·view: 목록에서 고른 건 */
  expenseId?: number | null;
  /** insertPass(isManager, …) — 관리자는 승인자 칸이 보이고, 계정과목 창이 관리자 모드로 열린다 */
  isManager?: boolean;
  /** callback.execute() — [저장] 뒤. 부르는 쪽이 목록을 다시 읽는다 */
  onSaved: () => void;
  onClose: () => void;
}

export const Pay50_Lookup_ExpenseRequestInsert: React.FC<Props> = ({ open, mode, expenseId: openId, isManager = false, onSaved, onClose }) => {
  const user = useLoginUser();
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const occDateRef = useRef<GetRef<typeof DatePicker>>(null);
  /** 이 창이 다루는 번호 — insert는 열 때 새로 받는다 */
  const [expenseId, setExpenseId] = useState<number | null>(null);
  const [f, setF] = useState<Form>(EMPTY);
  /** 승인상태 코드(수정·보기에서 파일 삭제 가능 여부) */
  const [confirmStatusCode, setConfirmStatusCode] = useState<string | null>(null);
  const [html, setHtml] = useState('');
  /** HtmlEditor는 만들 때 한 번만 값을 받으므로 값을 바꿔 다시 열 때 key를 바꾼다(11 §3) */
  const [editorKey, setEditorKey] = useState(0);
  const [formCode, setFormCode] = useState('');
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [relates, setRelates] = useState<PayExpenseRelateAppr[]>([]);
  const [relateChecked, setRelateChecked] = useState<PayExpenseRelateAppr[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [detailApprId, setDetailApprId] = useState<number | null>(null);
  const [loadDocOpen, setLoadDocOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [confirmerOpen, setConfirmerOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [prePayCorpOpen, setPrePayCorpOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  const isView = mode === 'view';
  const isPass = mode === 'pass';
  const set = (patch: Partial<Form>) => setF(prev => ({ ...prev, ...patch }));

  const title = { insert: '사업비 지출요청 내역등록', edit: '사업비 지출요청 내역수정', view: '사업비 지출요청 내역', pass: '지출결의서 바로등록' }[mode];

  // relateRetrieve() L959-965: com.Com01_RelateAppr.selectByKeyTableId
  const relateRetrieve = useCallback(async (id: number | null = expenseId) => {
    if (id == null) return;
    try {
      setRelates(await payApi.searchExpenseRelateApprs(id));
      setRelateChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [expenseId]);

  // fileRetrieve() L967-972: sys.Sys10_File.selectByParentId
  const fileRetrieve = useCallback(async (id: number | null = expenseId) => {
    if (id == null) return;
    try {
      setFiles(await fileApi.searchByParentId(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [expenseId]);

  // [E0] 화면 열림 (생성자 L303-422) → settings(), getEditor() / insert() L200-253 · edit() L255-276 · view() L278-301
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setReady(false); setF(EMPTY); setHtml(''); setFormCode(''); setRelates([]); setFiles([]); setConfirmStatusCode(null);
    (async () => {
      try {
        if (mode === 'insert' || mode === 'pass') {
          // pay.Pay50_Expense.getConfirmerId(companyId, personId, stdDate 오늘) → 승인자·기본 면세구분, 번호는 dbUtil.setSeq
          const [confirmer, id] = await Promise.all([payApi.getExpenseConfirmer(), payApi.nextExpenseId()]);
          if (!alive) return;
          const today = dayjs().format(FORMAT);
          setExpenseId(id);
          setF({
            ...EMPTY, occDate: today,
            // PASS: 승인자 = 로그인 사원, 승인상태 80(바로등록)
            confirmerId: mode === 'pass' ? user.userId : confirmer?.confirmerId ?? null,
            confirmerName: mode === 'pass' ? user.name : confirmer?.confirmerName ?? null,
            taxType: confirmer?.taxType ?? null, taxTypeName: confirmer?.taxTypeName ?? null,
          });
          setConfirmStatusCode(mode === 'pass' ? '80' : null);
        } else if (openId != null) {
          const m = await payApi.getExpense(openId);
          if (!alive) return;
          setExpenseId(openId);
          setF(fromExpense(m));
          setHtml(m.content ?? '');
          setConfirmStatusCode(m.confirmStatusCode);
          void relateRetrieve(openId);
          void fileRetrieve(openId);
        }
        setEditorKey(k => k + 1);
        setReady(true);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    return () => { alive = false; };
  }, [open, mode, openId]);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── 금액 (E16~E20) ──
  // [E17] amt[공급가액].Change (L730) · [E19] amt.KeyUp (L774) → updateSettleAmt(), updateAmt() L1217-1225: 과세(2)면 세액 = 공급가액의 10%(반올림), 합계 = 공급가액 + 세액
  const setAmt = (amt: number | null) => {
    setF(prev => {
      const a = amt ?? 0;
      const tax = prev.taxType === '2' ? Math.round(a * 0.1) : (prev.tax ?? 0);
      return { ...prev, amt, tax, settleAmt: a + tax };
    });
  };
  // [E18] tax[세액].Change (L758) · [E20] tax.KeyUp (L784) → updateSettleAmt() L1227-1234: 합계 = 공급가액 + 세액
  const setTax = (tax: number | null) => setF(prev => ({ ...prev, tax, settleAmt: (prev.amt ?? 0) + (tax ?? 0) }));
  // [E16] taxTypeName[면세구분].Selection (L704) → 과세(2)면 세액 10%, 아니면 0
  const selectTaxType = (code: string | undefined, name?: string) => {
    setF(prev => {
      const a = prev.amt ?? 0;
      const tax = code === '2' ? Math.round(a * 0.1) : 0;
      return { ...prev, taxType: code ?? null, taxTypeName: name ?? null, tax, settleAmt: a + tax };
    });
  };
  // [E14] payMethodName[지급방법].Selection (L671) → payMethodValueChangeEvent() L823-848: 현금·법인카드·선급비용이면 지급계좌를 비우고, 선급비용(17)만 선급관리계좌 칸이 보인다
  const selectPayMethod = (code: string | undefined, name?: string) => {
    setF(prev => ({
      ...prev, payMethodCode: code ?? null, payMethodName: name ?? null,
      payAccountInfo: NO_ACCOUNT.includes(code ?? '') ? null : prev.payAccountInfo,
      ...(code === '17' ? {} : { depositId: null, depositName: null }),
    }));
  };
  // [E2] expenseName[구분].Collapse (L464) → 값이 바뀌면 지출처·지급계좌·선급계좌를 비운다
  const selectExpenseKind = (code: string | undefined, name?: string) => {
    setF(prev => (prev.expenseCode === (code ?? null) ? prev : {
      ...prev, expenseCode: code ?? null, expenseName: name ?? null,
      corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null,
    }));
  };
  // [E3] formComboBox[ExpenseDetailType].Collapse (L479) → 없으면 편집기를 비우고, 있으면 pay.Pay51_ExpenseForm.formCodeCall의 양식 내용을 넣는다
  const selectForm = async (code: string | undefined) => {
    const c = nz(code);
    setFormCode(c ?? '');
    if (c == null) { setHtml(''); setEditorKey(k => k + 1); return; }
    try {
      const form = (await payApi.searchExpenseForms()).find(x => x.formCode === c);
      if (form) { setHtml(form.content ?? ''); setEditorKey(k => k + 1); }
    } catch (err) {
      message.error(errorMessage(err, '양식 조회 실패'));
    }
  };

  // ── 조회창 (E9~E15) ──
  /** 거래처의 대표계좌 "은행 계좌번호 예금주" (AS-IS Sys15_CorpModel.getPayAccountInfo — 대표계좌 서브쿼리) */
  const mainAccountInfo = async (corpId: number) => {
    const accounts = await sysApi.searchCorpAccounts(corpId);
    const main = accounts.find(a => a.mainAccountYn === 'true');
    return main ? [main.bankName, main.accountNoDec, main.accountName].filter(Boolean).join(' ') : null;
  };
  // [E10] corpName[지출처].TriggerClick (L558) → 구분이 기타출금(선급, 91)이면 Ast01_Lookup_CorpAccount.openPrePayOnly, 아니면 Sys15_Lookup_Corp.open(true, true)
  const openCorp = () => (f.expenseCode === '91' ? setPrePayCorpOpen(true) : setCorpOpen(true));
  const lookupCorpDone = async (corp: { corpId: number; corpName: string | null } | null) => {
    setCorpOpen(false);
    if (corp) {
      let info: string | null = null;
      try { info = await mainAccountInfo(corp.corpId); } catch { /* 대표계좌를 못 읽어도 지출처는 고른다 */ }
      set({ corpId: corp.corpId, corpName: corp.corpName, payAccountInfo: info, payMethodName: '계좌이체', payMethodCode: '10', depositId: null, depositName: null, astId: null, astName: null });
    } else {
      set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null });
    }
  };
  // [E12] payAccountInfo[지급계좌].TriggerClick [corpId.getValue() == null] (L638) → "지출처 선택 후 지급요청계좌 선택이 가능합니다"
  const openBank = () => {
    if (f.corpId == null) { message.warning('지출처 선택 후 지급요청계좌 선택이 가능합니다'); return; }
    setBankOpen(true);
  };
  // [E15] depositName.TriggerClick [corpId.getValue() == null] (L679) → "먼저 지출처를 선택하세요"
  const openDeposit = () => {
    if (f.corpId == null) { message.warning('먼저 지출처를 선택하세요'); return; }
    setDepositOpen(true);
  };

  // ── 저장 (E6) ──
  // [E6] updateButton[저장].Select (L523) → update() L1053-1124
  const update = async () => {
    if (expenseId == null) return;
    if (f.occDate == null) return void message.warning('발생일자는 필수입력 값입니다');
    if (f.confirmerId == null) return void message.warning('승인자는 필수입력 값입니다');
    if (f.corpId == null) return void message.warning('지출처는 필수입력 값입니다');
    if (nz(f.desc) == null) return void message.warning('지출내역은 필수입력 값입니다');
    if (f.taxType == null) return void message.warning('면세구분은 필수입력 값입니다');
    if (f.tax == null && f.taxType === '2') return void message.warning('면세구분이 과세면 세액은 필수입력 값입니다');
    if (f.dueDate == null) return void message.warning('지급요청일은 필수입력 값입니다');
    if (f.amt == null) return void message.warning('공급가액은 필수입력 값입니다');
    if (f.payMethodCode == null) return void message.warning('지급방법은 필수입력 값입니다');
    if (f.payMethodCode === '10') {
      if (nz(f.payAccountInfo) == null) return void message.warning('지급계좌는 필수입력 값입니다.');
    } else if (f.payMethodCode === '17') {
      if (f.depositId == null) return void message.warning("지급방법이 '선급비용'인 경우 선급관리계좌는 필수입력 값입니다");
    }
    if (f.settleAmt == null) return void message.warning('합계는 필수입력 값입니다.');
    const req: PayExpenseMineSaveReq = {
      expenseCode: f.expenseCode, occDate: f.occDate, desc: nz(f.desc), content: nz(html), corpId: f.corpId, taxType: f.taxType,
      amt: f.amt, tax: f.tax, settleAmt: f.settleAmt, dueDate: f.dueDate, payMethodCode: f.payMethodCode, payAccountInfo: nz(f.payAccountInfo),
      confirmerId: f.confirmerId, accountCode: f.accountCode, astId: f.astId, depositId: f.depositId, pass: isPass,
    };
    setSaving(true);
    try {
      await payApi.saveExpenseMine(expenseId, req);
      onSaved();   // callback.execute() 뒤 hide()
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // ── 불러오기 (E7) ──
  // [E7] copyButton[불러오기].Select (L529) → expenseCopy() L1126-1182: Pay50_Lookup_ExpenseCopy에서 고른 지출결의서로 새 건(새 번호)을 채운다
  const expenseCopy = async (copy: PayExpense) => {
    setCopyOpen(false);
    try {
      const id = await payApi.nextExpenseId();
      const today = dayjs().format(FORMAT);
      setExpenseId(id);
      setF({
        ...fromExpense(copy), occDate: today, confirmerId: user.userId, confirmerName: user.name,
        // payMethodValueChangeEvent(): 복사한 지급방법이 현금·법인카드·선급비용이면 지급계좌를 비운다
        payAccountInfo: NO_ACCOUNT.includes(copy.payMethodCode ?? '') ? null : copy.payAccountInfo,
        dueDate: null,
      });
      setHtml(copy.content ?? '');
      setEditorKey(k => k + 1);
      setConfirmStatusCode('80');
      setRelates([]); setFiles([]); setRelateChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '번호 발급 실패'));
    }
  };

  // ── 증빙문서 (E21~E24, E28) ──
  // [E22] insertButton[불러오기].Select (L797) → relateInsert() L974-983: Apr05_Lookup_LoadDoc2(결재완료 문서만) → insert(apprId) L985-1001: com.Com01_RelateAppr.modelUpdate(keyTable pay50)
  const relateInsert = async (doc: AprLoadDoc2) => {
    setLoadDocOpen(false);
    if (expenseId == null) return;
    try {
      await payApi.addExpenseRelateAppr(expenseId, doc.apprId);
      await relateRetrieve();
    } catch (err) {
      message.error(errorMessage(err, '연결 실패'));
    }
  };
  // [E24] deleteButton[연결제거].Select (L809) → relateDelete() L1003-1023: 선택이 없으면 "연결제거 증빙문서를 선택하세요", 확인(350) → [E28] messageBox.DialogHide [YES] (L1011) → com.Com01_RelateAppr.delete
  const relateDelete = () => {
    if (relateChecked.length === 0) { message.warning('연결제거 증빙문서를 선택하세요'); return; }
    const ids = relateChecked.map(r => r.relateApprId);
    Modal.confirm({
      title: '삭제', content: '선택한 연결문서를 제거하시겠습니까?', width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        if (expenseId == null) return;
        try {
          await payApi.deleteExpenseRelateApprs(expenseId, ids);
          await relateRetrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // ── 증빙파일 (E4·E25·E27) ──
  // [E4] fileUpload.Change (L504) → FileUpload?parentId={expenseId} (여러 파일) → [E5] fileUploadForm.SubmitComplete (L514) → fileRetrieve()
  const onFiles = async (picked: File[]) => {
    if (expenseId == null) return;
    try {
      for (const file of picked) await fileApi.upload(expenseId, file);
    } catch (err) {
      message.error(errorMessage(err, '파일 업로드 실패'));
    }
    await fileRetrieve();
  };
  // checkFileDelete() L1184-1215: 연결만 지움(1) → 다시 조회 / 사용 중(2) → 안내 / 지워도 됨(3) → FileDelete → [E29] fileDeleteForm.SubmitComplete (L1205) → fileRetrieve()
  const checkFileDelete = async (row: FileInfo) => {
    try {
      const status = await fileApi.checkFileDelete(row.fileId, row.parentId);
      if (status === FILE_DELETE_STATUS.RELATE_DELETED) {
        await fileRetrieve();
      } else if (status === FILE_DELETE_STATUS.IN_USE) {
        message.warning('해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다');
      } else if (status === FILE_DELETE_STATUS.DELETABLE) {
        await fileApi.deleteFile(row.fileId);
        await fileRetrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };
  // [E27] messageBox.DialogHide [YES] (L926) → checkFileDelete(). 요청·요청완료 건은 "요청 및 요청완료된 문서는 삭제할 수 없습니다." (L923-937)
  const deleteFile = (row: FileInfo) => {
    if (confirmStatusCode == null || isPass) {
      Modal.confirm({ title: '삭제', content: '선택한 파일을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', onOk: () => checkFileDelete(row) });
    } else {
      message.warning('요청 및 요청완료된 문서는 삭제할 수 없습니다.');
    }
  };

  // relateGrid() L864-904: setChecked(MULTI)
  const relateColumns = useMemo(() => [
    gbRelate.text('title', 250, '제목'),  // L896
    gbRelate.date('regDate', 90, '등록일'),  // L897
    gbRelate.date('effectDate', 90, '시행일'),  // L898
    gbRelate.textCenter('regEmpName', 80, '등록자'),  // L899
    gbRelate.textCenter('statusName', 80, '상신상태'),  // L900
    // [E26] actionCell (ImageCell).callbackOnCreate (L881) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false)
    iconCell<PayExpenseRelateAppr>('view', 'detailCell', 60, '상세보기', row => setDetailApprId(row.apprId)),
  ], []);

  // buildFileGrid() L906-957: setChecked(SINGLE)
  const fileColumns = useMemo(() => [
    gbFile.text('fileNm', 450, '첨부파일'),  // L951
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L952 → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downCell', 50, '받기', row => {  // L953 → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', deleteFile),  // L954 → 확인 후 checkFileDelete()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [confirmStatusCode, isPass, expenseId]);

  const off = !ready || isView;
  const payMethod17 = f.payMethodCode === '17';
  const payAccountDisabled = off || NO_ACCOUNT.includes(f.payMethodCode ?? '');
  const payAccountHint = NO_ACCOUNT.includes(f.payMethodCode ?? '') ? '(해당없음)' : f.payMethodCode === '10' ? '지급계좌 정보를 선택 또는 입력하세요' : '정보를 입력하세요';
  /** 승인자 칸 — 바로등록(PASS)은 관리자만 보이고 바꿀 수 없다 */
  const confirmerVisible = !isPass || isManager;

  return (
    <Modal
      open={open}
      title={title}
      width={930}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 견본: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E7] copyButton[불러오기].Select (L529) — 바로등록(PASS)에서만 */}
            {isPass && <Button type="register" onClick={() => setCopyOpen(true)}>불러오기</Button>}
            {/* [E6] updateButton[저장].Select (L523) — 보기에서는 숨김 */}
            {!isView && <Button type="save" loading={saving} disabled={!ready} onClick={() => void update()}>저장</Button>}
            {/* [E8] closeButton[닫기].Select (L535) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px', height: 'calc(100vh - 230px)', overflowY: 'auto', boxSizing: 'border-box' }}>
        <Row>
          <Field label="구분" width={250} required>
            <SystemCodeComboBox kindGroupCd="ExpenseType0003" style={{ width: '100%' }} allowClear={false} disabled={off}
              value={f.expenseCode ?? undefined} onChange={selectExpenseKind} />
          </Field>
          <div style={{ width: 52 }} />
          <Field label="발생일자" width={250} required>
            <DatePicker ref={occDateRef} style={{ width: '100%' }} allowClear={false} format={FORMAT} disabled={off}
              value={f.occDate ? dayjs(f.occDate) : null} onChange={d => set({ occDate: d ? d.format(FORMAT) : null })} />
          </Field>
          <div style={{ width: 42 }} />
          {confirmerVisible && (
            <Field label="승인자" width={250} required>
              {/* [E9] confirmerName[승인자].TriggerClick (L542) → Emp00_Lookup_SelectSingle.open(발생일자, true, cb) */}
              <LookupInput width={135} value={f.confirmerName ?? ''} disabled={off || isPass} onOpen={() => setConfirmerOpen(true)} />
            </Field>
          )}
        </Row>
        <Row>
          <Field label="지출처" width={555} required>
            <LookupInput width={430} value={f.corpName ?? ''} disabled={off} onOpen={openCorp}
              onClear={() => set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null })} />
          </Field>
          <div style={{ width: 305 }}><Input disabled value={f.astName ?? ''} /></div>
        </Row>
        <Row>
          <Field label="지출내역" width={860} required>
            <Input disabled={off} value={f.desc ?? ''} onChange={e => set({ desc: e.target.value })} />
          </Field>
        </Row>
        <Row>
          {/* [E1] anchor.MouseDown (L313) → Pay50_Lookup_Content.open(getHtmlText(), cb) → setHtmlText() */}
          <div style={{ width: 115, textAlign: 'right', paddingRight: 10 }}>
            <a style={{ textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setContentOpen(true)}>내역상세 :</a>
          </div>
          <div style={{ width: 170 }}>
            <SystemCodeComboBox kindCd="ExpenseDetailType" altCode={['', '(해당없음)']} style={{ width: '100%' }} disabled={off}
              value={formCode} onChange={code => void selectForm(code)} />
          </div>
        </Row>
        <Row>
          <div style={{ width: 115, flexShrink: 0 }} />
          <div style={{ width: 740 }}>
            {isView ? <HtmlView html={html} height={200} /> : (
              ready && <HtmlEditor key={editorKey} value={html} onChange={setHtml} height={200} />
            )}
          </div>
        </Row>
        <Row>
          <Field label="면세구분" width={250} required>
            <SystemCodeComboBox kindCd="TaxType" style={{ width: '100%' }} allowClear={false} disabled={off}
              value={f.taxType ?? undefined} onChange={selectTaxType} />
          </Field>
          <div style={{ width: 52 }} />
          <Field label="지급요청일" width={250} required>
            <DatePicker style={{ width: '100%' }} allowClear={false} format={FORMAT} disabled={off}
              value={f.dueDate ? dayjs(f.dueDate) : null} onChange={d => set({ dueDate: d ? d.format(FORMAT) : null })} />
          </Field>
        </Row>
        <Row>
          <Field label="공급가액" width={250} required>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled={off}
              value={f.amt} onChange={v => setAmt(v == null ? null : Number(v))} />
          </Field>
          <div style={{ width: 52 }} />
          <Field label="지급방법" width={250} required>
            <SystemCodeComboBox kindCd="PayMethodCode" style={{ width: '100%' }} allowClear={false} disabled={off}
              value={f.payMethodCode ?? undefined} onChange={selectPayMethod} />
          </Field>
          {payMethod17 && (
            <div style={{ width: 290 }}>
              {/* [E15] depositName.TriggerClick (L679) → Ast01_Lookup_CorpAccount.openPrePayOnly(발생일자, corpId, cb) */}
              <LookupInput width={290} placeholder="선급관리계좌를 선택하세요" value={f.depositName ?? ''} disabled={off} onOpen={openDeposit}
                onClear={() => set({ depositId: null, depositName: null })} />
            </div>
          )}
        </Row>
        <Row>
          <Field label="세액" width={250}>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled={off}
              value={f.tax} onChange={v => setTax(v == null ? null : Number(v))} />
          </Field>
          <div style={{ width: 52 }} />
          <Field label="지급계좌" width={550}>
            {/* [E13] payAccountInfo[지급계좌].KeyDown (L661) → Tab(Shift 없이)이면 기본 이동을 막고 발생일자로 포커스 */}
            <Input disabled={payAccountDisabled} placeholder={payAccountHint} value={f.payAccountInfo ?? ''}
              onChange={e => set({ payAccountInfo: e.target.value })}
              onKeyDown={e => { if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); occDateRef.current?.focus(); } }}
              suffix={<SearchOutlined style={{ cursor: payAccountDisabled ? 'default' : 'pointer' }} onClick={() => { if (!payAccountDisabled) openBank(); }} />} />
          </Field>
        </Row>
        <Row>
          <Field label="합계" width={250} required>
            <InputNumber style={{ width: '100%' }} controls={false} precision={0} formatter={fmt} parser={parse} disabled value={f.settleAmt} />
          </Field>
          <div style={{ width: 52 }} />
          <Field label="계정과목" width={550}>
            {/* [E11] accountName[계정과목].TriggerClick [result != null] (L621) → Pay52_Lookup_AccountCode.open(isManager, cb) */}
            <LookupInput width={300} value={f.accountName ?? ''} disabled={off} onOpen={() => setCodeOpen(true)} />
          </Field>
        </Row>
        <Row>
          <Field label="증빙문서" width={860}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Space>
                {/* [E21] retrieveButton[조회].Select (L791) → relateRetrieve() */}
                <Button type="search" disabled={isView} onClick={() => void relateRetrieve()}>조회</Button>
                {/* [E22] insertButton[불러오기].Select (L797) → relateInsert() */}
                <Button type="register" disabled={isView} onClick={() => setLoadDocOpen(true)}>불러오기</Button>
                {/* [E23] apprButton[신규문서 작성].Select (L803) → selectDcrClass() L1025-1033 → createAppr() L1035-1051 */}
                <Button type="register" disabled={isView} onClick={() => setClassOpen(true)}>신규문서 작성</Button>
                {/* [E24] deleteButton[연결제거].Select (L809) → relateDelete() */}
                <Button type="delete" disabled={isView} onClick={relateDelete}>연결제거</Button>
              </Space>
              <div style={{ height: 110 }}>
                <MultiGrid<PayExpenseRelateAppr>
                  rowData={relates}
                  columnDefs={relateColumns}
                  getRowId={p => String(p.data.relateApprId)}
                  onCheckedChange={setRelateChecked}
                />
              </div>
            </div>
          </Field>
        </Row>
        <Row>
          <Field label="증빙파일" width={860}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                {/* [E25] uploadFileButton[파일업로드].Select (L815) → fileUpload.click() */}
                <Button type="upload" disabled={off} onClick={() => fileForm.current?.click()}>파일업로드</Button>
                <FileUpdownForm ref={fileForm} onChange={() => undefined} onChangeFiles={onFiles} />
              </div>
              <div style={{ height: 110 }}>
                <SingleGrid<FileInfo>
                  rowData={files}
                  columnDefs={fileColumns}
                  getRowId={p => String(p.data.fileId)}
                  rowSelection={SINGLE_SELECTION}
                />
              </div>
            </div>
          </Field>
        </Row>
      </div>

      <Emp00_Lookup_SelectSingle open={confirmerOpen} transDate={f.occDate ?? dayjs().format(FORMAT)} separateAddTitle noneLabel={null}
        onResult={r => { setConfirmerOpen(false); if (r) set({ confirmerId: r.personId, confirmerName: r.korNm ?? null }); }}
        onClose={() => setConfirmerOpen(false)} />
      <Sys15_Lookup_Corp open={corpOpen} regYn empYn onResult={c => void lookupCorpDone(c)} onClose={() => setCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={prePayCorpOpen} stdDate={dayjs(f.occDate ?? undefined)} prePayOnly corpId={null}
        onResult={row => {
          setPrePayCorpOpen(false);
          if (row) set({ corpId: row.corpId, corpName: row.corpName, payAccountInfo: row.corpPayAccountInfo, astId: row.classTreeId, astName: row.classTreeName, payMethodName: '계좌이체', payMethodCode: '10', depositId: null, depositName: null });
          else set({ corpName: null, corpId: null, payAccountInfo: null, astId: null, astName: null });
        }}
        onClose={() => setPrePayCorpOpen(false)} />
      <Ast01_Lookup_CorpAccount open={depositOpen} stdDate={dayjs(f.occDate ?? undefined)} prePayOnly corpId={f.corpId}
        onResult={row => {
          setDepositOpen(false);
          if (row) set({ depositId: row.classTreeId, depositName: row.classTreeName });
          else set({ depositId: null, depositName: null });
        }}
        onClose={() => setDepositOpen(false)} />
      <Sys17_Lookup_Account open={bankOpen} corpId={f.corpId}
        onResult={a => { setBankOpen(false); set({ payAccountInfo: [a.bankName, a.accountNoDec, a.accountName].join(' ') }); }}
        onClose={() => setBankOpen(false)} />
      <Pay52_Lookup_AccountCode open={codeOpen} isManager={isManager}
        onResult={a => { setCodeOpen(false); set({ accountCode: a.accountCode, accountName: a.accountName }); }}
        onClose={() => setCodeOpen(false)} />
      <Pay50_Lookup_Content open={contentOpen} mode={isView ? 'view' : 'confirm'} content={html}
        onResult={h => { setHtml(h); setEditorKey(k => k + 1); }}
        onClose={() => setContentOpen(false)} />
      <Pay50_Lookup_ExpenseCopy open={copyOpen} isManager={isManager} onResult={row => void expenseCopy(row)} onClose={() => setCopyOpen(false)} />
      <Apr05_Lookup_LoadDoc2 open={loadDocOpen} aprStatusYn onResult={() => undefined} onSelected={doc => void relateInsert(doc)} onClose={() => setLoadDocOpen(false)} />
      <Dcr01_Lookup_Class open={classOpen} onResult={() => { setClassOpen(false); message.info(NEXT_STEP); }} onClose={() => setClassOpen(false)} />
      <Apr01_Edit_ApprDoc apprId={detailApprId} onClose={() => setDetailApprId(null)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </Modal>
  );
};
