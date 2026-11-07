/**
 * AssetERP 기본설정 창 (EE22) — Biz51_Tab_ErpContCorp의 [기본설정]이 연다
 * AS-IS: myApp/client/vi/biz/Biz50_Lookup_ErpSetup.java (345줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L75-111: 모달 1190×600 "기본설정", 위 [조회][등록][저장][삭제] [메일양식] / 셀 편집 그리드(체크 다중) / "▼ 메모" + 메모 텍스트영역(높이 120) / [닫기](callback 후 닫기)
 * buildGrid() L154-197: 적용시작일 100(날짜) · 기본제공 월문자건수 · 추가 건당 문자사용료 · 기본제공 서버사용량(GB) · 서버사용량 추가단위(GB) · 서버사용량 추가당 금액 · 기본제공 사용인원 · 추가 인당 사용료(원) 110(숫자)
 *   · 월청구일 80(콤보 DateCode) · 입금기한일 80(콤보 DateCode) · VAT 70(콤보 VatCode)
 * [저장] L126-131: update() 와 updateNote() 를 이어서 부른다(둘 다 기다리지 않음). 메모만 고쳐도 저장되도록 저장(n)에 메모 변경을 1건으로 센다(UX-03)
 * UX보강(10): 저장(n) UX-03, 변경 표시 UX-07, 날짜 컬럼 폭 UX-08(편집 120), 조회창 UX-05
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Space } from 'antd';
import { bizErpSetupApi } from '@/api/bizErp';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BizErpMailForm, BizErpSetup } from '@/types/bizErp';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Biz50_Lookup_MailMapping } from './Biz50_Lookup_MailMapping';

const gb = gbFor<BizErpSetup>();
/** setChecked(MULTI) — 삭제용 체크라 행 클릭이 선택을 바꾸지 않게 한다(03 원칙 16 예외). 상수로 넘긴다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;

/** 콤보(이름 → 코드) 열: 고르면 코드와 이름을 함께 바꾼다 (AS-IS 콤보 Collapse → addChange(코드)) */
const comboCol = (codes: Code[], codeField: keyof BizErpSetup, nameField: keyof BizErpSetup) => ({
  editor: 'select' as const,
  values: codes.map(c => c.name),
  valueSetter: (p: { data: BizErpSetup; newValue: string }) => {
    (p.data as unknown as Record<string, unknown>)[nameField] = p.newValue;
    (p.data as unknown as Record<string, unknown>)[codeField] = codes.find(c => c.name === p.newValue)?.code ?? null;
    return true;
  },
});

interface Props {
  open: boolean;
  /** callback.execute() 후 hide() — 닫을 때 부른다(부르는 쪽이 목록을 다시 읽음) */
  onClose: () => void;
}

export const Biz50_Lookup_ErpSetup: React.FC<Props> = ({ open, onClose }) => {
  const [dateCodes, setDateCodes] = useState<Code[]>([]);
  const [vatCodes, setVatCodes] = useState<Code[]>([]);
  const [note, setNote] = useState('');
  const [noteDirty, setNoteDirty] = useState(false);
  const [mailTarget, setMailTarget] = useState<BizErpMailForm | null>(null);

  useEffect(() => {
    sysApi.searchCodes('DateCode').then(setDateCodes).catch(() => setDateCodes([]));
    sysApi.searchCodes('VatCode').then(setVatCodes).catch(() => setVatCodes([]));
  }, []);

  const crud = useGridCrud<BizErpSetup>({
    idField: 'erpSetupId',
    // retrieve() L200-229: biz.Biz50_ErpSetup.selectAll 뒤 biz.Biz50_ErpSetup.getNote(noteYn true) → 메모 칸 (없으면 비움)
    search: useCallback(async () => {
      const [rows, n] = await Promise.all([bizErpSetupApi.search(), bizErpSetupApi.note()]);
      setNote(n ?? '');
      setNoteDirty(false);
      return rows;
    }, []),
    // update() L231-251: biz.Biz50_ErpSetup.update — 저장한 행으로 제자리 교체
    save: useCallback((changed: BizErpSetup[]) => bizErpSetupApi.save(changed), []),
    // GridDeleteData → biz.Biz50_ErpSetup.delete
    remove: useCallback((ids: number[]) => bizErpSetupApi.delete(ids), []),
    newRow: useCallback(() => ({}), []),   // insertRow() L268-274: noteYn false 새 행 (서버가 note_yn 'false'로 넣는다)
    validate: useCallback((changed: BizErpSetup[]) => (changed.some(r => r.startDate == null) ? '적용시작일은 필수입력 항목입니다.' : undefined), []),
    deleteConfirm: (count: number) => `${count}건을 삭제하시겠습니까?`,
  });
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L75-111) → show() · open(callback) L69-73 → retrieve()
  useEffect(() => {
    if (open) void crudRetrieve();
  }, [open, crudRetrieve]);

  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L185 (UX-08: 편집 날짜는 120)
    gb.long('smsBaseCount', 110, '기본제공<br>월문자건수', { editor: 'number' }),  // L186
    gb.long('smsAddPrice', 110, '추가 건당<br>문자사용료', { editor: 'number' }),  // L187
    gb.long('serverBaseUsage', 110, '기본제공<br>서버사용량(GB)', { editor: 'number' }),  // L188
    gb.long('serverAddUnit', 110, '서버사용량<br>추가단위(GB)', { editor: 'number' }),  // L189
    gb.long('serverAddPrice', 110, '서버사용량<br>추가당 금액', { editor: 'number' }),  // L190
    gb.long('userBaseCount', 110, '기본제공<br>사용인원', { editor: 'number' }),  // L191
    gb.long('userAddPrice', 110, '추가 인당<br>사용료(원)', { editor: 'number' }),  // L192
    gb.textCenter('chargeDayStr', 80, '월청구일', comboCol(dateCodes, 'chargeDay', 'chargeDayStr')),  // L193 [E7] dateCombo01.Collapse (L158)
    gb.textCenter('depositDueDayStr', 80, '입금기한일', comboCol(dateCodes, 'depositDueDay', 'depositDueDayStr')),  // L194 [E8] dateCombo02.Collapse (L167)
    gb.textCenter('vatNm', 70, 'VAT', comboCol(vatCodes, 'vatCd', 'vatNm')),  // L195 [E9] vatCombo.Collapse (L176)
  ], [dateCodes, vatCodes]);

  // [E3] updateButton[저장].Select (L126) → update(), updateNote(): 메모는 바로 이어서 저장한다 (updateNote L253-266: noteYn true)
  const saveAll = async () => {
    crud.gridRef.current?.api?.stopEditing();
    try {
      await bizErpSetupApi.saveNote(note === '' ? null : note);
      setNoteDirty(false);
    } catch (err) {
      message.error(errorMessage(err, '메모 저장 실패'));
    }
    await crud.saveRows();
  };

  // [E6] mappingButton[메일양식].Select (L146) → mappingSet() L302-340: selectMailForm(noteYn false) — 행이 있으면 Biz50_Lookup_MailMapping.open(행),
  //   없으면 빈 모델을 insertMailForm 으로 만들어 그 행으로 열고, 실패하면 "에러 관리자에게 문의하세요."
  const mappingSet = async () => {
    try {
      let form = await bizErpSetupApi.mailForm();
      if (!form) form = await bizErpSetupApi.saveMailForm(null, null);
      if (!form) { message.error('에러 관리자에게 문의하세요.'); return; }
      setMailTarget(form);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  return (
    <>
      <LookupModal
        open={open}
        title="기본설정"
        width={1190}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
        }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E5] cancelButton[닫기].Select (L139) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 'calc(100vh - 250px)', minHeight: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            {/* [E1] retrieveButton[조회].Select (L114) → retrieve() */}
            <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
            {/* [E2] insertButton[등록].Select (L120) → insertRow() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            <Button type="save" count={{ ...crud.changes, modified: crud.changes.modified + (noteDirty ? 1 : 0) }} onClick={saveAll}>저장</Button>
            {/* [E4] deleteButton[삭제].Select (L133) → deleteChk() → [E10] msgBox.DialogHide [YES] (L279) → deleteRow() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            <span style={{ width: 16 }} />
            <Button type="view" onClick={() => void mappingSet()}>메일양식</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<BizErpSetup> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_CHECK} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>▼ 메모</div>
          <Input.TextArea rows={5} style={{ resize: 'none' }} value={note} onChange={e => { setNote(e.target.value); setNoteDirty(true); }} />
        </div>
      </LookupModal>
      <Biz50_Lookup_MailMapping target={mailTarget} onClose={() => setMailTarget(null)} />
    </>
  );
};
