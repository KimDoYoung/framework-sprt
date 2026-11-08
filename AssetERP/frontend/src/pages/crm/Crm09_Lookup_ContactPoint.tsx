/**
 * 영업거래처 추가·수정 창 (EE84) — AS-IS는 Crm09_Tab_ContactPoint·Crm09_Lookup_Select(Multi)가 연다 (TOBE는 CRM 화면이 없어 연결 안 함)
 * AS-IS: myApp/client/vi/crm/Crm09_Lookup_ContactPoint.java (315줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * [설정] = Crm14_Lookup_ShareDefault(EE86)
 * 생성자 L140-181: 950×530 모달 "영업거래처추가", 폼 + [저장][닫기]. getEditor() L193-243:
 *   영업구분(콤보 CrmItemTypeCode) / 회사명 300·담당자명 200·직위 200·부서 200 / 이메일 300·직책 200·회사전화 200·휴대폰 200 / 주요사항 100 / 비고 100 / 공유기본(읽기 전용 500)+[설정]
 * openEdit L73 = 기존 거래처 수정, openNew L84 = 새 거래처, open(contactModel) L122 = 영업구분·회사명·공유정보를 미리 채워 새로 등록
 * postOpen() L183-191: 번호가 없으면(새 거래처) 공유기본·[설정]을 숨긴다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { crmContactApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { CrmContactDetail } from '@/types/crm';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Crm14_Lookup_ShareDefault } from './Crm14_Lookup_ShareDefault';

const LABEL: React.CSSProperties = { width: 80, flex: 'none', textAlign: 'right', paddingRight: 10, fontSize: 12 };
const REQ: React.CSSProperties = { ...LABEL, color: '#0069B4', fontWeight: 'bold' };

interface FormValue {
  contactId: number | null;
  itemTypeCode: string | null;
  contactName: string;
  contactEmpName: string;
  contactPos: string;
  contactOrgName: string;
  contactEmailAddr: string;
  contactTitle: string;
  contactTelNo: string;
  contactMobileNo: string;
  majorIssues: string;
  note: string;
  shareInfo: string;
}

const EMPTY: FormValue = {
  contactId: null, itemTypeCode: null, contactName: '', contactEmpName: '', contactPos: '', contactOrgName: '', contactEmailAddr: '',
  contactTitle: '', contactTelNo: '', contactMobileNo: '', majorIssues: '', note: '', shareInfo: '',
};

const fromDetail = (d: CrmContactDetail): FormValue => ({
  contactId: d.contactId, itemTypeCode: d.itemTypeCode, contactName: d.contactName ?? '', contactEmpName: d.contactEmpName ?? '',
  contactPos: d.contactPos ?? '', contactOrgName: d.contactOrgName ?? '', contactEmailAddr: d.contactEmailAddr ?? '',
  contactTitle: d.contactTitle ?? '', contactTelNo: d.contactTelNo ?? '', contactMobileNo: d.contactMobileNo ?? '',
  majorIssues: d.majorIssues ?? '', note: d.note ?? '', shareInfo: d.shareInfo ?? '',
});

interface Props {
  open: boolean;
  /** 있으면 openEdit(그 거래처를 읽어 고친다), 없으면 openNew(새 거래처) */
  contactId?: number | null;
  /** open(contactModel) L122-138 — 새 거래처의 영업구분·회사명을 미리 채운다 */
  preset?: { itemTypeCode?: string | null; contactName?: string | null };
  /** 저장 성공(L274-279) — 저장한 한 건. 부른 쪽이 목록을 고치거나 다시 읽는다 */
  onSaved: (row: CrmContactDetail) => void;
  onClose: () => void;
}

export const Crm09_Lookup_ContactPoint: React.FC<Props> = ({ open, contactId, preset, onSaved, onClose }) => {
  const [form, setForm] = useState<FormValue>(EMPTY);
  const [ready, setReady] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const set = (p: Partial<FormValue>) => setForm(f => ({ ...f, ...p }));

  // [E0] 화면 열림 (생성자 L140-181, openEdit/openNew/open)
  useEffect(() => {
    if (!open) { setReady(false); return; }
    if (contactId == null) {
      setForm({ ...EMPTY, itemTypeCode: preset?.itemTypeCode ?? null, contactName: preset?.contactName ?? '' });
      setReady(true);
      return;
    }
    crmContactApi.get(contactId)
      .then(d => { setForm(fromDetail(d)); setReady(true); })
      .catch(err => { message.error(errorMessage(err, '조회 실패')); onClose(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, contactId]);

  // [E1] updateButton[저장].Select (L160) → updateRow() L245-281
  const updateRow = async () => {
    if (!form.itemTypeCode) { message.warning('영업구분이 올바르지 않습니다'); return; }
    const contactName = form.contactName.trim();
    if (!contactName) { message.warning('회사명은 필수입력 항목입니다'); return; }
    const contactEmpName = form.contactEmpName.trim();
    if (!contactEmpName) { message.warning('담당자명 필수입력 항목입니다'); return; }
    try {
      const saved = await crmContactApi.save({
        contactId: form.contactId, contactName, itemTypeCode: form.itemTypeCode, contactEmpName,
        contactOrgName: form.contactOrgName || null, contactTitle: form.contactTitle || null, contactPos: form.contactPos || null,
        contactTelNo: form.contactTelNo || null, contactMobileNo: form.contactMobileNo || null, contactEmailAddr: form.contactEmailAddr || null,
        majorIssues: form.majorIssues || null, note: form.note || null,
      });
      onSaved(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] shareButton[설정].Select (L175) → lookupShare() L283-293: Crm14_Lookup_ShareDefault.open(contactId, 결과 문자열 → shareInfo)
  const lookupShare = () => setShareOpen(true);

  const hasId = form.contactId != null;
  const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 5 };

  return (
    <LookupModal
      open={open && ready}
      title="영업거래처추가"
      width={950}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={updateRow}>저장</Button>
            {/* [E2] cancleButton[닫기].Select [grid != null && newYn] (L166) → (새 행이면 그리드에서 뺀다) hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
        <div style={row}>
          <span style={REQ}>영업구분</span>
          <SystemCodeComboBox kindCd="CrmItemTypeCode" style={{ width: 500 }} value={form.itemTypeCode ?? undefined} onChange={c => set({ itemTypeCode: c ?? null })} />
        </div>
        <div style={row}>
          <span style={REQ}>회사명</span>
          <Input style={{ width: 300 }} value={form.contactName} onChange={e => set({ contactName: e.target.value })} />
          <span style={REQ}>담당자명</span>
          <Input style={{ width: 200 }} value={form.contactEmpName} onChange={e => set({ contactEmpName: e.target.value })} />
          <span style={LABEL}>직위</span>
          <Input style={{ width: 200 }} value={form.contactPos} onChange={e => set({ contactPos: e.target.value })} />
          <span style={LABEL}>부서</span>
          <Input style={{ width: 200 }} value={form.contactOrgName} onChange={e => set({ contactOrgName: e.target.value })} />
        </div>
        <div style={row}>
          <span style={LABEL}>이메일</span>
          <Input style={{ width: 300 }} value={form.contactEmailAddr} onChange={e => set({ contactEmailAddr: e.target.value })} />
          <span style={LABEL}>직책</span>
          <Input style={{ width: 200 }} value={form.contactTitle} onChange={e => set({ contactTitle: e.target.value })} />
          <span style={LABEL}>회사전화</span>
          <Input style={{ width: 200 }} value={form.contactTelNo} onChange={e => set({ contactTelNo: e.target.value })} />
          <span style={LABEL}>휴대폰</span>
          <Input style={{ width: 200 }} value={form.contactMobileNo} onChange={e => set({ contactMobileNo: e.target.value })} />
        </div>
        <div style={{ display: 'flex' }}>
          <span style={LABEL}>주요사항</span>
          <Input.TextArea style={{ height: 100, resize: 'none' }} value={form.majorIssues} onChange={e => set({ majorIssues: e.target.value })} />
        </div>
        <div style={{ display: 'flex' }}>
          <span style={LABEL}>비고</span>
          <Input.TextArea style={{ height: 100, resize: 'none' }} value={form.note} onChange={e => set({ note: e.target.value })} />
        </div>
        {/* postOpen() L183-191 — 번호가 없으면 비활성·[설정] 숨김 */}
        <div style={row}>
          <span style={LABEL}>공유기본</span>
          <Input readOnly disabled={!hasId} style={{ width: 500 }} value={form.shareInfo} />
          {hasId && <Button type="register" onClick={lookupShare}>설정</Button>}
        </div>
        <div style={{ marginLeft: 100, color: '#888', fontSize: 12 }}>
          (업무활동내역 생성시 공유기본 설정에 따라 공유정보가 기본값으로 초기 등록됩니다.)
        </div>
      </div>
      <Crm14_Lookup_ShareDefault contactId={shareOpen ? form.contactId : null} onResult={info => set({ shareInfo: info })} onClose={() => setShareOpen(false)} />
    </LookupModal>
  );
};
