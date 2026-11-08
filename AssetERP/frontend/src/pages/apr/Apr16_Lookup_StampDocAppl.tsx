/**
 * 법인서류 및 날인신청 상세 창 — Apr16_Tab_StampDocAppl의 [등록]·[등록(복사)] 또는 행의 [수정] 아이콘에서 연다 (Y11)
 * AS-IS: myApp/client/vi/apr/Apr16_Lookup_StampDocAppl.java (575줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L144-175·getEditor() L274-329: 모달 650×560 "법인서류 및 날인신청 상세", 라벨 145 — 신청일자 · 신청구분 · 인감(+[반출]) · 대표명의 · 신청/날인 부수 ·
 *   제출처 · 목적 · 비고(날인요청서류) · 요청자 · 연관상신문서(조회 칸), 아래 가운데 [저장][닫기]. 등록일 또는 날인일자가 있으면 읽기 전용(신청일자·구분·인감·대표명의·반출 비활성, [저장] 없음).
 *   연관상신문서 칸: 읽기 전용이면 바로 문서보기, 연결된 문서가 없으면 문서연결, 있으면 [문서보기][문서연결][연결제거] 작은 창(SettingPopup)
 * 편집창 규격(11 §4a). 새 행은 그리드에 먼저 넣지 않고 저장 뒤 다시 조회한다(원본은 GridInsertRow 뒤 [닫기]에서 지움 — 03 원칙 17의 결과와 같다)
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStamp, AprStampAppl } from '@/types/apr';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';
import { Apr05_Lookup_LoadDoc2 } from './Apr05_Lookup_LoadDoc2';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';
import { Apr15_Lookup_ReprCorp } from './Apr15_Lookup_ReprCorp';

const DATE = 'YYYY-MM-DD';
const LABEL: React.CSSProperties = { width: 145, flex: 'none', textAlign: 'right', paddingRight: 10 };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

export interface StampApplTarget {
  /** 'new' = openNew(), 'copy' = openCopy(model), 'edit' = open(model) */
  mode: 'new' | 'copy' | 'edit';
  row: AprStampAppl | null;
}

interface Props {
  target: StampApplTarget | null;
  /** 저장 성공 뒤 (그리드 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

export const Apr16_Lookup_StampDocAppl: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const user = useLoginUser();
  const [applDate, setApplDate] = useState<Dayjs>(dayjs());
  const [applType, setApplType] = useState<string | undefined>();
  const [stampId, setStampId] = useState<number | null>(null);
  const [stampName, setStampName] = useState('');
  const [reprCorpId, setReprCorpId] = useState<number | null>(null);
  const [reprCorpName, setReprCorpName] = useState('');
  const [stampOutYn, setStampOutYn] = useState(false);
  const [applQty, setApplQty] = useState<number | null>(null);
  const [provideCo, setProvideCo] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [requester, setRequester] = useState('');
  const [apprId, setApprId] = useState<number | null>(null);
  const [apprName, setApprName] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const [reprOpen, setReprOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);
  const [apprPopup, setApprPopup] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  // setInitStampId() L491-527: 법인인감이 하나면 기본 인감, 추가대표명의가 없으면 회사 자신이 기본 대표명의
  const init = useRef<{ stampId: number | null; stampName: string; reprCorpId: number | null; reprCorpName: string }>({ stampId: null, stampName: '', reprCorpId: null, reprCorpName: '' });

  // setEnable(applType) L529-563 — 구분에 따라 칸을 켜고 끈다 (값은 인자로 받은 상태 위에 바꾼다)
  // 구분을 아직 고르지 않았으면(setEnable이 불리지 않음) 세 칸 모두 켜진 채다
  const stampEnabled = applType !== '2';
  const reprEnabled = applType == null || applType === '2';
  const outEnabled = applType == null || applType === '3';

  const setEnable = (type: string | undefined) => {
    if (type === '1') {            // 1:법인인감증명서
      setReprCorpName(''); setReprCorpId(null);
      setStampOutYn(false);
      if (init.current.stampId != null) { setStampId(init.current.stampId); setStampName(init.current.stampName); }
    } else if (type === '2') {     // 2:법인등기부등본
      setStampName(''); setStampId(null);
      setStampOutYn(false);
      if (init.current.reprCorpId != null) { setReprCorpId(init.current.reprCorpId); setReprCorpName(init.current.reprCorpName); }
    } else if (type === '3') {     // 3:인감날인
      setReprCorpName(''); setReprCorpId(null);
    }
  };

  // [E0] 화면 열림 (openNew L97-111 · openCopy L113-142 · open L144-175) → setting(), setInitStampId()
  useEffect(() => {
    if (!target) return;
    const r = target.row;
    const edit = target.mode === 'edit';
    // openNew/openCopy: 신청일자 = 오늘. open(model): 그 행의 값. 복사는 구분·인감·대표명의·부수·반출·제출처·목적·요청자·비고·연관문서를 가져온다(등록일·날인일자는 가져오지 않음)
    setApplDate(edit && r?.applDate ? dayjs(r.applDate) : dayjs());
    setApplType(r?.applType ?? undefined);
    setStampId(r?.stampId ?? null);
    setStampName(r?.stampName ?? '');
    setReprCorpId(r?.reprCorpId ?? null);
    setReprCorpName(r?.reprCorpName ?? '');
    setStampOutYn(r?.stampOutYn === 'true');
    setApplQty(r?.applQty ?? null);
    setProvideCo(r?.provideCo ?? '');
    setPurpose(r?.purpose ?? '');
    setNote(r?.note ?? '');
    setRequester(r?.requester ?? '');
    setApprId(r?.apprId ?? null);
    setApprName(r?.apprName ?? '');
    // open() L152-156: 등록일 또는 날인일자가 있으면 읽기 전용 (복사 행은 새 모델이라 항상 편집)
    setIsReadOnly(edit && (r?.regDate != null || r?.stampDate != null));
    // setting() L186: setEnable(model.applType) — 모델 값 위에서 비활성 칸을 비운다(기본값은 아직 못 읽은 상태)
    if (r?.applType === '1') { setReprCorpName(''); setReprCorpId(null); setStampOutYn(false); }
    else if (r?.applType === '2') { setStampName(''); setStampId(null); setStampOutYn(false); }
    else if (r?.applType === '3') { setReprCorpName(''); setReprCorpId(null); }
    init.current = { stampId: null, stampName: '', reprCorpId: null, reprCorpName: '' };
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

  // [E1] applTypeName[신청구분].Collapse (L189) → setEnable()
  const onApplTypeChange = (code: string | undefined) => {
    setApplType(code);
    setEnable(code);
  };

  // [E2] stampName.TriggerClick (L197) → lookupStamp() L403-418
  const lookupStamp = () => {
    if (applType == null) { message.warning('신청구분을 선택하세요'); return; }
    setStampOpen(true);
  };
  // [E3] reprCorpName.TriggerClick (L207) → lookupReprCorp() L420-440
  const lookupReprCorp = () => {
    if (applType == null) { message.warning('신청구분을 선택하세요'); return; }
    setReprOpen(true);
  };

  // [E4] apprName[연관상신문서].TriggerClick (L215) — 읽기 전용이면 lookupApprView(), 아니면 연결 없음 → lookupApprRelate(), 있음 → SettingPopup("연관문서")
  const clickAppr = () => {
    if (isReadOnly) lookupApprView();
    else if (apprId == null) lookupApprRelate();
    else setApprPopup(true);
  };
  // [E5] apprViewButton[문서보기].Select (L234) → lookupApprView() L442-470: 연결된 문서가 없으면 "연결된 문서가 없습니다.", 열람권한 검사 뒤 Apr01_Edit_ApprDoc
  const lookupApprView = () => {
    if (apprId == null) { message.warning('연결된 문서가 없습니다.'); return; }
    setViewApprId(apprId);
  };
  // [E6] apprRelateButton[문서연결].Select (L240) → lookupApprRelate() L472-489: Apr05_Lookup_LoadDoc2("SINGLE", true, false, callback)
  const lookupApprRelate = () => { setApprPopup(false); setLoadOpen(true); };
  // [E7] apprDeleteButton[연결제거].Select (L246) → 연관문서 비움
  const removeAppr = () => { setApprName(''); setApprId(null); setApprPopup(false); };

  // [E8] updateButton[저장].Select (L256) → preUpdate() L331-383 → update() L385-401: apr.Apr16_StampDoc.update
  const preUpdate = async () => {
    if (applType == null) { message.warning('신청구분을 선택하세요'); return; }
    // 1:법인인감증명서 2:법인등기부등본 3:인감날인
    if (applType === '2') {
      if (reprCorpId == null) { message.warning('대표명의를 선택하세요'); return; }
    } else if (stampId == null) {
      message.warning('인감을 선택하세요');
      return;
    }
    if (applQty == null || applQty === 0) { message.warning('신청/날인 부수를 입력하세요'); return; }
    if (!provideCo) { message.warning('제출처를 입력하세요'); return; }
    if (!purpose) { message.warning('목적을 입력하세요'); return; }
    setSaving(true);
    try {
      await aprStampDocApi.saveMine({
        stampDocId: target?.mode === 'edit' ? (target.row?.stampDocId ?? 0) : 0,
        applDate: applDate.format(DATE),
        applType,
        stampId: applType === '2' ? null : stampId,
        reprCorpId: applType === '2' ? reprCorpId : null,
        applQty,
        stampOutYn: stampOutYn ? 'true' : 'false',
        provideCo,
        purpose,
        requester: requester || null,
        note: note || null,
        apprId,
      });
      message.success('저장이 완료되었습니다.');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={target != null}
        title="법인서류 및 날인신청 상세"
        width={650}
        maskClosable={false}
        destroyOnClose
        onCancel={onClose}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {!isReadOnly && <Button type="save" onClick={preUpdate} loading={saving}>저장</Button>}
              {/* [E9] closeButton[닫기].Select [isNew] (L262) → 새 행은 저장 전이라 그리드에 없다 (callback(null), hide()) */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={ROW}>
            <span style={LABEL}>신청일자</span>
            <DatePicker style={{ width: 130 }} allowClear={false} disabled={isReadOnly} value={applDate} onChange={d => d && setApplDate(d)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>신청구분</span>
            <SystemCodeComboBox kindGroupCd="CorpDocStampApplType001" style={{ width: 200 }} placeholder="(선택하세요)" disabled={isReadOnly} value={applType} onChange={onApplTypeChange} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>인감</span>
            <Input readOnly disabled={isReadOnly || !stampEnabled} style={{ width: 330, cursor: 'pointer' }} value={stampName} suffix={<SearchOutlined />} onClick={lookupStamp} />
            <Checkbox style={{ marginLeft: 10 }} disabled={isReadOnly || !outEnabled} checked={stampOutYn} onChange={e => setStampOutYn(e.target.checked)}>반출</Checkbox>
          </div>
          <div style={ROW}>
            <span style={LABEL}>대표명의</span>
            <Input readOnly disabled={isReadOnly || !reprEnabled} style={{ width: 330, cursor: 'pointer' }} value={reprCorpName} suffix={<SearchOutlined />} onClick={lookupReprCorp} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>신청/날인 부수</span>
            <InputNumber style={{ width: 130 }} precision={0} value={applQty} onChange={v => setApplQty(v as number | null)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>제출처</span>
            <Input style={{ width: 400 }} value={provideCo} onChange={e => setProvideCo(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>목적</span>
            <Input style={{ width: 400 }} value={purpose} onChange={e => setPurpose(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>비고(날인요청서류)</span>
            <Input style={{ width: 400 }} value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>요청자</span>
            <Input style={{ width: 400 }} value={requester} onChange={e => setRequester(e.target.value)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>연관상신문서</span>
            <Input readOnly style={{ width: 400, cursor: 'pointer' }} value={apprName} suffix={<SearchOutlined />} onClick={clickAppr} />
          </div>
        </div>
      </Modal>
      {/* lookupStamp() L403-418: new Apr10_Lookup_Stamp(true, false) → 고른 인감의 이름·ID */}
      <Apr10_Lookup_Stamp
        open={stampOpen}
        checkflag={false}
        onResult={(s: AprStamp | null) => { if (s) { setStampName(s.stampName ?? ''); setStampId(s.stampId); } }}
        onDelete={() => undefined}
        onClose={() => setStampOpen(false)}
      />
      {/* lookupReprCorp() L420-440: Apr15_Lookup_ReprCorp.open(true, callback) — 해당사항 없음이면 비운다 */}
      <Apr15_Lookup_ReprCorp
        open={reprOpen}
        companyAddYn
        onResult={r => {
          if (r) { setReprCorpName(r.corpName ?? ''); setReprCorpId(r.reprCorpId); } else { setReprCorpName(''); setReprCorpId(null); }
        }}
        onClose={() => setReprOpen(false)}
      />
      {/* lookupApprRelate() L472-489: Apr05_Lookup_LoadDoc2("SINGLE", nullButtonYn=true, aprStatusYn=false, callback) — [선택안함]이면 연결을 비운다 */}
      <Apr05_Lookup_LoadDoc2
        open={loadOpen}
        onResult={() => undefined}
        onSelected={d => { setApprName(d.title ?? ''); setApprId(d.apprId); setLoadOpen(false); }}
        onNull={() => { setApprName(''); setApprId(null); }}
        onClose={() => setLoadOpen(false)}
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
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </>
  );
};
