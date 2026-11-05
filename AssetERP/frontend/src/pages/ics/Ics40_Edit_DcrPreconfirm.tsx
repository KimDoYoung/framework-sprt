/**
 * 준법감시인 사전확인 신청창 — 상신내역 조회 #1019(Apr01_Tab_MyRequestList)의 [신청] 아이콘이 연다 (13-누락대장 4-1, 2026-11-05)
 * AS-IS: myApp/client/vi/ics/Ics40_Edit_DcrPreconfirm.java (433줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L89-107: 모달 560×730 "신청"(닫기 X 없음, 크기 고정), 버튼 줄 가운데 [신청][신청취소]  [저장][삭제][닫기]
 * getEditor L260-331: 라벨 130(필수 두 칸은 파란 라벨) — 대장분류 · 내용(100 높이) · 제공처 · 심사필번호(읽기 전용)
 *   · "* 광고물인 경우 추가정보 입력" + 구분선 · 광고종류 · 매체종류 · 광고상품명 · 광고내용 · 최초/최종사용예정일(한 줄 둘) · 규격 · 수량/회수 · 과거심사필번호(조회창)
 * 열기: insert(apprId, callback) L109-121 = 새 신청(회사·오늘·로그인 사원·상신 문서) / edit(model, callback) L123-141 = 기존 신청
 *   edit: 상태 10·20·80이면 [저장][삭제] 비활성, 준감인 의견이 있으면 [삭제] 비활성
 * 서버: PUT /api/v1/ics/dcr-preconfirms (modelUpdate + 회사 설정 dcrPreconfirmSkipYn이면 updateByStatus01), DELETE /api/v1/ics/dcr-preconfirms/{id} (delete)
 * AS-IS와 다른 점: 원본은 PASS(80)일 때 modelUpdate 뒤 updateByStatus01을 따로 부른다 — TOBE는 서버 한 번(한 트랜잭션). 80 판정도 서버가 한다.
 * 버튼 "신청"은 button-types.md `register`(2026-11-05 등록).
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { IcsDcrPreconfirm, IcsDcrTypeOption } from '@/types/ics';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Ics40_Lookup_SelectSingle } from './Ics40_Lookup_SelectSingle';

export type Ics40_Edit_DcrPreconfirmTarget =
  | { mode: 'insert'; apprId: number }
  | { mode: 'edit'; row: IcsDcrPreconfirm };

interface Props {
  target: Ics40_Edit_DcrPreconfirmTarget | null;
  /** AS-IS callback.execute() — 신청·심사필번호 부여·삭제·닫기 뒤 부르는 쪽이 다시 읽는다 */
  onCallback: () => void;
  onClose: () => void;
}

/** 편집 대상 값 (AS-IS editDriver가 묶는 칸) */
interface Form {
  dcrPreconfirmId: number | null;
  apprId: number | null;
  statusCode: string | null;
  confirmMsg: string | null;
  apprNo: string;
  dcrTypeCode: string | null;
  content: string;
  provideCo: string;
  adType: string | null;
  mediaType: string | null;
  adItemName: string;
  adContent: string;
  startDate: string | null;
  closeDate: string | null;
  spec: string;
  qtyCnt: string;
  preApprNo: string;
}

const FMT = 'YYYY-MM-DD';
const LABEL_W = 130;   // form.setLabelWidth(130)
const FIELD_W = 500;   // HorizontalLayoutData(500, …) — 라벨 포함
const REQUIRED = '#0069B4';  // setHtmlStyle(…, "0069B4")

const toForm = (t: Ics40_Edit_DcrPreconfirmTarget): Form => {
  if (t.mode === 'insert') {
    return {
      dcrPreconfirmId: null, apprId: t.apprId, statusCode: null, confirmMsg: null, apprNo: '',
      dcrTypeCode: null, content: '', provideCo: '', adType: null, mediaType: null, adItemName: '', adContent: '',
      startDate: null, closeDate: null, spec: '', qtyCnt: '', preApprNo: '',
    };
  }
  const r = t.row;
  return {
    dcrPreconfirmId: r.dcrPreconfirmId, apprId: r.apprId, statusCode: r.statusCode, confirmMsg: r.confirmMsg, apprNo: r.apprNo ?? '',
    dcrTypeCode: r.dcrTypeCode, content: r.content ?? '', provideCo: r.provideCo ?? '', adType: r.adType, mediaType: r.mediaType,
    adItemName: r.adItemName ?? '', adContent: r.adContent ?? '', startDate: r.startDate, closeDate: r.closeDate,
    spec: r.spec ?? '', qtyCnt: r.qtyCnt ?? '', preApprNo: r.preApprNo ?? '',
  };
};

const nul = (s: string) => (s === '' ? null : s);

const Row: React.FC<{ label: string; required?: boolean; width?: number; children: React.ReactNode; top?: boolean }> = ({ label, required, width = FIELD_W, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', width }}>
    <div style={{ width: LABEL_W, flex: 'none', textAlign: 'right', paddingRight: 10, paddingTop: top ? 4 : 0, color: required ? REQUIRED : undefined, fontWeight: required ? 'bold' : undefined }}>{label}</div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Ics40_Edit_DcrPreconfirm: React.FC<Props> = ({ target, onCallback, onClose }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [typeOptions, setTypeOptions] = useState<IcsDcrTypeOption[]>([]);
  const [updateDisabled, setUpdateDisabled] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L89-107 → settings() L143-258, insert L109-121 / edit L123-141)
  useEffect(() => {
    if (!target) { setForm(null); return; }
    const f = toForm(target);
    setForm(f);
    // edit L131-140: 상태 10·20·80이면 [저장][삭제] 비활성, 준감인 의견이 있으면 [삭제] 비활성
    const locked = target.mode === 'edit' && ['10', '20', '80'].includes(f.statusCode ?? '');
    setUpdateDisabled(locked);
    setDeleteDisabled(locked || (target.mode === 'edit' && f.confirmMsg != null));
    // dcrTypeName = CommonComboBoxField("sys.Sys00_Common.selectIcs41DcrType", companyId) L159-162
    icsApi.getDcrTypeOptions().then(setTypeOptions).catch(err => message.error(errorMessage(err, '대장분류 조회 실패')));
  }, [target]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm(prev => (prev ? { ...prev, [k]: v } : prev));

  // update(applyYn) L333-381 → ics.Ics40_DcrPreconfirm.modelUpdate (+ 회사 설정 PASS면 updateByStatus01 L383-397)
  const update = async (applyYn: boolean, statusCode: string | null) => {
    if (!form) return;
    if (form.dcrTypeCode == null) { message.warning('대장분류는 필수선택 항목입니다'); return; }
    if (form.content === '') { message.warning('내용은 필수입력 항목입니다'); return; }
    try {
      const saved = await icsApi.saveDcrPreconfirm({
        dcrPreconfirmId: form.dcrPreconfirmId, apprId: form.apprId, dcrTypeCode: form.dcrTypeCode, content: form.content,
        provideCo: nul(form.provideCo), adType: form.adType, mediaType: form.mediaType, adItemName: nul(form.adItemName),
        adContent: nul(form.adContent), startDate: form.startDate, closeDate: form.closeDate, spec: nul(form.spec),
        qtyCnt: nul(form.qtyCnt), preApprNo: nul(form.preApprNo), applyYn, statusCode,
      });
      setForm(toForm({ mode: 'edit', row: saved }));  // editDriver.edit(dcrPreconfirmModel)
      if (!applyYn) {
        message.success('저장이 완료되었습니다');
      } else if (saved.statusCode === '80') {
        message.success('심사필번호가 부여되었습니다');  // updateByStatus01 → callback, hide
        onCallback();
        onClose();
      } else if (statusCode === '10') {
        message.success('신청이 완료되었습니다');
        onCallback();
        onClose();
      } else {
        message.success('신청취소가 완료되었습니다');
        setUpdateDisabled(false);
        setDeleteDisabled(false);
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] applyButton[신청].Select (L180) → update(true) — 10이면 "이미 신청한 내용입니다", 20이면 "승인완료된 내역입니다"
  const apply = () => {
    if (!form) return;
    if (form.statusCode === '10') { message.warning('이미 신청한 내용입니다'); return; }
    if (form.statusCode === '20') { message.warning('승인완료된 내역입니다'); return; }
    return update(true, '10');
  };

  // [E5] cancelButton[신청취소].Select (L195) → update(true) 상태 null — 10일 때만
  const cancel = () => {
    if (!form) return;
    if (form.statusCode === '10') return update(true, null);
    if (form.statusCode === '20') message.warning('승인완료된 내역입니다');
    else if (form.confirmMsg != null) message.warning('준감의견이 존재하는 내역은 취소가 불가능합니다');
    else message.warning('신청 전 내역입니다');
  };

  // delete() L399-420 — 저장 전(키 없음)이면 창만 닫는다, 아니면 ics.Ics40_DcrPreconfirm.delete → callback, hide
  const remove = async () => {
    if (!form) return;
    if (form.dcrPreconfirmId == null) { onClose(); return; }
    try {
      await icsApi.deleteDcrPreconfirm(form.dcrPreconfirmId);
      message.success('삭제되었습니다');
      onCallback();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L220) — 20·준감 의견이면 막고, 아니면 확인창
  // [E8] msgBox.DialogHide [YES] (L232) → delete()
  const confirmDelete = () => {
    if (!form) return;
    if (form.statusCode === '20') { message.warning('승인완료된 내역은 삭제가 불가능합니다'); return; }
    if (form.confirmMsg != null) { message.warning('준감의견이 존재하는 내역은 삭제가 불가능합니다'); return; }
    Modal.confirm({ title: '확인', content: '해당 내용을 삭제하시겠습니까?', width: 350, okText: '예', cancelText: '아니오', onOk: () => remove() });
  };

  // [E9] closeButton[닫기].Select (L251) → callback.execute(), hide()
  const close = () => {
    onCallback();
    onClose();
  };

  const date = (v: string | null) => (v ? dayjs(v) : null);

  return (
    <Modal
      open={!!target}
      title="신청"
      width={560}
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={close}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="register" onClick={apply}>신청</Button>
            <Button type="cancel" onClick={cancel}>신청취소</Button>
            <span style={{ width: 8 }} />{/* LabelToolItem(" ") */}
            {/* [E6] updateButton[저장].Select (L213) → update(false) */}
            <Button type="save" disabled={updateDisabled} onClick={() => update(false, null)}>저장</Button>
            <Button type="delete" disabled={deleteDisabled} onClick={confirmDelete}>삭제</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      {form && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Row label="대장분류" required>
            <Select style={{ width: '100%' }} placeholder="선택하세요" value={form.dcrTypeCode ?? undefined}
              options={typeOptions.map(o => ({ value: o.code, label: o.name }))}
              onChange={v => set('dcrTypeCode', v ?? null)} />
          </Row>
          <Row label="내용" required top>
            <Input.TextArea style={{ height: 100, resize: 'none' }} value={form.content} onChange={e => set('content', e.target.value)} />
          </Row>
          <Row label="제공처">
            <Input value={form.provideCo} onChange={e => set('provideCo', e.target.value)} />
          </Row>
          <Row label="심사필번호">
            <Input value={form.apprNo} readOnly />
          </Row>
          {/* comment01 + line01 L276-280 */}
          <div style={{ marginTop: 14, paddingLeft: 5, color: '#666' }}>* 광고물인 경우 추가정보 입력</div>
          <div style={{ borderTop: '1px solid #d9d9d9', margin: '0 15px' }} />
          {/* [E1] adTypeName[광고종류].Collapse (L146) → adType = 코드 */}
          <Row label="광고종류">
            <SystemCodeComboBox kindCd="AdType" style={{ width: '100%' }} placeholder="선택" allowClear value={form.adType ?? undefined} onChange={c => set('adType', c ?? null)} />
          </Row>
          {/* [E2] mediaTypeName[매체종류].Collapse (L153) → mediaType = 코드 */}
          <Row label="매체종류">
            <SystemCodeComboBox kindCd="MediaType" style={{ width: '100%' }} placeholder="선택" allowClear value={form.mediaType ?? undefined} onChange={c => set('mediaType', c ?? null)} />
          </Row>
          <Row label="광고상품명">
            <Input value={form.adItemName} onChange={e => set('adItemName', e.target.value)} />
          </Row>
          <Row label="광고내용">
            <Input value={form.adContent} onChange={e => set('adContent', e.target.value)} />
          </Row>
          <div style={{ display: 'flex' }}>
            <Row label="최초사용예정일" width={250}>
              <DatePicker style={{ width: '100%' }} format={FMT} value={date(form.startDate)} onChange={d => set('startDate', d ? d.format(FMT) : null)} />
            </Row>
            <Row label="최종사용예정일" width={250}>
              <DatePicker style={{ width: '100%' }} format={FMT} value={date(form.closeDate)} onChange={d => set('closeDate', d ? d.format(FMT) : null)} />
            </Row>
          </div>
          <Row label="규격">
            <Input value={form.spec} onChange={e => set('spec', e.target.value)} />
          </Row>
          <Row label="수량/회수">
            <Input value={form.qtyCnt} onChange={e => set('qtyCnt', e.target.value)} />
          </Row>
          {/* [E3] preApprNo[과거심사필번호].TriggerClick (L165) → Ics40_Lookup_SelectSingle.open — 고르면 그 심사필번호(apprNoPrefix) */}
          <Row label="과거심사필번호">
            <LookupInput value={form.preApprNo} width={FIELD_W - LABEL_W} onOpen={() => setLookupOpen(true)} />
          </Row>
        </div>
      )}
      <Ics40_Lookup_SelectSingle open={lookupOpen} onResult={r => set('preApprNo', r.apprNoPrefix ?? '')} onClose={() => setLookupOpen(false)} />
    </Modal>
  );
};
