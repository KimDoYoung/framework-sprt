import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, Modal, Space, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import dayjs from 'dayjs';
import { orgApi } from '../../../api/org';
import { errorMessage } from '../../../api/client';
import { OrgCode, OrgHistory } from '../../../types/org';
import { OrgForm, OrgFormValues, toOrgSave } from './OrgForm';

interface OrgHistoryModalProps {
  target?: OrgCode;
  orgs: OrgCode[];
  onClose: () => void;
  /** 저장·삭제 후 트리 다시 조회 */
  onChanged: () => void;
}

/**
 * 조직정보 History (AS-IS Org02_Lookup_OrgInfo + Org02_Edit_Info): 왼쪽 이력, 오른쪽 고른 이력 편집.
 * 변경일을 바꿔 저장하면 새 이력이 생긴다. 최초 이력 삭제 = 조직 삭제(하위 조직·사원 없을 때).
 */
export const OrgHistoryModal: React.FC<OrgHistoryModalProps> = ({ target, orgs, onClose, onChanged }) => {
  const gridRef = useRef<AgGridReact<OrgHistory>>(null);
  const [form] = Form.useForm<OrgFormValues>();
  const [rows, setRows] = useState<OrgHistory[]>([]);
  const [history, setHistory] = useState<OrgHistory>();

  const parentNm = useCallback((id: number) => orgs.find(o => o.codeId === id)?.korNm ?? '상위조직이 없습니다', [orgs]);

  const retrieve = useCallback(async () => {
    if (!target) return;
    try {
      const data = await orgApi.searchOrgHistories(target.codeId);
      setRows(data);
      setHistory(data[0]);
    } catch (err) {
      message.error(errorMessage(err, '이력 조회 실패'));
    }
  }, [target]);

  useEffect(() => { retrieve(); }, [retrieve]);

  // 고른 이력을 폼에 (조직코드·개설·종료는 조직 공통)
  useEffect(() => {
    if (!target || !history) return;
    form.setFieldsValue({
      parentCodeId: history.parentCodeId,
      parentNm: parentNm(history.parentCodeId),
      orgCd: target.orgCd,
      korNm: history.korNm,
      engNm: history.engNm ?? undefined,
      levelCd: history.levelCd ?? undefined,
      sortOrder: history.sortOrder ?? undefined,
      modDate: dayjs(history.modDate),
      modReason: history.modReason ?? undefined,
      openDate: dayjs(target.openDate),
      openReason: target.openReason ?? '',
      closeDate: target.closeDate ? dayjs(target.closeDate) : null,
      closeReason: target.closeReason ?? undefined,
      note: history.note ?? undefined,
    });
    gridRef.current?.api?.getRowNode(String(history.infoId))?.setSelected(true);
  }, [target, history, form, parentNm]);

  const save = async () => {
    if (!target || !history) return;
    const v = await form.validateFields();
    if (v.openDate && v.modDate && v.openDate.isAfter(v.modDate)) {
      message.warning('변경일은 개설일 이후여야 합니다');
      return;
    }
    try {
      await orgApi.updateOrgCode(target.codeId, toOrgSave(v, history.infoId));
      message.success('저장되었습니다.');
      onChanged();
      retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  /** AS-IS deleteCheck: 최초 이력(개설일 이전·같음)이면 조직 삭제, 아니면 경고 후 이력만 삭제 */
  const remove = () => {
    if (!target || !history) return;
    const first = !dayjs(history.modDate).isAfter(dayjs(target.openDate));
    Modal.confirm({
      title: first ? '삭제' : '경고',
      content: first ? '해당 부서를 삭제하시겠습니까?' : '오래된 정보를 임의로 삭제 시 문제를 발생시킬 수 있습니다. 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          if (first) {
            await orgApi.deleteOrg(target.codeId);
            message.success('해당부서는 정상적으로 삭제되었습니다');
            onChanged();
            onClose();
          } else {
            await orgApi.deleteOrgHistory(target.codeId, history.infoId);
            onChanged();
            retrieve();
          }
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<OrgHistory>[]>(() => [
    { field: 'modDate', headerName: '개설(변경)일', width: 120 },
    { field: 'korNm', headerName: '조직(부서)명', flex: 1 },
  ], []);

  return (
    <Modal open={!!target} title={`조직정보 History${target ? ` — ${target.korNm}` : ''}`} width={1000} onCancel={onClose} forceRender
      footer={
        <Space>
          <Button danger onClick={remove}>삭제</Button>
          <Button type="primary" onClick={save}>저장</Button>
          <Button onClick={onClose}>닫기</Button>
        </Space>
      }>
      <div style={{ display: 'flex', gap: 12, height: 420 }}>
        <div style={{ width: 400 }}>
          <AgGridReact<OrgHistory> ref={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.infoId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onRowClicked={e => setHistory(e.data)} />
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <OrgForm form={form} mode="edit" orgs={orgs} codeId={target?.codeId} />
        </div>
      </div>
    </Modal>
  );
};
