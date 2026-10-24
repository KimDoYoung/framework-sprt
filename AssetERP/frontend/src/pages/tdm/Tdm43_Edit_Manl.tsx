/**
 * 점검항목 등록/수정/상세보기 창 (E13-2) — Tdm43_Lookup_ManlItem의 [등록]·점검항목 보기 아이콘에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Edit_Manl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L184-195: 모달 1250×640, 아래 가운데 [저장][닫기]. 왼쪽 = 직책·책무·책무세부(70)·관리의무(90)·규정/양식(Tdm43_Page_Relate)·사용시작일+[미사용],
 *   오른쪽 = 점검항목(60)·점검주기·점검시기(월 체크박스 12)·점검방법(200, "점검방법 :" 링크 = 내용 보기)·증빙자료(60)·CEO의무·임원의무·중요도
 * insert(model, orgId, cb) L114-147 "등록" / edit(model, endYn, cb) L149-166 "수정" / view(model) L168-182 "상세보기"(저장 숨김, 연결 읽기 전용)
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlItem } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Tdm43_Lookup_ExctDuty } from './Tdm43_Lookup_ExctDuty';
import { Tdm43_Page_Relate, Tdm43_Page_RelateHandle } from './Tdm43_Page_Relate';

const DATE_FORMAT = 'YYYY.MM.DD';
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

/** 점검주기 코드별 점검월 (setCheckMonthBox() L513-582): 03 월별·99 수시 = 전부, 04 분기별 = 1·4·7·10월, 05 반기별 = 1·7월, 06 연별·98 특정월 = 없음 */
const monthsFor = (cycle: string): string | null => {
  if (cycle === '03' || cycle === '99') return '111111111111';
  if (cycle === '04') return '100100100100';
  if (cycle === '05') return '100000100000';
  if (cycle === '06' || cycle === '98') return '000000000000';
  return null;                                                     // 그 밖의 코드는 건드리지 않는다
};

export type ManlEditMode = 'insert' | 'edit' | 'view';

interface Props {
  mode: ManlEditMode;
  /** insert: 점검항목을 등록할 관리의무 행(AS-IS Tdm41_ManlDutyModel 값) / edit·view: 점검항목 행 — 있으면 열린다 */
  manl: TdmManlItem | null;
  /** edit(model, endYn, cb)의 endYn(N17) — true면 제목은 "수정"인 채로 [저장]을 숨기고 연결을 읽기 전용으로 둔다(L149-155) */
  endYn?: boolean;
  /** AS-IS callBack.execute() — 저장이 끝난 뒤(창은 안 닫힌다) */
  onSaved?: () => void;
  onClose: () => void;
}

const LABEL: React.CSSProperties = { width: 100, flex: 'none', paddingTop: 5, textAlign: 'right', paddingRight: 8 };
const Row: React.FC<{ label: React.ReactNode; blue?: boolean; children: React.ReactNode; top?: boolean }> = ({ label, blue, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 10 }}>
    <Typography.Text strong style={{ ...LABEL, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Tdm43_Edit_Manl: React.FC<Props> = ({ mode, manl, endYn = false, onSaved, onClose }) => {
  const relateRef = useRef<Tdm43_Page_RelateHandle>(null);
  const [model, setModel] = useState<TdmManlItem | null>(null);     // editDriver.edit(model)
  const [checkItem, setCheckItem] = useState('');
  const [cycle, setCycle] = useState<string | undefined>(undefined);
  const [checkMonth, setCheckMonth] = useState('');                  // 12자리 0/1 (checkMonth TextField)
  const [monthEnabled, setMonthEnabled] = useState(true);            // monthVlc.setEnabled
  const [checkHow, setCheckHow] = useState('');
  const [evidDoc, setEvidDoc] = useState('');
  const [ceoDuty, setCeoDuty] = useState<string | undefined>(undefined);
  const [exctMap, setExctMap] = useState('');
  const [exctName, setExctName] = useState('');
  const [importLevel, setImportLevel] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [exctLookup, setExctLookup] = useState<string | null>(null);
  const [howView, setHowView] = useState(false);
  const [saving, setSaving] = useState(false);
  const readOnly = mode === 'view' || (mode === 'edit' && endYn);

  // [E0] 화면 열림 (생성자 L184-195) → settings(), show(): insert는 새 번호를 받아 모델을 만들고(DBUtil.setSeq), edit·view는 행 값을 폼에 채운다
  useEffect(() => {
    setModel(null);
    if (!manl) return;
    const fill = (m: TdmManlItem) => {
      setModel(m);
      setCheckItem(m.checkItem ?? '');
      setCycle(m.checkCycleCode || undefined);
      setCheckMonth(m.checkMonth ?? '');
      setMonthEnabled(mode !== 'insert' && m.checkCycleCode !== '99');   // insert: monthVlc.setEnabled(false) / edit·view: 수시(99)면 비활성
      setCheckHow(m.checkHow ?? '');
      setEvidDoc(m.checkEvidDocName ?? '');
      setCeoDuty(m.ceoDutyCode ?? undefined);
      setExctMap(m.exctDutyMap ?? '');
      setExctName(m.exctDutyName ?? '');
      setImportLevel(m.importLevelCode ?? undefined);
      setStartDate(m.startDate ? dayjs(m.startDate, 'YYYY-MM-DD') : null);
    };
    if (mode === 'insert') {
      tdmApi.nextManlId(manl.manlOrgId).then(id => fill({
        // L116-132: 관리의무 행에서 직책·책무·책무세부·관리의무 값을 받고, 새 번호만 채운다
        manlId: id, manlOrgId: manl.manlOrgId, orgId: manl.orgId, exctId: manl.exctId, roleId: manl.roleId, roleName: manl.roleName,
        taskId: manl.taskId, taskName: manl.taskName, taskRelateDetailId: manl.taskRelateDetailId, taskRelateDetailName: manl.taskRelateDetailName,
        taskRelateDutyId: manl.taskRelateDutyId, taskRelateDutyName: manl.taskRelateDutyName, manlDutyId: manl.manlDutyId,
      })).catch(err => message.error(errorMessage(err, '조회 실패')));
    } else {
      fill(manl);
    }
  }, [manl, mode]);

  // [E5] checkCycleName[점검주기].Collapse (L243) → setCheckMonthBox() L513-582: 코드별로 점검월을 채우고 수시(99)면 비활성
  const onCycle = (code: string | undefined) => {
    setCycle(code);
    setMonthEnabled(code !== '99');
    const preset = code ? monthsFor(code) : null;
    if (preset) setCheckMonth(preset);
  };

  // checkMonthNNYn.ValueChange → checkMonth.setValue(getCheckMonth()) L584-601 (12자리 0/1)
  // [E6] checkMonth01Yn (L250)  [E7] checkMonth02Yn (L256)  [E8] checkMonth03Yn (L262)  [E9] checkMonth04Yn (L268)  [E10] checkMonth05Yn (L274)  [E11] checkMonth06Yn (L280)
  // [E12] checkMonth07Yn (L286)  [E13] checkMonth08Yn (L292)  [E14] checkMonth09Yn (L298)  [E15] checkMonth10Yn (L304)  [E16] checkMonth11Yn (L310)  [E17] checkMonth12Yn (L316)
  const toggleMonth = (i: number, v: boolean) => setCheckMonth(prev => {
    const base = (prev || '000000000000').padEnd(12, '0').split('');
    base[i] = v ? '1' : '0';
    return base.join('');
  });

  // [E3] updateButton[저장].Select (L224) → update() L466-511
  const update = async () => {
    if (!model) return;
    if (!checkItem.trim()) return void message.warning('점검항목을 입력하세요');
    if (!cycle) return void message.warning('점검주기를 선택하세요');
    if (!checkMonth || checkMonth === '000000000000') return void message.warning('점검시기를 선택하세요');
    setSaving(true);
    try {
      await tdmApi.saveManl({
        manlId: model.manlId, manlOrgId: model.manlOrgId, orgId: model.orgId, exctId: model.exctId, roleId: model.roleId, roleName: model.roleName,
        taskId: model.taskId, taskName: model.taskName, taskRelateDetailId: model.taskRelateDetailId, taskRelateDetailName: model.taskRelateDetailName,
        taskRelateDutyId: model.taskRelateDutyId, taskRelateDutyName: model.taskRelateDutyName, manlDutyId: model.manlDutyId,
        checkItem, checkCycleCode: cycle, checkMonth, checkEvidDocName: evidDoc, checkHow,
        refBasis: relateRef.current?.getRefBasis() ?? '',
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        ceoDutyCode: ceoDuty ?? null, exctDutyMap: exctMap || null, importLevelCode: importLevel ?? null,
        ...(relateRef.current?.getNew() ?? { relateIcsClassTreeIds: [], relateIcrClassTreeIds: [], relateFormFileIds: [], relateDcrClassTreeIds: [] }),
      });
      onSaved?.();                                                   // callBack.execute()
      message.success('저장이 완료되었습니다');                         // hide()는 주석 — 창은 그대로
      await relateRef.current?.reload();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  const title = mode === 'insert' ? '등록' : mode === 'edit' ? '수정' : '상세보기';

  return (
    <Modal
      open={!!manl}
      title={<b>{title}</b>}
      width="min(1250px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {!readOnly && <Button type="save" loading={saving} onClick={update}>저장</Button>}
            {/* [E4] closeButton[닫기].Select (L230) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {model && (
        <div style={{ display: 'flex', gap: 24, maxHeight: 'calc(100vh - 190px)', overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Row label="직책"><Input disabled value={model.roleName ?? ''} /></Row>
            <Row label="책무"><Input disabled value={model.taskName ?? ''} /></Row>
            <Row label="책무세부" top><Input.TextArea disabled style={{ height: 70, resize: 'none' }} value={model.taskRelateDetailName ?? ''} /></Row>
            <Row label="관리의무" top><Input.TextArea disabled style={{ height: 90, resize: 'none' }} value={model.taskRelateDutyName ?? ''} /></Row>
            <Row label="규정/양식" top>
              <Tdm43_Page_Relate ref={relateRef} manl={model} updateYn={!readOnly} />
            </Row>
            <Row label="사용시작일">
              <Space>
                <DatePicker style={{ width: 160 }} format={DATE_FORMAT} value={startDate} onChange={setStartDate} />
                {/* [E2] unUseButton[미사용].Select (L218) → startDate = 2999.12.31 */}
                <AntButton onClick={() => setStartDate(dayjs('2999-12-31'))}>미사용</AntButton>
              </Space>
            </Row>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Row label="점검항목" blue top><Input.TextArea style={{ height: 60, resize: 'none' }} placeholder="점검항목명을 입력하세요" value={checkItem} onChange={e => setCheckItem(e.target.value)} /></Row>
            <Row label="점검주기" blue>
              {/* CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", CycleCode004) */}
              <SystemCodeComboBox kindGroupCd="CycleCode004" style={{ width: 270 }} placeholder="선택하세요" allowClear={false} value={cycle} onChange={onCycle} />
            </Row>
            <Row label="점검시기" blue top>
              <div style={{ border: '1px solid #d9d9d9', opacity: monthEnabled ? 1 : 0.5, pointerEvents: monthEnabled ? 'auto' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', background: '#e8f1fb', textAlign: 'center', padding: '3px 0' }}>
                  {MONTHS.map(m => <b key={m} style={{ fontSize: 12 }}>{m}</b>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', justifyItems: 'center', padding: '4px 0' }}>
                  {MONTHS.map((m, i) => <Checkbox key={m} checked={checkMonth.charAt(i) === '1'} onChange={e => toggleMonth(i, e.target.checked)} />)}
                </div>
              </div>
            </Row>
            <Row label={<a style={{ color: '#0069B4', textDecoration: 'none' }} onMouseDown={() => setHowView(true)}>점검방법 :</a>} top>
              <Input.TextArea style={{ height: 200, resize: 'none' }} placeholder="점검방법을 입력하세요" value={checkHow} onChange={e => setCheckHow(e.target.value)} />
            </Row>
            <Row label="증빙자료" blue top><Input.TextArea style={{ height: 60, resize: 'none' }} placeholder="증빙자료명을 입력하세요" value={evidDoc} onChange={e => setEvidDoc(e.target.value)} /></Row>
            <Row label="CEO의무">
              <SystemCodeComboBox kindCd="TdmCeoDutyCode" altCode={['', '(해당없음)']} style={{ width: 270 }} placeholder="선택하세요" allowClear={false} value={ceoDuty} onChange={setCeoDuty} />
            </Row>
            <Row label="임원의무">
              {/* [E1] exctDutyName[임원의무].TriggerClick (L211) → lookupExctDuty() L603-620 */}
              <Input readOnly style={{ cursor: 'pointer' }} placeholder="선택하세요" value={exctName} onClick={() => setExctLookup(exctMap)} />
            </Row>
            <Row label="중요도">
              <SystemCodeComboBox kindCd="TdmImportLevelCode" altCode={['', '(선택안함)']} style={{ width: 270 }} placeholder="선택하세요" allowClear={false} value={importLevel} onChange={setImportLevel} />
            </Row>
          </div>
        </div>
      )}
      <Tdm43_Lookup_ExctDuty exctDutyMap={exctLookup}
        onResult={r => { setExctMap(r.exctDutyMap); setExctName(r.exctDutyName ?? ''); }} onClose={() => setExctLookup(null)} />
      {/* [E18] anchor.MouseDown (L328) → AreaMessage.open("점검방법", checkHow) — 500×400, 읽기 전용, [닫기] */}
      <Modal open={howView} title={<b>점검방법</b>} width={500} onCancel={() => setHowView(false)}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={() => setHowView(false)}>닫기</Button></div>}>
        <Input.TextArea readOnly style={{ height: 300, resize: 'none' }} value={checkHow} />
      </Modal>
    </Modal>
  );
};
