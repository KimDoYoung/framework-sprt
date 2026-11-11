/**
 * [1053] 펀드관리 > 90. 기관정보관리 > 발행기관정보 관리 (EE13)
 * AS-IS: myApp/client/vi/fnd/Fnd07_Tab_IssuingEntity.java (204줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 스타일: CG (CrudGrid — docs/page-style.md). 조건 입력(발행기관명)이 있어 SearchBar + [저장][삭제][파일업로드]는 extra
 * 레이아웃 L53-132: 툴바(발행기관명 400 "전체" · 조회 · 저장 · 삭제 · 파일업로드) + 셀 편집 그리드(행번호, 체크박스 단일).
 *   [등록] 단추는 원본에 없다([파일업로드]가 insertRow()라는 이름으로 파일 선택창만 연다). 열 때 조회하지 않는다
 * 저장: 원본 서버에 fnd.Fnd07_IssuingEntity.update가 없어 원본에서도 실패 → 서버가 거절한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { fndApi } from '@/api/fnd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { IssuingEntity } from '@/types/fnd';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<IssuingEntity>();
const ROW_SELECTION = { mode: 'singleRow' as const, checkboxes: true };

export const Fnd07_Tab_IssuingEntity: React.FC = () => {
  const [codeName, setCodeName] = useState('');
  const [nations, setNations] = useState<Code[]>([]);
  const fileForm = useRef<FileUpdownFormHandle>(null);

  // [E0] 화면 열림 (생성자 L53-132) → 초기화: 검색칸 폭 400·빈칸 글자 "전체", 열 때 조회하지 않는다
  // [E7] nationComboBox[NationCode].Collapse (L145) — 원본 핸들러 본문이 주석 처리돼 있어 아무 일도 하지 않는다. 고른 이름만 칸에 남는다
  useEffect(() => {
    sysApi.searchCodes('NationCode').then(setNations).catch(() => undefined);
  }, []);

  const crud = useGridCrud<IssuingEntity>({
    idField: 'issuingEntityId',
    // retrieve() L160-177: "%발행기관명%" → fnd.Fnd07_IssuingEntity.selectByCodeName
    search: useCallback(() => fndApi.searchIssuingEntities(codeName), [codeName]),
    // update() L180-183: GridUpdate → fnd.Fnd07_IssuingEntity.update (원본 서버에 없음 → 서버가 거절)
    save: fndApi.saveIssuingEntities,
    // [E5] deleteButton[삭제].Select (L82) → deleteRow() L195-199: 체크한 행 → fnd.Fnd07_IssuingEntity.delete
    remove: fndApi.deleteIssuingEntities,
    newRow: useCallback(() => ({}), []),
  });

  // [E1] codeNameField.KeyPress [Enter] (L56) / [E2] retrieveButton[조회].Select (L64) → retrieve() L160-177: 발행기관명이 비면 메시지만
  const retrieve = async () => {
    if (codeName === '') {
      Modal.info({ title: '확인', content: '발행기관명을 입력해주세요' });
      return;
    }
    await crud.retrieve();
  };

  // [E6] fileUpdownForm.Change (L105) → IssuingEntityUpload?companyId 로 올리고 결과 문구를 알림(SimpleMessage "확인"). 목록은 다시 읽지 않는다
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await fndApi.uploadIssuingEntities(file);
      Modal.info({ title: '확인', content: '파일을 성공적으로 등록하였습니다.' });
    } catch (err) {
      Modal.info({ title: '확인', content: errorMessage(err, '파일 업로드시 오류가 발생하였습니다.') });
    }
  };

  // buildGrid() L134-157
  const columnDefs = useMemo(() => [
    gb.text('issuingEntityCode', 90, '발행기관코드', { editor: 'text' }),  // L138
    gb.text('issuingEntityName', 250, '발행기관명', { editor: 'text' }),  // L139
    gb.text('issuingEntityAttachCode', 80, '소속구분', { editor: 'text' }),  // L140
    gb.long('issuingEntityFaceValue', 80, '액면가', { editor: 'number' }),  // L141
    gb.text('issuingEntitySettleMonth', 80, '결산월', { editor: 'text' }),  // L142
    gb.text('kukaName', 80, '국가코드', { editor: 'select', values: nations.map(c => c.name) }),  // L153
    gb.boolean('issuingEntityUseYn', 70, '사용여부', { editable: true }),  // L154
    gb.text('issuingEntityNote', 300, '비고', { editor: 'text' }),  // L155
  ], [nations]);

  return (
    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, background: '#fff' }}>
      <SearchBar onSearch={retrieve} loading={crud.loading} extra={<>
        {/* [E3] updateButton[저장].Select (L70) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" disabled={!crud.hasChecked} onClick={crud.deleteChecked}>삭제</Button>
        {/* [E4] fileUploadButton[파일업로드].Select (L76) → insertRow() L186-192: 숨은 파일 선택창을 연다 */}
        <Button type="upload" onClick={() => fileForm.current?.click()}>파일업로드</Button>
      </>}>
        <SearchBar.Field label="발행기관명">
          <SearchBar.Input style={{ width: 400 }} placeholder="전체" value={codeName} onChange={e => setCodeName(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <CellEditGrid<IssuingEntity> crud={crud} columnDefs={columnDefs} rowSelection={ROW_SELECTION} />
      </div>
      <FileUpdownForm ref={fileForm} onChange={file => { void onFile(file); }} />
    </div>
  );
};
