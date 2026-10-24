/**
 * 책무유형 창 (N05) — 책무 등록의 [책무유형 관리](편집 edit)와 책무 편집창의 책무유형 칸(고르기 view)이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm14_Lookup_TaskType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 800×500(원본) → 편집 열 합계(120+100+350+70+선택·행번호 60+여백 130) 기준 830: 툴바(책무구분 콤보 · [사용만 보기](편집) · [조회][등록][저장][삭제]) + 책무유형 그리드 + [확인](고르기)[전체]·[닫기]
 *  - edit (L98-111): 책무구분(콤보 편집)·코드·명(편집)·사용 열, 확인 없음
 *  - view (L78-95): 책무구분·코드·명 열(읽기 전용), 책무구분 콤보는 정해져 있어 못 바꾼다, [확인](더블클릭)으로 고름 — 사용 중인 유형만 나온다
 * UX보강(10): 조회창(UX-05·06), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message, Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { tdmApi } from '@/api/tdm';
import { Code } from '@/types/sys';
import { TdmTaskType } from '@/types/tdm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<TdmTaskType>();

interface Props {
  /** 'edit' = 책무유형 관리, 'view' = 고르기(AS-IS view), null이면 닫힘 */
  mode: 'edit' | 'view' | null;
  /** view: 정해진 책무구분 코드 (AS-IS view(taskClassName, …)) */
  taskClassCode?: string | null;
  /** view: 고른 책무유형 (AS-IS callback.execute(model)). 닫기는 onClose */
  onResult?: (taskType: TdmTaskType) => void;
  /** view: [전체] 버튼을 보이고(AS-IS allButtonYn) 누르면 부른다 (AS-IS callback.execute(null)). 이 화면을 여는 곳은 아직 쓰지 않는다 */
  onAll?: () => void;
  onClose: () => void;
}

export const Tdm14_Lookup_TaskType: React.FC<Props> = ({ mode, taskClassCode, onResult, onAll, onClose }) => {
  const edit = mode === 'edit';
  const [classCode, setClassCode] = useState('%');
  const [useYn, setUseYn] = useState(true);       // useCheckBox: 사용만 보기, 기본 체크 (settings L159-160)
  const [classCodes, setClassCodes] = useState<Code[]>([]);

  // buildGrid() L238-261: 편집(2~5열) / 고르기(6~8열)
  const editColumns = useMemo(() => [
    // [E12] taskClassCombo[TdmTaskClassCode].Collapse (L242) → 고른 책무구분 코드를 행의 taskClassCode에 반영 (valueSetter)
    gb.textCenter('taskClassName', 120, '책무구분', {  // L251 (콤보 편집기, 고르면 taskClassCode도 바꾼다 L241-248)
      editor: 'select',
      values: classCodes.map(c => c.name),
      valueSetter: p => {
        p.data.taskClassName = p.newValue;
        p.data.taskClassCode = classCodes.find(c => c.name === p.newValue)?.code ?? p.data.taskClassCode;
        return true;
      },
    }),
    gb.textCenter('taskTypeCode', 100, '책무유형코드', { editor: 'text' }),  // L252
    gb.text('taskTypeName', 350, '책무유형명', { editor: 'text' }),  // L253
    gb.boolean('useYn', 70, '사용', { editable: true }),  // L254
  ], [classCodes]);
  const viewColumns = useMemo(() => [
    gb.textCenter('taskClassName', 120, '책무구분'),  // L256
    gb.textCenter('taskTypeCode', 100, '책무유형코드'),  // L257
    gb.text('taskTypeName', 350, '책무유형명'),  // L258
  ], []);

  const crud = useGridCrud<TdmTaskType>({
    idField: 'taskTypeId',
    // retrieve() L276-290: tdm.Tdm14_TaskType.selectByCompanyId (companyId는 서버)
    search: useCallback(() => tdmApi.searchTaskTypes(classCode, useYn), [classCode, useYn]),
    save: useCallback((rows: TdmTaskType[]) => tdmApi.saveTaskTypes(rows), []),
    remove: useCallback((ids: number[]) => tdmApi.deleteTaskTypes(ids), []),
    newRow: useCallback((): Partial<TdmTaskType> => ({ useYn: 'true' }), []),   // insertRow() L292-299
    firstEditField: 'taskClassName',
    deleteConfirm: '삭제하시겠습니까?',
    reloadAfterSave: true,   // update() L356-368: 저장되면 retrieve()
    // update() L318-353
    validate: changed => {
      for (const r of changed) {
        if (!r.taskTypeCode) return '책무유형코드를 입력하세요';
        if (r.taskTypeCode.substring(0, 1) !== r.taskClassCode) return '책무유형코드의 첫자리는 책무구분코드와 동일해야 합니다';
        if (r.taskTypeCode.length !== 3) return '책무유형코드는 3자리로 입력하세요 (책무구분코드 1 + 순번 2자리)';
        if (!r.taskTypeName) return '책무유형명을 입력하세요';
      }
      return undefined;
    },
  });
  const { retrieve, clear } = crud;

  // [E0] 화면 열림 (생성자 L67-76) → view/edit → open() L113-141: 책무구분 콤보를 읽고 retrieve()
  useEffect(() => {
    if (!mode) { clear(); return; }
    setClassCode(mode === 'view' ? taskClassCode || '%' : '%');
    setUseYn(true);
    sysApi.searchCodes('TdmTaskClassCode').then(setClassCodes).catch(() => {});
  }, [mode, taskClassCode]);   // eslint-disable-line react-hooks/exhaustive-deps

  // 책무구분·사용만 보기가 바뀌면 조회 (taskClassComboBox.Collapse L152 → retrieve())
  useEffect(() => { if (mode) void retrieve(); }, [mode, classCode, useYn]);   // eslint-disable-line react-hooks/exhaustive-deps

  const [selected, setSelected] = useState<TdmTaskType | undefined>();

  // selectClose() L263-274: 고른 내역이 없으면 안내
  const selectClose = (row: TdmTaskType | undefined = selected) => {
    if (!row) {
      message.warning('선택한 내역이 없습니다');
      return;
    }
    onResult?.(row);
    onClose();
  };

  // closeButton[닫기] L216-235: 반영 안 된 변경이 있으면 확인
  const close = () => {
    if (crud.hasChanges()) {
      Modal.confirm({
        title: '확인',
        content: <>반영되지 않은 변경사항이 존재합니다.<br />저장하지 않고 닫으시겠습니까?</>,
        width: 350,
        onOk: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <LookupModal
      open={!!mode}
      title="책무유형"
      width={830}
      closable={false}
      maskClosable={false}
      onCancel={close}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E8] selectButton[확인].Select (L201) → selectClose() — 고르기 */}
            {!edit && <Button type="save" onClick={() => selectClose()}>확인</Button>}
            {/* [E9] selectAllButton[전체].Select [callback != null] (L207) → callback(null), hide() — allButtonYn(onAll)일 때만 */}
            {!edit && onAll && <Button type="select" onClick={() => { onAll(); onClose(); }}>전체</Button>}
            {/* [E10] closeButton[닫기].Select (L216) → hide(), [E11] messageBox.DialogHide (L221) */}
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Space size={6}>
            <b>책무구분</b>
            {/* [E2] taskClassComboBox[TdmTaskClassCode].Collapse (L152) → retrieve(). 고르기에서는 정해진 책무구분이라 못 바꾼다 (L80) */}
            <SystemCodeComboBox
              kindCd="TdmTaskClassCode"
              altCode={['%', '전체']}
              style={{ width: 150 }}
              disabled={!edit}
              value={classCode}
              onChange={code => setClassCode(code ?? '%')}
            />
          </Space>
          {edit && <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용만 보기</Checkbox>}
          {/* [E3] retrieveButton[조회].Select (L162) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {edit && (
            <>
              {/* [E4] insertRowButton[등록].Select (L168) → insertRow() */}
              <Button type="register" onClick={crud.addRow}>등록</Button>
              {/* [E7] updateButton[저장].Select (L195) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E5] deleteButton[삭제].Select (L174) → "삭제하시겠습니까?" [E6] messageBox.DialogHide (L183) → delete() */}
              <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
            </>
          )}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          {edit ? (
            <CellEditGrid<TdmTaskType> crud={crud} columnDefs={editColumns} />
          ) : (
            /* [E1] grid.RowDoubleClick (L126) → selectClose() */
            <SingleGrid<TdmTaskType>
              rowData={crud.rows}
              columnDefs={viewColumns}
              getRowId={p => String(p.data.taskTypeId)}
              onSelect={setSelected}
              onRowDoubleClicked={e => selectClose(e.data)}
            />
          )}
        </div>
      </div>
    </LookupModal>
  );
};
