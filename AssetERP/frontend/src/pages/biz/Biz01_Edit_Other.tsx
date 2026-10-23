/**
 * 이익제공(수령) 내용 편집 — 현금·물품 (L03) — Biz01_Tab_Other 오른쪽 위(높이 350)
 * AS-IS: myApp/client/vi/biz/Biz01_Edit_Other.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L73-82·getEditor L201-216: 헤더 없음, 폼(라벨 110) = 제공(수령)구분(300)·일자(300)·목적(300)·내역(300)·경제적 가치(300, ###,###,###) — 파란 라벨 —
 *   · 비고(400×100, 여러 줄), 창 아래 가운데 [저장][증빙자료(n건)]. 고른 내역이 없으면 통째로 비활성(setEnabled(false))
 * 마감 검사는 없다(원본에 없음). 새 행(아직 서버에 없는 행, promoId ≤ 0)은 [저장]이 등록(INSERT)이고 증빙자료·직원 자동등록은 내역 번호가 필요해 쓰지 않는다.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Select, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { actApi } from '@/api/act';
import { bizPersonApi, bizPromoApi, bizRelateApprApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { ActCodeOption } from '@/types/act';
import { BizCodeOption, BizPromoOther } from '@/types/biz';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Biz05_Lookup_RelateAppr } from './Biz05_Lookup_RelateAppr';

const BLUE = '#0069B4';

interface Props {
  /** editModel2(selectModel, …) — 고른 내역. 없으면 setEnabled(false) */
  promo: BizPromoOther | null;
  /** callback.execute() — 본 화면 조회 */
  onSaved: () => void;
  /** insertEmp() 뒤 personList.retrieve(promoModel) — 인원 목록을 다시 읽게 한다 */
  onEmpAdded: () => void;
}

const FieldRow: React.FC<{ label: React.ReactNode; marginTop?: number; marginBottom?: number; children: React.ReactNode }> = ({ label, marginTop = 5, marginBottom = 5, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', margin: `${marginTop}px 10px ${marginBottom}px 15px` }}>
    <div style={{ width: 110, flex: 'none', paddingTop: 5 }}>{label}</div>
    {children}
  </div>
);

export const Biz01_Edit_Other: React.FC<Props> = ({ promo, onSaved, onEmpAdded }) => {
  const [rcv, setRcv] = useState<string | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [pur, setPur] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [amt, setAmt] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [purposes, setPurposes] = useState<BizCodeOption[]>([]);
  const [contents, setContents] = useState<ActCodeOption[]>([]);
  const [fileCount, setFileCount] = useState('0건');
  const [fileOpen, setFileOpen] = useState(false);
  // 늦게 온 응답이 새 선택을 덮지 않게 한다
  const seq = useRef(0);
  const promoId = promo?.promoId ?? null;
  const saved = promoId != null && promoId > 0;

  // setFileButtonText() L302-314: 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) → "증빙자료(n건)"
  const setFileButtonText = useCallback(async () => {
    if (!saved) {
      setFileCount('0건');
      return;
    }
    try {
      setFileCount(await bizRelateApprApi.getFileCount(promoId as number));
    } catch (err) {
      message.error(errorMessage(err, '증빙자료 건수 조회 실패'));
    }
  }, [promoId, saved]);

  // [E0] 화면 열림 (생성자 L73-82) → setting(), getEditor()
  // editModel2() L92-99: editDriver.edit(promoModel), setFileButtonText().
  //   (원본에는 목록을 미리 읽는 setComboBox가 없다 — 고른 값의 이름이 보이고 목록을 바로 고를 수 있게 목적·내역 목록을 함께 읽는다)
  useEffect(() => {
    const my = ++seq.current;
    if (!promo) {
      setRcv(null); setDate(null); setPur(null); setContent(null); setAmt(null); setNote('');
      setPurposes([]); setContents([]); setFileCount('0건');
      return;
    }
    setRcv(promo.provideRcvType);
    setDate(promo.provideDate ? dayjs(promo.provideDate) : null);
    setPur(promo.providePurCode);
    setContent(promo.provideContentCode);
    setAmt(promo.provideAmt);
    setNote(promo.note ?? '');
    setPurposes([]);
    setContents([]);
    void setFileButtonText();
    (async () => {
      try {
        const ps = promo.provideRcvType ? await bizPromoApi.searchProvidePurposes(promo.provideRcvType) : [];
        const cs = promo.providePurCode ? await actApi.searchProvideContents(promo.providePurCode) : [];
        if (my === seq.current) { setPurposes(ps); setContents(cs); }
      } catch (err) {
        message.error(errorMessage(err, '코드 조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promo]);

  // [E3] provideRcvTypeName[ProvideRcvType].Collapse [값 바뀜] (L130) → 목적·내역을 비우고 서비스 sys.Sys09_Code.selectByKindCode(ProvidePurCode, 구분코드%)
  const changeRcv = async (code: string | undefined) => {
    const my = ++seq.current;
    setRcv(code ?? null);
    setPur(null); setContent(null);
    setPurposes([]); setContents([]);
    if (!code) return;
    try {
      const ps = await bizPromoApi.searchProvidePurposes(code);
      if (my === seq.current) setPurposes(ps);
    } catch (err) {
      message.error(errorMessage(err, '코드 조회 실패'));
    }
  };

  // [E4] providePurName[sys.Sys09_Code.selectByKindCode].Collapse [값 바뀜] (L156) → 내역을 비우고 서비스 sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%)
  const changePur = async (code: string | undefined) => {
    const my = ++seq.current;
    setPur(code ?? null);
    setContent(null);
    setContents([]);
    if (!code) return;
    try {
      const cs = await actApi.searchProvideContents(code);
      if (my === seq.current) setContents(cs);
    } catch (err) {
      message.error(errorMessage(err, '코드 조회 실패'));
    }
  };

  // [E5] provideContentName[sys.Sys09_Code.selectByKindCode].Collapse [값 바뀜] (L181) → insertEmp() L253-280: 서비스 biz.Biz04_ProvideSetup.selectByProvideContentCode
  //   → 자동등록이면 biz.Biz02_Person.insertEmpId(로그인 사원) → 인원 목록 다시 읽기 (새 행은 내역 번호가 없어 쓰지 않는다)
  const changeContent = async (code: string | undefined) => {
    setContent(code ?? null);
    if (!code || !saved) return;
    try {
      if (await bizPersonApi.getEmpSet(code)) {
        await bizPersonApi.autoRegister([promoId as number]);
        onEmpAdded();
      }
    } catch (err) {
      message.error(errorMessage(err, '직원 자동등록 여부 가져오기 실패 - 관리자에게 문의하세요'));
    }
  };

  // update() L218-251의 필수 안내
  const validate = () => {
    if (!rcv) { message.warning('제공(수령)구분은 필수선택 항목입니다'); return false; }
    if (!date) { message.warning('제공(수령)일자은 필수선택 항목입니다'); return false; }
    if (!pur) { message.warning('제공(수령)목적은 필수선택 항목입니다'); return false; }
    if (!content) { message.warning('제공(수령)내역은 필수선택 항목입니다'); return false; }
    if (amt == null) { message.warning('경제적 가치는 필수입력 항목입니다'); return false; }
    return true;
  };

  // [E1] updateButton[저장].Select (L102) → update() L218-251: 필수 안내 → 서비스 biz.Biz01_Promo.modelUpdate(새 행이면 INSERT) → callback.execute()
  const save = async () => {
    if (promoId == null || !validate()) return;
    const req = {
      provideRcvType: rcv,
      provideDate: (date as Dayjs).format('YYYY-MM-DD'),
      providePurCode: pur,
      provideContentCode: content,
      provideAmt: amt,
      note: note === '' ? null : note,
    };
    try {
      if (saved) await bizPromoApi.updateOther(promoId, req);
      else await bizPromoApi.createOther(req);
      onSaved();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const disabled = !promo;

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #d9d9d9', ...(disabled ? { opacity: 0.6, pointerEvents: 'none' } : {}) }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <FieldRow label={<span style={{ color: BLUE }}>제공(수령)구분 </span>} marginTop={30}>
          <SystemCodeComboBox
            kindCd="ProvideRcvType"
            style={{ width: 300 }}
            placeholder="선택"
            allowClear={false}
            value={rcv ?? undefined}
            onChange={code => { void changeRcv(code); }}
          />
        </FieldRow>
        <FieldRow label={<span style={{ color: BLUE }}>제공(수령)일자 </span>}>
          <DatePicker style={{ width: 300 }} value={date} onChange={d => setDate(d)} />
        </FieldRow>
        <FieldRow label={<span style={{ color: BLUE }}>제공(수령)목적 </span>}>
          <Select<string>
            style={{ width: 300 }}
            placeholder="선택"
            value={pur ?? undefined}
            options={purposes.map(p => ({ value: p.code, label: p.name }))}
            onChange={code => { void changePur(code); }}
          />
        </FieldRow>
        <FieldRow label={<span style={{ color: BLUE }}>제공(수령)내역 </span>}>
          <Select<string>
            style={{ width: 300 }}
            placeholder="선택"
            value={content ?? undefined}
            options={contents.map(c => ({ value: c.code, label: c.name }))}
            onChange={code => { void changeContent(code); }}
          />
        </FieldRow>
        <FieldRow label={<span style={{ color: BLUE }}>경제적 가치 </span>}>
          <InputNumber<number>
            style={{ width: 300 }}
            precision={0}
            value={amt}
            formatter={v => (v == null ? '' : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','))}
            parser={v => Number((v ?? '').replace(/,/g, ''))}
            onChange={v => setAmt(v)}
          />
        </FieldRow>
        <FieldRow label="비고 " marginBottom={30}>
          <Input.TextArea style={{ width: 400, height: 100, resize: 'none' }} value={note} onChange={e => setNote(e.target.value)} />
        </FieldRow>
      </div>
      <div style={{ textAlign: 'center', padding: 8 }}>
        <Space>
          <Button type="save" onClick={save}>저장</Button>
          {/* [E2] fileButton[증빙자료(0건)].Select (L108) → Biz05_Lookup_RelateAppr.open("법인카드 증빙자료", promoId, callback → setFileButtonText()) */}
          <Button type="attach" disabled={!saved} onClick={() => setFileOpen(true)}>{`증빙자료(${fileCount})`}</Button>
        </Space>
      </div>
      <Biz05_Lookup_RelateAppr
        open={fileOpen}
        title="법인카드 증빙자료"
        promoId={saved ? promoId : null}
        onClose={() => { setFileOpen(false); void setFileButtonText(); }}
      />
    </div>
  );
};
