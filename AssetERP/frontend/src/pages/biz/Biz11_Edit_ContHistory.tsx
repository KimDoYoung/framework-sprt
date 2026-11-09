/**
 * 계약사 신규 / 변경·추가 / 수정 편집창 (EE20) — Biz10_Tab_ContCorp의 [등록](신규), Biz11_TabPage_ContHistory의 [등록](변경/추가)·수정 칸이 연다
 * AS-IS: myApp/client/vi/biz/Biz11_Edit_ContHistory.java (612줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L167-224: "new corp" = 제목 "계약사 신규"(getSeq → 새 이력 ID·적용일 오늘, 계약상태 코드그룹 ContStatusCode01),
 *   "new" = 제목 "계약사 변경/추가"(getSeq → 새 이력 ID, 적용일·보수정보 ID 비움, 직전 이력의 공유자를 biz.Biz15_Share.insert 로 복사, ContStatusCode02),
 *   "edit" = 제목 "계약사 변경/추가"(ContStatusCode02, 그대로 연다)
 * init() L226-251: 모달 600×785, 아래 가운데 [저장][닫기]. getEditor() L315-433: 라벨 폭 125, 줄 13개(아래 JSX), 공유자/부서 = 행 추가·행 삭제·새로고침 + 그리드
 * 편집창 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, message, Radio, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContCorp, BizContFeeInfo, BizContShare } from '@/types/bizCont';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { EditModal, EditRow, EditField } from '@/components/form/EditForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Org00_Lookup_SelectSingle } from '@/components/lookup/Org00_Lookup_SelectSingle';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Biz12_Edit_FeeInfo, BizFeeEditModel } from './Biz12_Edit_FeeInfo';

const gb = gbFor<BizContShare>();
const SHARE_SELECT = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const fmt = (d: Dayjs | null) => (d ? d.format('YYYY-MM-DD') : null);
const day = (s: string | null | undefined) => (s ? dayjs(s) : null);
/** GXT TextField/TextArea 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

/** 어떻게 열었나 — 'newCorp' = 계약사 신규, 'new' = 변경/추가(고른 계약사), 'edit' = 이력 한 건 수정 */
export type BizContHistoryEditTarget =
  | { kind: 'newCorp' }
  | { kind: 'new'; corp: BizContCorp }
  | { kind: 'edit'; corp: BizContCorp };

interface Props {
  /** 값이 있으면 열린다 */
  target: BizContHistoryEditTarget | null;
  /** callback.execute() L598: 저장한 뒤 (AS-IS 는 그 뒤 hide) */
  onDone: () => void;
  onClose: () => void;
}

export const Biz11_Edit_ContHistory: React.FC<Props> = ({ target, onDone, onClose }) => {
  const user = useLoginUser();
  const [f, setF] = useState<BizContCorp | null>(null);
  /** 새 이력 ID 를 받은 채 보수정보 편집창(Biz12)이 돌려준 보수정보 (feeInfoModel) */
  const [fee, setFee] = useState<BizContFeeInfo | null>(null);
  const [actionStr, setActionStr] = useState('02');
  const [saving, setSaving] = useState(false);
  const [feeEdit, setFeeEdit] = useState<BizFeeEditModel | null>(null);
  const [shares, setShares] = useState<BizContShare[]>([]);
  const [deleteList, setDeleteList] = useState<BizContShare[]>([]);
  const [shareKind, setShareKind] = useState<'emp' | 'org'>('emp');
  const [selectedShare, setSelectedShare] = useState<BizContShare | null>(null);
  const [empOpen, setEmpOpen] = useState<'share' | 'person' | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const [tempId, setTempId] = useState(-1);
  const today = dayjs().format('YYYY-MM-DD');

  // retrieveShare() L476-487: deleteList.clear() → 서비스 biz.Biz15_Share.selectByContHistoryId(companyId, contHistoryId)
  const retrieveShare = async (contHistoryId: number | null | undefined = f?.contHistoryId) => {
    setDeleteList([]);
    if (contHistoryId == null) { setShares([]); return; }
    try {
      setShares(await bizContCorpApi.searchShares(contHistoryId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L167-185) → init() L226-251 (editDriver.edit(updateModel), show(), retrieveShare())
  useEffect(() => {
    setF(null); setFee(null); setShares([]); setDeleteList([]); setShareKind('emp'); setSelectedShare(null);
    if (!target) return;
    let alive = true;
    (async () => {
      try {
        if (target.kind === 'newCorp') {
          const id = await bizContCorpApi.nextId();
          if (!alive) return;
          setActionStr('01');
          setF(blank(user?.companyId ?? 0, id, today));
          await retrieveShare(id);
        } else if (target.kind === 'new') {
          const id = await bizContCorpApi.nextId();
          // 직전 이력의 공유자를 새 이력으로 복사 — biz.Biz15_Share.insert (AS-IS 와 같이 창을 여는 시점에 쓴다)
          await bizContCorpApi.copyShares(target.corp.contCorpId, id);
          if (!alive) return;
          setActionStr('02');
          setF({ ...target.corp, contHistoryId: id, regDate: null, feeInfoId: null });
          await retrieveShare(id);
        } else {
          setActionStr('02');
          setF(target.corp);
          await retrieveShare(target.corp.contHistoryId);
        }
      } catch (err) {
        message.error(errorMessage(err, '열기 실패'));
        onClose();
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const set = <K extends keyof BizContCorp>(k: K, v: BizContCorp[K]) => setF(prev => prev && { ...prev, [k]: v });

  // getDate() L298-313: 계약기간이 99(기한 없음)면 거래종료일을 비우고, 아니면 거래개시일 + (12 × 기간코드)개월 - 1일
  const getDate = (start: string | null, period: string | null) => {
    if (!start || !period) return null;
    if (period === '99') return null;
    const years = parseInt(period, 10);
    if (Number.isNaN(years)) return undefined;
    return dayjs(start).add(12 * years, 'month').subtract(1, 'day').format('YYYY-MM-DD');
  };
  // [E3] contPeriodName[계약기간].ValueChange (L267)·[E4] startDate[거래개시일].ValueChange (L275) → getDate()
  const recalcClose = (start: string | null, period: string | null) => {
    const d = getDate(start, period);
    if (d !== undefined) set('closeDate', d);
  };

  // [E5] insertButton[행 추가].Select (L284) → insertRow() L489-497: 직원이면 openLookupEmpInfo(), 부서면 openLookupOrgInfo()
  const insertRow = () => {
    if (shareKind === 'emp') setEmpOpen('share'); else setOrgOpen(true);
  };
  const addShare = (r: Partial<BizContShare>) => {
    if (!f) return;
    const id = tempId;
    setTempId(id - 1);
    setShares(prev => [...prev, {
      shareId: id, contHistoryId: f.contHistoryId, shareCd: '', personId: null, orgId: null, companyId: f.companyId,
      shareNm: null, personNm: null, orgNm: null, ...r,
    }]);
  };
  // openLookupEmpInfo() L531-555 (Emp00_Lookup_SelectSingle.open(오늘)) / [E11] personName[확인자].TriggerClick (L349)
  const onEmpResult = (emp: TransInfo | null) => {
    const purpose = empOpen;
    setEmpOpen(null);
    if (!emp) return;
    if (purpose === 'person') {
      setF(prev => prev && { ...prev, personNm: emp.korNm ?? null, personId: emp.personId });
    } else {
      addShare({ shareCd: '1', shareNm: '직원', orgId: emp.orgCodeId ?? null, orgNm: emp.parentFullNm ?? null, personId: emp.personId, personNm: emp.korNm ?? null });
    }
  };
  // openLookupOrgInfo() L507-529 (Org00_Lookup_SelectSingle.open(LoginUser.getToday()))
  const onOrgResult = (org: OrgInfo) => {
    setOrgOpen(false);
    addShare({ shareCd: '2', shareNm: '부서', orgId: org.orgCodeId, orgNm: org.parentFullNm ?? null });
  };
  // [E6] deleteButton[행 삭제].Select (L290) → deleteRow() L499-505: 고른 행을 deleteList 에 넣고 그리드에서 뺀다
  const deleteRow = () => {
    if (!selectedShare) return;
    setDeleteList(prev => [...prev, selectedShare]);
    setShares(prev => prev.filter(r => r.shareId !== selectedShare.shareId));
    setSelectedShare(null);
  };

  // [E10] minFeeStr[최저보수].TriggerClick (L335) → new Biz12_Edit_FeeInfo().open(updateModel, cb) L82-120: 결과로 feeInfoModel·minFeeStr 를 바꾼다
  const openFee = () => {
    if (!f) return;
    const cur = fee;
    setFeeEdit({
      contHistoryId: f.contHistoryId,
      feeInfoId: cur?.feeInfoId ?? f.feeInfoId,
      minFeeYn: cur?.minFeeYn ?? f.minFeeYn,
      manageMinFee: cur ? cur.manageMinFee : f.manageMinFee,
      advMinFee: cur ? cur.advMinFee : f.advMinFee,
      discrMinFee: cur ? cur.discrMinFee : f.discrMinFee,
      feeChargeType: cur ? cur.feeChargeType : f.feeChargeType,
      withYn: cur?.withYn ?? f.withYn,
      withFee: cur ? cur.withFee : f.withFee,
    });
  };

  // [E1] updateButton[저장].Select (L255) → update() L576-603: spaceDelete() → 확인자(personName)가 비면 "담당자는 필수입력 항목입니다" → biz.Biz10_ContCorp.insertUpdate → shareUpdate() → callback → hide()
  const update = async () => {
    if (!f) return;
    const contCorpNm = (f.contCorpNm ?? '').trim();
    const manager = (f.manager ?? '').trim();
    const managerTel = (f.managerTel ?? '').trim();
    if (!f.personNm) {
      message.warning('담당자는 필수입력 항목입니다');
      return;
    }
    const feeSrc = fee ?? f;
    setSaving(true);
    try {
      const res = await bizContCorpApi.save({
        contCorpId: target?.kind === 'newCorp' ? null : f.contCorpId,
        history: {
          contHistoryId: f.contHistoryId, regDate: f.regDate, contCorpNm: n(contCorpNm), contStatusCd: n(f.contStatusCd), corpStatusCd: n(f.corpStatusCd),
          trType: n(f.trType), contPeriodCd: n(f.contPeriodCd), contDate: f.contDate, startDate: f.startDate, closeDate: f.closeDate, baseFee: n(f.baseFee),
          manager: n(manager), managerTel: n(managerTel), note: n(f.note), personId: f.personId, address: n(f.address), ceo: n(f.ceo),
        },
        fee: {
          feeInfoId: fee?.feeInfoId ?? f.feeInfoId, minFeeYn: feeSrc.minFeeYn, manageMinFee: feeSrc.manageMinFee, advMinFee: feeSrc.advMinFee,
          discrMinFee: feeSrc.discrMinFee, feeChargeType: feeSrc.feeChargeType, withYn: feeSrc.withYn, withFee: feeSrc.withFee,
        },
      });
      // shareUpdate() L557-568: 새 행은 biz.Biz15_Share.update, 지운 행은 biz.Biz15_Share.delete
      const adds = shares.filter(r => r.shareId < 0).map(r => ({ contHistoryId: res.contHistoryId, shareCd: r.shareCd, personId: r.personId, orgId: r.orgId }));
      const deleteIds = deleteList.filter(r => r.shareId > 0).map(r => r.shareId);
      if (adds.length > 0 || deleteIds.length > 0) await bizContCorpApi.saveShares(adds, deleteIds);
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // shareGrid() L467-474
  const columnDefs = useMemo(() => [
    gb.textCenter('shareNm', 50, '구분'),  // L469
    gb.text('orgNm', 160, '부서'),  // L470
    gb.textCenter('personNm', 80, '성명'),  // L471
  ], []);

  const minFeeStr = fee ? fee.minFeeStr : f?.minFeeStr;

  return (
    <>
      <EditModal
        open={target != null && f != null}
        title={target?.kind === 'newCorp' ? '계약사 신규' : '계약사 변경/추가'}
        width={620}
        style={{ top: 20 }}
        onCancel={onClose}
        destroyOnHidden
        styles={{
          body: { maxHeight: 'calc(100vh - 190px)', overflowY: 'auto' },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update} loading={saving}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L261) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        {f && (
          <>
            <EditRow>
              <EditField labelWidth={120} width={286} label="적용일"><DatePicker style={{ width: '100%' }} value={day(f.regDate)} onChange={d => set('regDate', fmt(d))} /></EditField>
              <EditField labelWidth={120} width={286} label="계약상태">
                {/* [E7] contStatusName[계약상태].Collapse (L316) → contStatusCode = contStatusName.getCode() (코드그룹 ContStatusCode{01|02}) */}
                <SystemCodeComboBox kindGroupCd={`ContStatusCode${actionStr}`} style={{ width: '100%' }} value={f.contStatusCd ?? undefined}
                  onChange={(c, nm) => setF(prev => prev && { ...prev, contStatusCd: c ?? null, contStatusNm: nm ?? null })} />
              </EditField>
            </EditRow>
            <EditField labelWidth={120} label="계약사"><Input value={f.contCorpNm ?? ''} onChange={e => set('contCorpNm', e.target.value)} /></EditField>
            <EditRow>
              <EditField labelWidth={120} width={286} label="계약사 거래유무">
                {/* [E8] corpStatusName[계약사 거래유무].Collapse (L322) → corpStatusCode */}
                <SystemCodeComboBox kindCd="ContCorpStatusCode" style={{ width: '100%' }} value={f.corpStatusCd ?? undefined}
                  onChange={(c, nm) => setF(prev => prev && { ...prev, corpStatusCd: c ?? null, corpStatusNm: nm ?? null })} />
              </EditField>
              <EditField labelWidth={120} width={286} label="계약기간">
                {/* [E9] contPeriodName[계약기간].Collapse (L328) → contPeriodCode · [E3] ValueChange → startDate 가 있으면 getDate() */}
                <SystemCodeComboBox kindCd="ContPeriodCode" style={{ width: '100%' }} value={f.contPeriodCd ?? undefined}
                  onChange={(c, nm) => {
                    setF(prev => prev && { ...prev, contPeriodCd: c ?? null, contPeriodNm: nm ?? null });
                    if (f.startDate) recalcClose(f.startDate, c ?? null);
                  }} />
              </EditField>
            </EditRow>
            <EditRow>
              <EditField labelWidth={120} width={286} label="거래형태"><Input value={f.trType ?? ''} onChange={e => set('trType', e.target.value)} /></EditField>
              <EditField labelWidth={120} width={286} label="거래개시일">
                <DatePicker style={{ width: '100%' }} value={day(f.startDate)}
                  onChange={d => { set('startDate', fmt(d)); if (f.contPeriodCd) recalcClose(fmt(d), f.contPeriodCd); }} />
              </EditField>
            </EditRow>
            <EditRow>
              <EditField labelWidth={120} width={286} label="(재)계약일"><DatePicker style={{ width: '100%' }} value={day(f.contDate)} onChange={d => set('contDate', fmt(d))} /></EditField>
              <EditField labelWidth={120} width={286} label="거래종료일"><DatePicker style={{ width: '100%' }} value={day(f.closeDate)} onChange={d => set('closeDate', fmt(d))} /></EditField>
            </EditRow>
            <EditField labelWidth={120} label="최저보수">
              <LookupInput value={minFeeStr ?? ''} placeholder="" width={380} empty={['']} onOpen={openFee} />
            </EditField>
            <EditRow>
              <EditField labelWidth={120} width={286} label="기본보수(bp)"><Input value={f.baseFee ?? ''} onChange={e => set('baseFee', e.target.value)} /></EditField>
            </EditRow>
            <EditRow>
              <EditField labelWidth={120} width={286} label="계약사 담당자"><Input value={f.manager ?? ''} onChange={e => set('manager', e.target.value)} /></EditField>
              <EditField labelWidth={120} width={286} label="연락처"><Input value={f.managerTel ?? ''} onChange={e => set('managerTel', e.target.value)} /></EditField>
            </EditRow>
            <EditRow>
              <EditField labelWidth={120} width={286} label="대표이사"><Input value={f.ceo ?? ''} onChange={e => set('ceo', e.target.value)} /></EditField>
            </EditRow>
            <EditField labelWidth={120} label="주소"><Input value={f.address ?? ''} onChange={e => set('address', e.target.value)} /></EditField>
            <EditField labelWidth={120} label="비고"><Input.TextArea rows={2} value={f.note ?? ''} onChange={e => set('note', e.target.value)} /></EditField>
            <EditRow>
              <EditField labelWidth={120} width={286} label="확인자">
                <LookupInput value={f.personNm ?? ''} placeholder="" width={200} empty={['']} onOpen={() => setEmpOpen('person')} />
              </EditField>
            </EditRow>
            <EditField labelWidth={120} label="공유자/부서">
              <div style={{ border: '1px solid #d9d9d9', display: 'flex', flexDirection: 'column', height: 205, boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px' }}>
                  <Radio.Group value={shareKind} onChange={e => setShareKind(e.target.value)}>
                    <Radio value="emp">직원</Radio>
                    <Radio value="org">부서</Radio>
                  </Radio.Group>
                  <Button type="addRow" onClick={insertRow}>행 추가</Button>
                  <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
                  {/* [E12] anchor.MouseDown (L444) → retrieveShare() */}
                  <ReloadOutlined style={{ cursor: 'pointer', fontSize: 15 }} title="새로고침" onMouseDown={() => void retrieveShare()} />
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <SingleGrid<BizContShare>
                    rowData={shares}
                    columnDefs={columnDefs}
                    getRowId={p => String(p.data.shareId)}
                    rowSelection={SHARE_SELECT}
                    onRowClicked={e => setSelectedShare(e.data ?? null)}
                  />
                </div>
              </div>
            </EditField>
          </>
        )}
      </EditModal>
      <Biz12_Edit_FeeInfo model={feeEdit} onResult={r => setFee(r)} onClose={() => setFeeEdit(null)} />
      <Emp00_Lookup_SelectSingle open={empOpen != null} noneLabel={null} transDate={today} onResult={onEmpResult} onClose={() => setEmpOpen(null)} />
      <Org00_Lookup_SelectSingle baseDate={orgOpen ? today : undefined} onSelect={onOrgResult} onClose={() => setOrgOpen(false)} />
    </>
  );
};

/** new Biz10_ContCorpModel() — 회사·새 이력 ID·적용일만 채워져 있다 */
function blank(companyId: number, contHistoryId: number, regDate: string): BizContCorp {
  return {
    contCorpId: 0, companyId, contHistoryId, regDate, contCorpNm: null, contStatusCd: null, contStatusNm: null, corpStatusCd: null, corpStatusNm: null,
    trType: null, contPeriodCd: null, contPeriodNm: null, contDate: null, startDate: null, closeDate: null, baseFee: null, manager: null, managerTel: null,
    note: null, personId: null, personNm: null, address: null, ceo: null, feeInfoId: null, minFeeYn: null, manageMinFee: null, advMinFee: null,
    discrMinFee: null, feeChargeType: null, feeChargeTypeNm: null, withYn: null, withFee: null, minFeeStr: null, withFeeStr: null,
  };
}
