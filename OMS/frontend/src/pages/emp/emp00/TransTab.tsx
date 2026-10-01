import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { empApi } from '../../../api/emp';
import { errorMessage } from '../../../api/client';
import { EmpTrans, TransInfo } from '../../../types/emp';
import { editableCol, useGridCrud } from '../../../hooks/useGridCrud';
import { useCodes } from '../../../hooks/useCodes';
import { OrgLookup } from '../../../components/lookup/OrgLookup';

/**
 * 일반발령 탭 (AS-IS Emp03_TabPage_Trans): 발령 이력 그리드 편집. 발령조직은 발령일 기준 조직 Lookup.
 * '특정직위 및 알림설정'(Emp03_Lookup_Grade)은 AS-IS에도 서버 메서드가 없어 변환하지 않았다.
 */
export const TransTab: React.FC<{ person?: TransInfo; onChanged: () => void }> = ({ person, onChanged }) => {
  const trans = useCodes('EmpTransCode');
  const kind = useCodes('EmpKindCode');
  const title = useCodes('EmpTitleCode');
  const pos = useCodes('EmpPosCode');
  const [orgTarget, setOrgTarget] = useState<EmpTrans>();

  const search = useCallback(async () => (person ? empApi.searchPersonTrans(person.personId) : []), [person]);
  // AS-IS insertRow: 현재 사원구분·직책·직위·조직, 발령일 오늘
  const newRow = useCallback((): Partial<EmpTrans> => ({
    personId: person?.personId, transDate: dayjs().format('YYYY-MM-DD'), transCd: null,
    kindCd: person?.kindCd ?? null, titleCd: person?.titleCd ?? null, posCd: person?.posCd ?? null,
    orgCodeId: person?.orgCodeId ?? null, orgNm: person?.orgKorNm ?? null, orgHeadYn: false, transReason: null,
  }), [person]);
  // AS-IS update(): 같은 발령일 중복 금지
  const validate = useCallback((_changed: EmpTrans[], all: EmpTrans[]) => {
    const dates = all.map(r => r.transDate);
    return dates.some((d, i) => d && dates.indexOf(d) !== i) ? '동일한 발령일에 이미 발령내용이 존재합니다' : undefined;
  }, []);

  const crud = useGridCrud<EmpTrans>({
    idField: 'transId', search, save: empApi.updateTrans, remove: async () => undefined, newRow, firstEditField: 'transCd',
    validate, reloadAfterSave: true, onChanged,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (person) crud.retrieve(); else crud.clear(); }, [person?.personId]);
  // 코드 이름이 늦게 오면 다시 그린다
  useEffect(() => { crud.gridRef.current?.api?.refreshCells({ force: true }); }, [trans.codes, kind.codes, title.codes, pos.codes, crud.gridRef]);

  /** AS-IS deleteRow: 체크한 발령 1건, 서버가 1건 이상 남는지 확인 */
  const remove = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!checked) {
      message.warning('삭제할 발령을 선택하세요.');
      return;
    }
    if (checked.transId < 0) {
      crud.deleteChecked();
      return;
    }
    Modal.confirm({
      title: '삭제', content: '선택한 정보를 삭제하시겠습니까?', okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await empApi.deleteTrans(checked.transId);
          crud.retrieve();
          onChanged();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<EmpTrans>[]>(() => {
    const codeCol = (field: keyof EmpTrans & string, headerName: string, c: ReturnType<typeof useCodes>, width = 110): ColDef<EmpTrans> =>
      editableCol<EmpTrans>({
        field: field as ColDef<EmpTrans>['field'], headerName, width,
        cellEditor: 'agSelectCellEditor', cellEditorParams: { values: c.codes.map(x => x.code) },
        valueFormatter: p => c.nameOf(p.value as string),
      });
    return [
      editableCol<EmpTrans>({ field: 'transDate', headerName: '발령일', width: 120, cellDataType: 'dateString' }),
      codeCol('transCd', '발령구분', trans, 120),
      codeCol('kindCd', '사원구분', kind, 100),
      {
        field: 'orgNm', headerName: '발령조직', width: 200, cellStyle: { color: '#1677ff', cursor: 'pointer' },
        cellRenderer: (p: { value: string | null }) => <span>{p.value} <SearchOutlined style={{ color: '#8c8c8c' }} /></span>,
        onCellClicked: e => {
          if (!e.data) return;
          if (!e.data.transDate) { message.warning('발령일을 먼저 등록해주세요'); return; }
          setOrgTarget(e.data);
        },
      },
      codeCol('titleCd', '발령직책', title),
      codeCol('posCd', '발령직위', pos),
      { field: 'gradeNm', headerName: '특정직위', width: 100 },
      editableCol<EmpTrans>({ field: 'transReason', headerName: '비고', width: 200 }),
      { field: 'orgHeadYn', headerName: '조직장', width: 80, editable: true, cellDataType: 'boolean' },
    ];
  }, [trans, kind, title, pos]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Space wrap>
        <Typography.Text strong>일반발령</Typography.Text>
        <Button type="primary" onClick={crud.retrieve} disabled={!person}>조회</Button>
        <Button onClick={crud.addRow} disabled={!person}>등록</Button>
        <Button danger onClick={remove} disabled={!person}>삭제</Button>
        <Button onClick={crud.saveRows} disabled={!person}>저장</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<EmpTrans> ref={crud.gridRef} columnDefs={columnDefs} {...crud.gridProps}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
      <OrgLookup
        open={!!orgTarget}
        baseDate={orgTarget?.transDate ?? undefined}
        title="발령조직 선택"
        onCancel={() => setOrgTarget(undefined)}
        onOk={org => {
          if (orgTarget) crud.updateRow(orgTarget.transId, { orgCodeId: org.orgCodeId, orgNm: org.korNm });
          setOrgTarget(undefined);
        }}
      />
    </div>
  );
};
