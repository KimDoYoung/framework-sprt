/**
 * 출력정보 및 사용여부 변경 창 (E27) — Act01_Tab_AccountCode의 [출력정보 및 사용여부 설정]에서 연다
 * AS-IS: myApp/client/vi/act/Act01_Lookup_PrintYn.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L56-62: 모달 1000×700 "출력정보 및 사용여부 변경", 툴바(계정코드/명 · 계정속성 · 사용여부 · [조회][저장][조건 초기화]) + 셀 편집 그리드(행번호, 체크박스 없음·단일 선택: 속성 70 · 계정코드 100 · 계정과목(보고서용) 480 편집 · 출력여부 80 편집 · 사용여부 80 편집), 아래 가운데 [닫기]
 * 열 때 화면의 검색 조건을 그대로 받아 조회한다 (setParam L219-232). 원본의 [조건 초기화]는 이 화면 고유 버튼이라 UX-02 초기화를 따로 넣지 않는다
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Modal, Select } from 'antd';
import { actApi } from '@/api/act';
import { AccountCodeAdmin } from '@/types/act';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AccountCodeAdmin>();
const ALL = '%';
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];

/** AS-IS buildGrid() L154-165 */
const buildGrid = () => [
  gb.textCenter('attributeName', 70, '속성'),  // L158
  gb.textCenter('accountCode', 100, '계정코드'),  // L159
  gb.textArea('accountName2', 480, '계정과목(보고서용)', { editor: 'text' }),  // L160
  gb.boolean('printYn', 80, '출력여부', { editable: true }),  // L161
  gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L162
];

/** 체크박스 없는 단일 선택 */
const SINGLE_ROW_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

export interface PrintYnParam {
  searchText: string;
  attributeCode: string;
  useYn: string;
}

interface Props {
  open: boolean;
  /** open(param, callback): 메인 화면의 검색 조건 */
  param: PrintYnParam;
  onClose: () => void;
}

export const Act01_Lookup_PrintYn: React.FC<Props> = ({ open, param, onClose }) => {
  const sp = useSearchParams(() => ({ searchText: '', attributeCode: ALL, useYn: ALL }));
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L167-195: searchText "%검색어%"(서버), useYn, attributeCode, companyId(로그인 회사) → act.Act01_AccountCode.selectByCompanyId
  const search = useCallback(() => {
    const v = sp.current.current;
    return actApi.searchAccountCodeList(v.searchText, v.useYn, v.attributeCode);
  }, [sp.current]);  // eslint-disable-line react-hooks/exhaustive-deps

  // update() L197-211: GridUpdate(act.Act01_AccountCode.update) — 바뀐 행만, "저장이 완료되었습니다."
  const crud = useGridCrud<AccountCodeAdmin>({
    idField: 'accountCodeId',
    search,
    save: rows => actApi.savePrintAccountCodes(rows.map(({ accountCodeId, accountName2, printYn, useYn }) => ({ accountCodeId, accountName2, printYn, useYn }))),
    remove: async () => 0,  // 삭제 버튼이 없다
    newRow: () => ({}),
  });

  // [E0] 화면 열림 (생성자 L56-62) → open() L64-84 · setParam() L219-232: 메인의 조건을 채우고 retrieve()
  useEffect(() => {
    if (!open) return;
    sp.setValues({ searchText: param.searchText, attributeCode: param.attributeCode, useYn: param.useYn });
    setTimeout(() => void crud.retrieve());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E4] initButton[조건 초기화].Select (L108) → init() L213-217: 검색어 비움 · 계정속성 전체 · 사용여부 전체 (조회는 하지 않는다)
  const init = () => sp.setValues({ searchText: '', attributeCode: ALL, useYn: ALL });

  return (
    <Modal open={open} title="출력정보 및 사용여부 변경" width={1000} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancleButton[닫기].Select (L114) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 540, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L96) → retrieve(), [E1] searchText.KeyPress [Enter] (L87) → retrieve() */}
        <SearchBar
          onSearch={() => crud.retrieve()}
          extra={
            <>
              {/* [E3] updateButton[저장].Select (L102) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              <Button type="reset" onClick={init}>조건 초기화</Button>
            </>
          }
        >
          <SearchBar.Field label="계정코드/명">
            <SearchBar.Input style={{ width: 200 }} placeholder="계정코드/계정과목" value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="계정속성">
            <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
              value={sp.values.attributeCode} onChange={code => sp.set('attributeCode', code ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            <Select style={{ width: 100 }} value={sp.values.useYn} onChange={v => sp.set('useYn', v)} options={USE_OPTIONS} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AccountCodeAdmin> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_ROW_SELECTION} />
        </div>
      </div>
    </Modal>
  );
};
