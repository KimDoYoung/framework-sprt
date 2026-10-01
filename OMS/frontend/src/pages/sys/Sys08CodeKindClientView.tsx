import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space, Splitter, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sysApi } from '../../api/sys';
import { errorMessage } from '../../api/client';
import { CodeKind, SysCompany } from '../../types/sys';
import { isSysAdmin, useLoginUser } from '../../hooks/useLoginUser';
import { CodeGrid } from '../../components/sys/CodeGrid';
import { CompanyLookup } from '../../components/lookup/CompanyLookup';

/**
 * 고객사 공통코드 (AS-IS client/vi/sys/Sys08_Tab_CodeKindClient): 시스템이 아닌 코드종류 + 회사 코드 편집.
 * KFS 관리자는 회사를 골라 그 회사 코드를 보고, 선택한 코드종류를 다른 회사들에 복사할 수 있다.
 */
export const Sys08CodeKindClientView: React.FC = () => {
  const user = useLoginUser();
  const sysAdmin = isSysAdmin(user);
  const gridRef = useRef<AgGridReact<CodeKind>>(null);
  const [kindNm, setKindNm] = useState('');
  const [kinds, setKinds] = useState<CodeKind[]>([]);
  const [kind, setKind] = useState<CodeKind>();
  const [company, setCompany] = useState<{ companyId: number; companyNm: string }>({ companyId: user.companyId, companyNm: user.companyName });
  const [lookup, setLookup] = useState<'company' | 'copy'>();

  const retrieve = useCallback(async () => {
    try {
      setKinds(await sysApi.searchCodeKinds(kindNm, 'false'));
    } catch (err) {
      message.error(errorMessage(err, '코드종류 조회 실패'));
    }
  }, [kindNm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  const openCopy = () => {
    if (!kind) {
      message.warning('복사할 코드를 선택해주세요');
      return;
    }
    setLookup('copy');
  };

  const copy = (targets: SysCompany[]) => {
    setLookup(undefined);
    Modal.confirm({
      title: '코드 복사',
      content: `${targets.length}개의 회사에 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.copyCodes(kind!.codeKindId, company.companyId, targets.map(t => t.companyId));
          message.success('코드 복사가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '코드 복사 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo<ColDef<CodeKind>[]>(() => [
    { field: 'kindCd', headerName: '구분코드', width: 150 },
    { field: 'kindNm', headerName: '코드구분', width: 180 },
    { field: 'sysYn', headerName: '시스템', width: 80, cellDataType: 'boolean' },
    { field: 'note', headerName: '상세설명', flex: 1, minWidth: 200 },
  ], []);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="45%" min="25%" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          {sysAdmin && (
            <>
              <Typography.Text strong>회사명</Typography.Text>
              <Input style={{ width: 160 }} readOnly value={company.companyNm}
                suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setLookup('company')} />} />
            </>
          )}
          <Typography.Text strong>코드구분명</Typography.Text>
          <Input style={{ width: 150 }} value={kindNm} allowClear onChange={e => setKindNm(e.target.value)} onPressEnter={retrieve} />
          <Button type="primary" onClick={retrieve}>조회</Button>
          {sysAdmin && <Button onClick={openCopy}>코드복사</Button>}
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<CodeKind>
            ref={gridRef}
            rowData={kinds}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.codeKindId)}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelectionChanged={e => setKind(e.api.getSelectedRows()[0])}
          />
        </div>
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <CodeGrid codeKind={kind} companyId={company.companyId} editable />
      </Splitter.Panel>

      <CompanyLookup
        open={lookup != null}
        multiple={lookup === 'copy'}
        onCancel={() => setLookup(undefined)}
        onOk={list => {
          if (lookup === 'copy') copy(list);
          else { setCompany(list[0]); setLookup(undefined); }
        }}
      />
    </Splitter>
  );
};
