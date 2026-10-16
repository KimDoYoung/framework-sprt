/**
 * 조직정보 History 조회창 (C02) — Org01_Tab_OrgCode 그리드의 [수정] 칸에서 연다.
 * AS-IS: myApp/client/vi/org/Org02_Lookup_OrgInfo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 왼쪽 이력 그리드(420) + 오른쪽 Org02_Edit_Info(560)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode, OrgInfoHist } from '@/types/org';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Org02_Edit_Info, Org02_Edit_InfoRef } from './Org02_Edit_Info';

const gb = gbFor<OrgInfoHist>();

export interface OrgLookupTarget {
  editModel: OrgCode;
  /** 트리의 상위 조직 (최상위면 null) */
  parentModel: OrgCode | null;
  baseDate: string;
}

interface Props {
  /** showData(treeGrid, editModel, parentModel, baseDate, callback) L82-114 — 값이 있으면 열린다 */
  target: OrgLookupTarget | null;
  onClose: () => void;
  /** callback.execute(1): 본 화면 다시 조회 */
  onChanged: () => void;
}

export const Org02_Lookup_OrgInfo: React.FC<Props> = ({ target, onClose, onChanged }) => {
  const gridRef = useRef<AgGridReact<OrgInfoHist>>(null);
  const editRef = useRef<Org02_Edit_InfoRef>(null);
  const [rows, setRows] = useState<OrgInfoHist[]>([]);
  const codeModel = useRef<OrgCode | null>(null);
  const selectFirst = useRef(false);
  const parentName = target?.parentModel ? target.parentModel.korNm ?? '' : null;

  // buildGrid() L116-124
  const columnDefs = useMemo(() => [
    gb.date('modDate', 100, '개설(변경)일'), // L120
    gb.text('korNm', 300, '조직(부서)명'), // L121
  ], []);

  const selected = () => gridRef.current?.api?.getSelectedRows()[0];

  // retrieve() L138-149: 서비스 org.Org02_Info.selectByOnlyOrgCodeId(orgCodeId) → 첫 행 선택
  const retrieve = useCallback(async () => {
    if (!codeModel.current) return;
    try {
      const list = await orgCodeApi.searchInfos(codeModel.current.codeId);
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 → showData() L82-114: 폼에 본 화면 행(기준일), 이력 조회
  useEffect(() => {
    if (!target) return;
    codeModel.current = target.editModel;
    setRows([]);
    editRef.current?.editData(target.editModel, parentName, target.baseDate);
    retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E4] grid.CellClick (L74) → init() L126-136: 클릭한 이력을 폼에(기준일 = 그 변경일)
  const init = () => {
    const infoModel = selected();
    if (!infoModel || !codeModel.current) return;
    const { infoId, korNm, modDate, modReason, parentCodeId, levelCd, levelNm, sortOrder, engNm, note, dcrIdWord } = infoModel;
    codeModel.current = { ...codeModel.current, infoId, korNm, modDate, modReason, parentCodeId, levelCd, levelNm, sortOrder, engNm, note, dcrIdWord };
    editRef.current?.editData(codeModel.current, parentName, modDate ?? '');
  };

  // [E3] closeButton[닫기].Select (L68) → hide()
  const hide = () => onClose();

  // [E1] deleteButton[삭제].Select (L56) → deleteCheck() L151-185
  const deleteCheck = async () => {
    const infoModel = selected();
    if (!infoModel || !codeModel.current) return;
    if ((codeModel.current.openDate ?? '') >= (infoModel.modDate ?? '')) {
      // 개설 이력 → 조직 전체 삭제 가능한지 (org.Org02_Info.deleteCheck)
      try {
        const status = await orgCodeApi.deleteCheck(infoModel.codeId);
        if (status === 1) deleteMsg(infoModel.codeId);
        else if (status === -1) message.warning('하위부서를 먼저 삭제 후 삭제가능합니다');
        else if (status === -2) message.warning('해당부서에 사원이 존재합니다');
      } catch (err) {
        message.error(errorMessage(err, '삭제 확인 실패'));
      }
    } else {
      Modal.confirm({
        title: '경고',
        content: '오래된 정보를 임의로 삭제 시 문제를 발생시킬 수 있습니다. 삭제하시겠습니까?',
        width: 560,
        okText: '예',
        cancelText: '아니오',
        // [E5] messageBox.DialogHide [YES] (L174) → deleteRow()
        onOk: () => deleteRow(),
      });
    }
  };

  // deleteMsg() L187-219
  const deleteMsg = (orgCodeId: number) => {
    Modal.confirm({
      title: '확인',
      content: '해당부서를 삭제하시겠습니까?',
      width: 350,
      okText: '예',
      cancelText: '아니오',
      // [E6] msgBox.DialogHide [YES] (L190) → 서비스 org.Org02_Info.deleteOrg → 메시지 → callback → hide()
      onOk: async () => {
        try {
          if (await orgCodeApi.deleteOrg(orgCodeId) > 0) {
            message.success('해당부서는 정상적으로 삭제되었습니다');
            onChanged();
            hide();
          }
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // deleteRow() L235-243: GridDeleteData org.Org02_Info.delete(선택 이력) → 그리드에서 빼고 callback
  const deleteRow = async () => {
    const infoModel = selected();
    if (!infoModel) return;
    try {
      await orgCodeApi.deleteInfos(infoModel.codeId, [infoModel.infoId]);
      setRows(prev => prev.filter(r => r.infoId !== infoModel.infoId));
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E2] updateButton[저장].Select (L62) → updateCheck() L221-233
  const updateCheck = () => {
    if (!codeModel.current) return;
    editRef.current?.update(codeModel.current, result => {
      if (result === 1) {
        onChanged();
        retrieve();
      } else {
        message.warning('변경일은 개설일 이후여야 합니다');
      }
    });
  };

  return (
    <Modal
      open={!!target}
      title="조직정보 History"
      width={1010}
      maskClosable={false}
      onCancel={hide}
      forceRender
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="delete" onClick={deleteCheck}>삭제</Button>
            <Button type="save" onClick={updateCheck}>저장</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 420 }}>
        <div style={{ width: 420, flex: 'none' }}>
          <SingleGrid<OrgInfoHist>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.infoId)}
            onCellClicked={init}
            onRowDataUpdated={e => {
              if (!selectFirst.current) return;
              selectFirst.current = false;
              e.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
            }}
          />
        </div>
        <div style={{ width: 560, flex: 'none' }}>
          <Org02_Edit_Info ref={editRef} />
        </div>
      </div>
    </Modal>
  );
};
