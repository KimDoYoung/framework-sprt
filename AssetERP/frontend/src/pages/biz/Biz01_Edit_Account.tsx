/**
 * 법인카드 내역 편집 (U15) — Biz01_Tab_CardManagement 오른쪽(420)
 * AS-IS: myApp/client/vi/biz/Biz01_Edit_Account.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L82-90·getEditor L234-253: 헤더 없음, 폼(라벨 120) = 제공목적(300, 파란 라벨) · 제공내역(300, 파란 라벨) · 계정코드(300) · 계정과목(400, 읽기 전용) · 비고(사용내역)(400×100)
 *   · 비품대장등록(400) · 과세구분(300, 파란 라벨) · 실사용자(300, 회사 설정 `cardRealUserYn`일 때만), 창 아래 가운데 [저장][증빙자료(n건)].
 *   고른 내역이 없으면 통째로 비활성, 마감이면 setButtonVisible(false) L307-337이 제공목적·제공내역·계정코드·계정과목·비품대장·과세구분을 잠근다(비고·실사용자는 그대로).
 * 1단계: 비품대장등록의 `Ast06_Lookup_TrBizCard`(ast 도메인)는 다음 단계 — 칸을 누르면 안내만 띄운다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, message, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { actApi } from '@/api/act';
import { bizCardManagementApi, bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { ActCodeOption, AccountCode } from '@/types/act';
import { BizCardManagement } from '@/types/biz';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Biz05_Lookup_RelateAppr } from './Biz05_Lookup_RelateAppr';

const BLUE = '#0069B4';

interface Props {
  /** editModel(selectModel, …) — 고른 내역. 없으면 비활성 */
  promo: BizCardManagement | null;
  /** setButtonVisible(!closeYn)의 반대: 마감이면 true */
  closed: boolean;
  /** 실사용자 칸을 보일지 (LoginUser.getCompanyModel().getCardRealUserYn()) */
  realUser: boolean;
  /** callback.execute() — 본 화면 조회 */
  onSaved: () => void;
}

const FieldRow: React.FC<{ label: React.ReactNode; marginTop?: number; children: React.ReactNode }> = ({ label, marginTop = 5, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', margin: `${marginTop}px 10px 5px 10px` }}>
    <div style={{ width: 120, flex: 'none', paddingTop: 5 }}>{label}</div>
    {children}
  </div>
);

export const Biz01_Edit_Account: React.FC<Props> = ({ promo, closed, realUser, onSaved }) => {
  const [purCode, setPurCode] = useState<string | undefined>();
  const [contentCode, setContentCode] = useState<string | undefined>();
  const [contents, setContents] = useState<ActCodeOption[]>([]);
  const [accountCodeId, setAccountCodeId] = useState<number | null>(null);
  const [accountCode, setAccountCode] = useState('');
  const [accountName, setAccountName] = useState('');
  const [note, setNote] = useState('');
  const [taxType, setTaxType] = useState<string | undefined>();
  const [realPersonId, setRealPersonId] = useState<number | null>(null);
  const [realPersonName, setRealPersonName] = useState('');
  const [fileCount, setFileCount] = useState('0건');
  const [fileOpen, setFileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState<{ open: boolean; text?: string }>({ open: false });
  const [personOpen, setPersonOpen] = useState(false);
  const promoId = promo?.promoId ?? null;
  /** 마지막으로 확정한 계정코드 글자 — ValueChange는 값이 바뀐 때만 */
  const committedCode = useRef('');

  // refreshCode() L225-232: 서비스 sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%)
  const refreshCode = useCallback(async (pur: string | undefined | null) => {
    if (!pur) { setContents([]); return; }
    try {
      setContents(await actApi.searchProvideContents(pur));
    } catch (err) {
      message.error(errorMessage(err, '제공내역 조회 실패'));
    }
  }, []);

  // setFileButtonText() L436-448: 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) → "증빙자료(n건)"
  const setFileButtonText = useCallback(async () => {
    if (promoId == null) return;
    try {
      setFileCount(await bizRelateApprApi.getFileCount(promoId));
    } catch (err) {
      message.error(errorMessage(err, '증빙자료 건수 조회 실패'));
    }
  }, [promoId]);

  // [E0] 화면 열림 (생성자 L82-90) → setting(), getEditor() · editModel(): 고른 내역을 칸에 채운다
  useEffect(() => {
    if (!promo) {
      setPurCode(undefined); setContentCode(undefined); setContents([]);
      setAccountCodeId(null); setAccountCode(''); setAccountName(''); committedCode.current = '';
      setNote(''); setTaxType(undefined); setRealPersonId(null); setRealPersonName('');
      setFileCount('0건');
      return;
    }
    setPurCode(promo.providePurCode ?? undefined);
    setContentCode(promo.provideContentCode ?? undefined);
    setAccountCodeId(promo.accountCodeId);
    setAccountCode(promo.accountCode ?? '');
    committedCode.current = promo.accountCode ?? '';
    setAccountName(promo.accountName ?? '');
    setNote(promo.note ?? '');
    setTaxType(promo.taxType ?? undefined);
    setRealPersonId(promo.realPersonId);
    setRealPersonName(promo.realPersonName ?? '');
    void refreshCode(promo.providePurCode);
    void setFileButtonText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promo]);

  // [E1] providePurName[제공목적].ValueChange (L109) → 제공내역을 비우고 refreshCode() · [E2] .Collapse (L117) → 제공목적 코드를 모델에 · [E3] .TriggerClick (L123) → refreshCode()
  const changePurpose = (code: string | undefined) => {
    setPurCode(code);
    setContentCode(undefined);
    void refreshCode(code);
  };

  // setAccount() L361-371: 계정을 비우거나 고른 계정으로 채운다
  const setAccount = (acc: AccountCode | null) => {
    setAccountCodeId(acc?.accountCodeId ?? null);
    setAccountCode(acc?.accountCode ?? '');
    setAccountName(acc?.accountName ?? '');
    committedCode.current = acc?.accountCode ?? '';
  };

  // [E7] accountCode[계정코드].ValueChange (L151): 비면 계정을 비우고, 값이 있으면 서비스 act.Act01_AccountCode.selectBySlipYn(attributeCode "%", searchText "%코드%") —
  //   한 건이면 그 계정으로 채우고 아니면 openLookupAccount(searchText) L350-359로 그 글자를 넣어 조회창을 연다
  const commitAccountCode = async () => {
    const text = accountCode.trim();
    if (text === committedCode.current) return;
    if (!text) { setAccount(null); return; }
    try {
      const list = await actApi.searchAccountCodes('', text);
      if (list.length === 1) setAccount(list[0]);
      else setAccountOpen({ open: true, text });
    } catch (err) {
      message.error(errorMessage(err, '계정코드 조회 실패'));
    }
  };

  // [E9] depnBookYn[비품대장등록].TriggerClick (L188) → lookupDepnTr() L373-386: 고른 내역이 없으면 "카드사용내역을 선택해주세요."
  //   → Ast06_Lookup_TrBizCard.open(promoModel, note, callback → depnBookYn) — ast 도메인 조회창은 다음 단계
  const lookupDepnTr = () => {
    if (promoId == null) { message.warning('카드사용내역을 선택해주세요.'); return; }
    message.info('비품대장 등록 창은 다음 단계에서 연결됩니다');
  };

  // [E10] realPersonName[실사용자].TriggerClick (L196) → openLookupPerson() L411-433: 고른 내역이 없으면 "카드사용내역을 선택해주세요."
  //   → Emp00_Lookup_SelectSingle.openPublic(오늘, 공통 단추, 겸직 포함) → [공통]이면 "공통"·ID 비움 / 사원이면 이름·ID
  const openLookupPerson = () => {
    if (promoId == null) { message.warning('카드사용내역을 선택해주세요.'); return; }
    setPersonOpen(true);
  };

  const validate = () => {
    if (!purCode) { message.warning('제공(수령)목적은 필수선택 항목입니다'); return false; }
    if (!contentCode) { message.warning('제공(수령)내역은 필수선택 항목입니다'); return false; }
    return true;
  };

  // [E11] updateButton[저장].Select (L203) → closeCheck() L388-409: 서비스 biz.Biz01_Promo.closeCheck([내역]) → 마감이면 updateNote()(L283-305: 목적·내역 필수 검사 뒤 biz.Biz01_Promo.noteUpdate, 비고만)
  //   / 아니면 update()(L255-281: 필수 검사 뒤 biz.Biz01_Promo.modelUpdate) → callback.execute()
  const save = async () => {
    if (promoId == null) return;
    try {
      const isClosed = await bizPromoApi.hasClosed([promoId]);
      if (!validate()) return;
      if (isClosed) {
        await bizPromoApi.updateNote(promoId, note);
      } else {
        await bizCardManagementApi.update(promoId, {
          providePurCode: purCode ?? null,
          provideContentCode: contentCode ?? null,
          accountCodeId,
          note,
          taxType: taxType ?? null,
          realPersonId,
        });
      }
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const disabled = !promo;
  const lock = disabled || closed;

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #d9d9d9', ...(disabled ? { opacity: 0.6, pointerEvents: 'none' } : {}) }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <FieldRow label={<span style={{ color: BLUE }}>제공목적 </span>} marginTop={30}>
          <SystemCodeComboBox
            kindGroupCd="ProvidePurCode002"
            style={{ width: 300 }}
            placeholder="선택"
            allowClear={false}
            disabled={lock}
            value={purCode}
            onChange={changePurpose}
          />
        </FieldRow>
        {/* [E4] provideContentName[제공내역].Collapse (L132) → 제공내역 코드를 모델에 · [E5] .TriggerClick (L138) → refreshCode() */}
        <FieldRow label={<span style={{ color: BLUE }}>제공내역 </span>}>
          <Select<string>
            style={{ width: 300 }}
            placeholder="선택"
            disabled={lock}
            value={contentCode}
            options={contents.map(c => ({ value: c.code, label: c.name }))}
            onChange={code => setContentCode(code)}
          />
        </FieldRow>
        {/* [E6] accountCode[계정코드].TriggerClick (L145) → openLookupAccount() L339-348: Act01_Lookup_AccountCode.open(callback → setAccount) */}
        <FieldRow label="계정코드 ">
          <Input
            style={{ width: 300 }}
            disabled={lock}
            value={accountCode}
            onChange={e => setAccountCode(e.target.value)}
            onBlur={() => void commitAccountCode()}
            onPressEnter={() => void commitAccountCode()}
            suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => { if (!lock) setAccountOpen({ open: true }); }} />}
          />
        </FieldRow>
        <FieldRow label="계정과목 ">
          <Input style={{ width: 400 }} readOnly disabled={lock} value={accountName} />
        </FieldRow>
        <FieldRow label="비고(사용내역) ">
          <Input.TextArea style={{ width: 400, height: 100, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
        </FieldRow>
        <FieldRow label="비품대장등록 ">
          <LookupInput value={promo?.depnBookYn ?? ''} width={400} disabled={lock} onOpen={lookupDepnTr} />
        </FieldRow>
        {/* [E8] taxTypeName[과세구분].ValueChange (L180) → 과세구분 코드를 모델에 */}
        <FieldRow label={<span style={{ color: BLUE }}>과세구분 </span>}>
          <SystemCodeComboBox
            kindCd="TaxType"
            style={{ width: 300 }}
            placeholder="선택"
            allowClear={false}
            disabled={lock}
            value={taxType}
            onChange={code => setTaxType(code)}
          />
        </FieldRow>
        {realUser && (
          <FieldRow label="실사용자 ">
            <LookupInput value={realPersonName} width={300} onOpen={openLookupPerson} />
          </FieldRow>
        )}
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        <Space>
          <Button type="save" onClick={save}>저장</Button>
          {/* [E12] fileButton[증빙자료(0건)].Select (L211) → Biz05_Lookup_RelateAppr.open("법인카드 증빙자료", promoId, callback → setFileButtonText()) */}
          <Button type="attach" onClick={() => setFileOpen(true)}>{`증빙자료(${fileCount})`}</Button>
        </Space>
      </div>
      <Biz05_Lookup_RelateAppr
        open={fileOpen}
        title="법인카드 증빙자료"
        promoId={promoId}
        onClose={() => { setFileOpen(false); void setFileButtonText(); }}
      />
      <Act01_Lookup_AccountCode
        open={accountOpen.open}
        searchText={accountOpen.text}
        onResult={acc => { setAccountOpen({ open: false }); setAccount(acc); }}
        onClose={() => setAccountOpen({ open: false })}
      />
      <Emp00_Lookup_SelectSingle
        open={personOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        separateAddTitle
        noneLabel="공통"
        onResult={row => {
          setPersonOpen(false);
          if (row == null) { setRealPersonName('공통'); setRealPersonId(null); return; }
          setRealPersonName(row.korNm ?? '');
          setRealPersonId(row.personId);
        }}
        onClose={() => setPersonOpen(false)}
      />
    </div>
  );
};
