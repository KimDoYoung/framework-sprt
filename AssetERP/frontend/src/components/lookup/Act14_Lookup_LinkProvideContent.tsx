/**
 * 계정과목연결 조회창 — Biz01_Tab_CardManagement(#1141)의 [계정과목연결]이 연다 (다른 도메인에서도 쓰는 조회창).
 * AS-IS: myApp/client/vi/act/Act14_Lookup_LinkProvideContent.java (359줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * open() L69-100: 모달 810×390, 제목 "계정과목연결", 툴바(제공목적 콤보 · 제공내역 콤보 · [조회][등록][삭제]) + 체크박스 다중 그리드(계정과목코드 130 · 계정과목명 530 · ▲ · ▼) + [닫기]
 * 제공목적은 ProvidePurCode002 코드그룹(setting() L102-109), 제공내역은 목적코드로 시작하는 ProvideContentCode(L110-133)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Modal, Select } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { ActCodeOption, ActLinkContent, AccountCode } from '@/types/act';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Act01_Lookup_AccountCode } from '@/components/lookup/Act01_Lookup_AccountCode';

const gb = gbFor<ActLinkContent>();

/** ▲▼ 셀 (AS-IS addCellNotSort(ImageCell("▲"/"▼")) L223-224) — 누른 행을 한 칸 옮긴다 */
function moveCol(colId: 'up' | 'down', label: string, onClick: (row: ActLinkContent) => void) {
  return {
    colId,
    width: 30,
    headerName: '',
    headerClass: 'gb-hdr',
    editable: false,
    sortable: false,
    cellStyle: { padding: 0, textAlign: 'center' },
    cellRenderer: (p: { data?: ActLinkContent }) => (
      <AntButton type="text" size="small" onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }}>{label}</AntButton>
    ),
  };
}

interface Props {
  open: boolean;
  /** 닫기: hide()만 */
  onClose: () => void;
}

export const Act14_Lookup_LinkProvideContent: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<ActLinkContent>>(null);
  const [purposeCode, setPurposeCode] = useState<string>();
  const [contentCode, setContentCode] = useState<string>();
  const [contents, setContents] = useState<ActCodeOption[]>([]);
  const [rows, setRows] = useState<ActLinkContent[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);

  // open() L69-100: 열 때마다 새 창 — 입력을 비운다
  useEffect(() => {
    if (!open) return;
    setPurposeCode(undefined);
    setContentCode(undefined);
    setContents([]);
    setRows([]);
  }, [open]);

  // retrieve() L229-253: 제공목적·제공내역을 고르지 않았으면 안내, 있으면 act.Act14_Link.selectByProvideContentCode
  const retrieve = useCallback(async (content: string | undefined = contentCode) => {
    if (!purposeCode) { message.warning('제공목적을 선택해주시길 바랍니다.'); return; }
    if (!content) { message.warning('제공내역을 선택해주시길 바랍니다.'); return; }
    try {
      setRows(await actApi.searchLinksByContent(content));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [purposeCode, contentCode]);

  // [E1] providePurName.Collapse [값 바뀜] (L110-133) → 제공내역을 비우고 sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%)
  const onPurposeChange = async (code?: string) => {
    setPurposeCode(code);
    setContentCode(undefined);
    setContents([]);
    if (!code) return;
    try {
      setContents(await actApi.searchProvideContents(code));
    } catch (err) {
      message.error(errorMessage(err, '제공내역 조회 실패'));
    }
  };

  // [E2] provideContentName.Collapse [값 바뀜] (L137-156) → 값이 있으면 retrieve()
  const onContentChange = (code?: string) => {
    setContentCode(code);
    if (code) void retrieve(code);
  };

  // [E4] insertButton[등록].Select (L165-186): 목적·내역 확인 → Act01_Lookup_AccountCode.openCompanyId(로그인 회사)
  const insertRow = () => {
    if (!purposeCode) { message.warning('제공목적을 선택해주시길 바랍니다.'); return; }
    if (!contentCode) { message.warning('제공내역을 선택해주시길 바랍니다.'); return; }
    setAccountOpen(true);
  };

  // insertAccount() L305-322: 조회순서 = 현재 행 수 + 1 → act.Act14_Link.modelUpdate → retrieve()
  const insertAccount = async (account: AccountCode) => {
    setAccountOpen(false);
    try {
      await actApi.addLinkByContent(account.accountCode, contentCode!, rows.length + 1);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // changeRow() L255-274 · getSeq() L276-303: 한 칸 위/아래로 옮기고 보이는 순서대로 조회순서를 1부터 다시 매겨 저장한다
  // (원본은 선택한 행을 옮기지만 ▲▼ 셀이 그 행을 선택하므로 누른 행을 옮긴다 — Act01_Edit_AccountCode와 같다)
  const changeRow = (row: ActLinkContent, code: 'up' | 'down') => {
    const idx = rows.findIndex(r => r.linkId === row.linkId);
    const to = code === 'up' ? idx - 1 : idx + 1;
    if (idx < 0 || to < 0 || to >= rows.length) return;
    const next = [...rows];
    next.splice(idx, 1);
    next.splice(to, 0, row);
    setRows(next.map((r, i) => ({ ...r, seq: i + 1 })));
    actApi.orderLinks(next.map(r => r.linkId)).catch(err => message.error(errorMessage(err, '저장 실패')));
  };

  // [E5] deleteButton[삭제].Select (L188) → deleteRow() L324-350: 선택 없으면 안내 → 확인창 → act.Act14_Link.delete (E7)
  const deleteRow = () => {
    const checked = gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 정보를 선택해주세요'); return; }
    Modal.confirm({
      title: '확인',
      content: '선택한 정보를 삭제하시겠습니까?',
      width: 380,
      okText: '예',
      cancelText: '아니오',
      // [E7] msgBox.DialogHide [YES] (L332) → GridDeleteData.delete(act.Act14_Link.delete)
      onOk: async () => {
        try {
          await actApi.deleteLinks(checked.map(r => r.linkId));
          const gone = new Set(checked.map(r => r.linkId));
          setRows(list => list.filter(r => !gone.has(r.linkId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.text('accountCode', 130, '계정과목코드'),  // L221
    gb.textArea('accountName', 530, '계정과목명'),  // L222
    moveCol('up', '▲', row => changeRow(row, 'up')),  // L223
    moveCol('down', '▼', row => changeRow(row, 'down')),  // L224
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [rows]);

  return (
    <>
      {/* 열 폭 합계 130+530+30+30 = 720 + 행번호·체크 60 + 여백 130 = 910 (03 원칙 21) */}
      <LookupModal open={open} title="계정과목연결" width={910} maskClosable={false} onCancel={onClose} destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E6] closeButton[닫기].Select (L195) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 390, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>제공목적</span>
            <SystemCodeComboBox kindGroupCd="ProvidePurCode002" placeholder="선택" style={{ width: 160 }}
              value={purposeCode} onChange={code => void onPurposeChange(code)} />
            <span style={{ marginLeft: 8 }}>제공내역</span>
            <Select<string> placeholder="선택" allowClear style={{ width: 260 }}
              value={contentCode} onChange={onContentChange}
              options={contents.map(c => ({ value: c.code, label: c.name }))} />
            {/* [E3] retrieveButton[조회].Select (L158) → retrieve() */}
            <Button type="search" onClick={() => void retrieve()}>조회</Button>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(MULTI) L220 — 삭제용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
            <MultiGrid<ActLinkContent>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.linkId)}
            />
          </div>
        </div>
      </LookupModal>
      <Act01_Lookup_AccountCode open={accountOpen} onResult={insertAccount} onClose={() => setAccountOpen(false)} />
    </>
  );
};
