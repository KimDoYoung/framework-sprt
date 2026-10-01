import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Modal, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../../api/sys';
import { CodeGroup, CodeKind } from '../../../types/sys';
import { editableCol, useGridCrud } from '../../../hooks/useGridCrud';
import { isSysAdmin, useLoginUser } from '../../../hooks/useLoginUser';
import { CompanyLookup } from '../../../components/lookup/CompanyLookup';
import { CodeLookup } from '../../../components/lookup/CodeLookup';

interface CodeGroupModalProps {
  codeKind?: CodeKind;
  onClose: () => void;
}

/**
 * 코드 그룹 (AS-IS Sys13_Lookup_CodeGroup + Sys13_TabPage_Code): 왼쪽 그룹 정의, 오른쪽 그룹 구성 코드.
 * 저장·삭제는 KFS 관리자만 (AS-IS: 회사 0만 버튼 사용).
 */
export const CodeGroupModal: React.FC<CodeGroupModalProps> = ({ codeKind, onClose }) => {
  const user = useLoginUser();
  const sysAdmin = isSysAdmin(user);
  const [group, setGroup] = useState<CodeGroup>();
  const [company, setCompany] = useState({ companyId: user.companyId, companyNm: user.companyName });
  const [lookup, setLookup] = useState<'company' | 'code'>();

  // ── 왼쪽: 그룹 정의 (codeId = 0) ──
  const searchGroups = useCallback(async () => (codeKind ? sysApi.searchCodeGroups(codeKind.codeKindId) : []), [codeKind]);
  const newGroup = useCallback((): Partial<CodeGroup> => ({ codeKindId: codeKind?.codeKindId, codeId: 0, kindGroupCd: '', kindGroupNm: '' }), [codeKind]);
  const groups = useGridCrud<CodeGroup>({
    idField: 'codeGroupId', search: searchGroups, save: sysApi.updateCodeGroups, remove: sysApi.deleteCodeGroups,
    newRow: newGroup, firstEditField: 'kindGroupCd', deleteConfirm: '선택한 그룹을 삭제하시겠습니까? (구성 코드도 함께 삭제됩니다)',
  });

  // ── 오른쪽: 그룹 구성 코드 ──
  const searchCodes = useCallback(
    async () => (codeKind && group ? sysApi.searchCodeGroupCodes(codeKind.codeKindId, group.kindGroupCd, company.companyId) : []),
    [codeKind, group, company],
  );
  const newCode = useCallback((): Partial<CodeGroup> => ({ codeKindId: codeKind?.codeKindId }), [codeKind]);
  const codes = useGridCrud<CodeGroup>({
    idField: 'codeGroupId', search: searchCodes, save: sysApi.createCodeGroupCodes, remove: sysApi.deleteCodeGroupCodes,
    newRow: newCode, deleteConfirm: '선택한 코드를 삭제하시겠습니까?',
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (codeKind) { setGroup(undefined); groups.retrieve(); } }, [codeKind]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (group) codes.retrieve(); else codes.clear(); }, [group, company]);

  const groupCols = useMemo<ColDef<CodeGroup>[]>(() => [
    editableCol<CodeGroup>({ field: 'kindGroupCd', headerName: '그룹코드', width: 200, editable: sysAdmin }),
    editableCol<CodeGroup>({ field: 'kindGroupNm', headerName: '그룹설명', flex: 1, editable: sysAdmin }),
  ], [sysAdmin]);
  const codeCols = useMemo<ColDef<CodeGroup>[]>(() => [
    { field: 'code', headerName: '코드', width: 100, cellStyle: { textAlign: 'center' } },
    { field: 'name', headerName: '코드명', flex: 1 },
  ], []);

  const addCodes = () => {
    if (!group) {
      message.warning('좌측 그룹코드를 선택해주세요');
      return;
    }
    setLookup('code');
  };

  return (
    <Modal open={!!codeKind} title={`코드 그룹${codeKind ? ` — ${codeKind.kindNm}` : ''}`} width={1100} onCancel={onClose}
      footer={<Button onClick={onClose}>닫기</Button>} destroyOnClose>
      <div style={{ display: 'flex', gap: 12, height: 480 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space>
            <Button type="primary" onClick={groups.retrieve}>조회</Button>
            <Button onClick={groups.addRow} disabled={!sysAdmin}>등록</Button>
            <Button onClick={groups.saveRows} disabled={!sysAdmin}>저장</Button>
            <Button danger onClick={groups.deleteChecked} disabled={!sysAdmin}>삭제</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <AgGridReact<CodeGroup> ref={groups.gridRef} columnDefs={groupCols} {...groups.gridProps}
              onRowClicked={e => { if (e.data && e.data.codeGroupId > 0) setGroup(e.data); }} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space wrap>
            <Input style={{ width: 160 }} readOnly value={company.companyNm} disabled={!sysAdmin}
              suffix={sysAdmin && <SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setLookup('company')} />} />
            <Typography.Text type="secondary">{group ? group.kindGroupCd : '그룹을 선택하세요'}</Typography.Text>
            <Button type="primary" onClick={codes.retrieve}>조회</Button>
            <Button onClick={addCodes} disabled={!sysAdmin}>등록</Button>
            <Button onClick={codes.saveRows} disabled={!sysAdmin}>저장</Button>
            <Button danger onClick={codes.deleteChecked} disabled={!sysAdmin}>삭제</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <AgGridReact<CodeGroup> ref={codes.gridRef} columnDefs={codeCols} {...codes.gridProps} />
          </div>
        </div>
      </div>

      <CompanyLookup open={lookup === 'company'} onCancel={() => setLookup(undefined)}
        onOk={list => { setCompany(list[0]); setLookup(undefined); }} />
      <CodeLookup open={lookup === 'code'} codeKindId={codeKind?.codeKindId} companyId={company.companyId}
        onCancel={() => setLookup(undefined)}
        onOk={list => {
          setLookup(undefined);
          codes.addRows(list.map(c => ({
            codeKindId: codeKind!.codeKindId, kindGroupCd: group!.kindGroupCd, kindGroupNm: group!.kindGroupNm,
            codeId: c.codeId, code: c.code, name: c.name,
          })));
        }} />
    </Modal>
  );
};
