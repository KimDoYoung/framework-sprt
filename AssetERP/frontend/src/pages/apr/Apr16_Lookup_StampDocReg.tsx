/**
 * 법인서류 발급 및 사용매수 등록 창 — Apr16_Tab_StampDocManager의 [등록] 또는 행의 [수정] 아이콘에서 연다 (T23)
 * AS-IS: myApp/client/vi/apr/Apr16_Lookup_StampDocReg.java (481줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L97-135·getEditor() L240-287: 모달 700×480 "법인서류 발급 및 사용매수 등록", 라벨 120 — 등록일 · 구분(콤보 250 + 인감/대표명의 칸 330) · 발급매수 · 사용매수 · 제출처 · 목적 · 비고 ·
 *   연관상신문서(조회 칸), 아래 가운데 [저장][닫기]. 연관상신문서 칸을 누르면 연결된 문서가 있을 때 [문서보기][문서연결][연결제거] 작은 창(SettingPopup)
 * 편집창 규격(11 §4a). 1단계: [문서연결](Apr05_Lookup_LoadDoc2)·[문서보기](Apr01_Edit_ApprDoc)는 다른 도메인 컴포넌트라 다음 단계 — 안내만 띄운다
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStamp, AprStampDoc } from '@/types/apr';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';
import { Apr15_Lookup_ReprCorp } from './Apr15_Lookup_ReprCorp';

const DATE = 'YYYY-MM-DD';
const LABEL: React.CSSProperties = { width: 120, flex: 'none', textAlign: 'right', paddingRight: 10 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

interface Props {
  /** openNew() 면 row = null, open(model)이면 그 행 */
  target: { row: AprStampDoc | null } | null;
  /** callback.execute(model) — 저장 성공 뒤 */
  onSaved: () => void;
  onClose: () => void;
}

export const Apr16_Lookup_StampDocReg: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  // 편집 값 (AS-IS editDriver.flush() 대상)
  const [regDate, setRegDate] = useState<Dayjs | null>(null);
  const [applType, setApplType] = useState<string | undefined>();
  const [stampId, setStampId] = useState<number | null>(null);
  const [reprCorpId, setReprCorpId] = useState<number | null>(null);
  const [stampReprCorpName, setStampReprCorpName] = useState<string>('');
  const [docIssueQty, setDocIssueQty] = useState<number | null>(null);
  const [docUseQty, setDocUseQty] = useState<number | null>(null);
  const [provideCo, setProvideCo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [apprId, setApprId] = useState<number | null>(null);
  const [apprName, setApprName] = useState('');
  const [saving, setSaving] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [reprOpen, setReprOpen] = useState(false);
  const [apprPopup, setApprPopup] = useState(false);
  // setInitStampId() L436-472: 법인인감이 하나 이상이면 첫 번째, 등록 대표명의가 없으면 회사 자신이 기본값
  const init = useRef<{ stampId: number | null; stampName: string; reprCorpId: number | null; reprCorpName: string }>({ stampId: null, stampName: '', reprCorpId: null, reprCorpName: '' });

  // [E0] 화면 열림 (openNew L97-110 · open L112-135) → setting(), setInitStampId()
  useEffect(() => {
    if (!target) return;
    const r = target.row;
    // openNew(): 등록일 = 오늘 (GridInsertRow의 새 행). open(model): 그 행의 값
    setRegDate(r?.regDate ? dayjs(r.regDate) : dayjs());
    setApplType(r?.applType ?? undefined);
    setStampId(r?.stampId ?? null);
    setReprCorpId(r?.reprCorpId ?? null);
    setStampReprCorpName(r?.stampReprCorpName ?? '');
    setDocIssueQty(r?.docIssueQty ?? null);
    setDocUseQty(r?.docUseQty ?? null);
    setProvideCo(r?.provideCo ?? '');
    setPurpose(r?.purpose ?? '');
    setNote(r?.note ?? '');
    setApprId(r?.apprId ?? null);
    setApprName(r?.apprName ?? '');
    aprStampDocApi.getCorpStamp()
      .then(s => { init.current.stampId = s?.stampId ?? null; init.current.stampName = s?.stampName ?? ''; })
      .catch(() => { init.current.stampId = null; });
    aprStampDocApi.existsCorpReg()
      .then(exists => {
        init.current.reprCorpId = exists ? null : user.companyId;
        init.current.reprCorpName = exists ? '' : user.companyName;
      })
      .catch(() => { init.current.reprCorpId = null; });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E1] applTypeName[구분].Collapse (L145) → 구분을 바꾸면 인감/대표명의를 비우고, 기본값이 있으면 채운다
  const onApplTypeChange = (code: string | undefined) => {
    setApplType(code);
    setStampId(null);
    setReprCorpId(null);
    setStampReprCorpName('');
    if (code === '1') {
      if (init.current.stampId != null) { setStampId(init.current.stampId); setStampReprCorpName(init.current.stampName); }
    } else if (init.current.reprCorpId != null) {
      setReprCorpId(init.current.reprCorpId); setStampReprCorpName(init.current.reprCorpName);
    }
  };

  // [E2] stampReprCorpName.TriggerClick (L174) → lookupStamp() L348-363 (구분 1), lookupReprCorp() L365-385
  const lookupStampRepr = () => {
    if (applType == null) { message.warning('구분을 선택하세요'); return; }
    if (applType === '1') setStampOpen(true); else setReprOpen(true);
  };

  // preUpdate() L289-325
  const preUpdate = async () => {
    if (regDate == null) { message.warning('등록일을 선택하세요'); return; }
    if (applType == null) { message.warning('구분을 선택하세요'); return; }
    // 1:법인인감증명서 2:법인등기부등본
    if (applType === '2') {
      if (reprCorpId == null) { message.warning('대표명의를 선택하세요'); return; }
    } else if (stampId == null) {
      message.warning('인감을 선택하세요');
      return;
    }
    if ((docIssueQty == null || docIssueQty === 0) && (docUseQty == null || docUseQty === 0)) {
      message.warning('발급매수 또는 사용매수를 입력하세요');
      return;
    }
    // [E7] updateButton[저장].Select (L222) → preUpdate() → update() L327-346: apr.Apr16_StampDoc.update
    setSaving(true);
    try {
      await aprStampDocApi.save([{
        stampDocId: target?.row?.stampDocId ?? 0,
        regDate: regDate.format(DATE),
        applType,
        stampId: applType === '2' ? null : stampId,
        reprCorpId: applType === '2' ? reprCorpId : null,
        docIssueQty,
        docUseQty,
        provideCo: provideCo || null,
        purpose: purpose || null,
        note: note || null,
        apprId,
      }]);
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] apprName[연관상신문서].TriggerClick [apprId.getValue() == null] (L186) → lookupApprRelate(), 있으면 SettingPopup("연관문서")
  const clickAppr = () => {
    if (apprId == null) lookupApprRelate(); else setApprPopup(true);
  };
  // lookupApprView() L387-415 — [E4] apprViewButton[문서보기].Select (L201). Apr01_Edit_ApprDoc은 다음 단계
  const lookupApprView = () => {
    if (apprId == null) { message.warning('연결된 문서가 없습니다.'); return; }
    message.info('문서보기(Apr01_Edit_ApprDoc)는 다음 단계에서 제공됩니다');
  };
  // lookupApprRelate() L417-434 — [E5] apprRelateButton[문서연결].Select (L207). Apr05_Lookup_LoadDoc2는 다음 단계
  const lookupApprRelate = () => message.info('문서연결(Apr05_Lookup_LoadDoc2)은 다음 단계에서 제공됩니다');
  // [E6] apprdeleteButton[연결제거].Select (L213) → 연관문서 비움
  const removeAppr = () => { setApprName(''); setApprId(null); setApprPopup(false); };

  return (
    <>
      <Modal
        open={target != null}
        title="법인서류 발급 및 사용매수 등록"
        width={700}
        maskClosable={false}
        destroyOnClose
        onCancel={onClose}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>
              {/* [E8] closeButton[닫기].Select [isNew] (L228) → callback(null), hide() — 새 행은 저장 전이라 그리드에 없다 */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={ROW}>
            <span style={LABEL}>등록일</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={regDate} onChange={d => setRegDate(d)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>구분</span>
            <SystemCodeComboBox kindGroupCd="CorpDocStampApplType001" style={{ width: 130, marginRight: 8 }} placeholder="(선택하세요)" value={applType} onChange={onApplTypeChange} />
            <Input
              readOnly
              style={{ width: 330, cursor: 'pointer' }}
              value={stampReprCorpName}
              placeholder={applType === '1' ? '법인인감을 선택하세요' : applType ? '대표명의를 선택하세요' : '(선택하세요)'}
              suffix={<SearchOutlined />}
              onClick={lookupStampRepr}
            />
          </div>
          <div style={ROW}>
            <span style={LABEL}>발급매수</span>
            <InputNumber style={{ width: 130 }} precision={0} value={docIssueQty} onChange={v => setDocIssueQty(v as number | null)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>사용매수</span>
            <InputNumber style={{ width: 130 }} precision={0} value={docUseQty} onChange={v => setDocUseQty(v as number | null)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>제출처</span>
            <Input style={{ width: 480 }} value={provideCo} onChange={e => setProvideCo(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>목적</span>
            <Input style={{ width: 480 }} value={purpose} onChange={e => setPurpose(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>비고</span>
            <Input style={{ width: 480 }} value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>연관상신문서</span>
            <Input readOnly style={{ width: 480, cursor: 'pointer' }} value={apprName} suffix={<SearchOutlined />} onClick={clickAppr} />
          </div>
        </div>
      </Modal>
      {/* lookupStamp() L348-363: new Apr10_Lookup_Stamp(true, false) → 고른 인감의 이름·ID */}
      <Apr10_Lookup_Stamp
        open={stampOpen}
        checkflag={false}
        onResult={(s: AprStamp | null) => { if (s) { setStampReprCorpName(s.stampName ?? ''); setStampId(s.stampId); } }}
        onDelete={() => undefined}
        onClose={() => setStampOpen(false)}
      />
      {/* lookupReprCorp() L365-385: Apr15_Lookup_ReprCorp.open(true, callback) — 해당사항 없음이면 비운다 */}
      <Apr15_Lookup_ReprCorp
        open={reprOpen}
        companyAddYn
        onResult={r => {
          if (r) { setStampReprCorpName(r.corpName ?? ''); setReprCorpId(r.reprCorpId); } else { setStampReprCorpName(''); setReprCorpId(null); }
        }}
        onClose={() => setReprOpen(false)}
      />
      {/* SettingPopup("연관문서") — [문서보기][문서연결][연결제거] */}
      <Modal open={apprPopup} title="연관문서" width={360} maskClosable={false} destroyOnClose onCancel={() => setApprPopup(false)} footer={null}>
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <Space>
            <Button type="search" onClick={lookupApprView}>문서보기</Button>
            <Button type="register" onClick={lookupApprRelate}>문서연결</Button>
            <Button type="delete" onClick={removeAppr}>연결제거</Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};
