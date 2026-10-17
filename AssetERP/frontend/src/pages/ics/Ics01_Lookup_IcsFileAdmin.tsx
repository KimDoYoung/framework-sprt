/**
 * 서식파일 불러오기 창 (E01) — Ics01_Lookup_IcsFile의 [불러오기]에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_IcsFileAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-87: 모달 900×650 "불러오기", 위 툴바(검색 · 검색칸 400 "법령구분/내용/서식파일" · [조회]) + 그리드(체크박스 다중), 아래 가운데 [확인][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsFormFile } from '@/types/ics';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcsFormFile>();

interface Props {
  /** open(callback) L54-56 — 값이 true면 열린다 */
  open: boolean;
  /** callback.execute(selectList) */
  onSelect: (selected: IcsFormFile[]) => void;
  onClose: () => void;
}

export const Ics01_Lookup_IcsFileAdmin: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const [rows, setRows] = useState<IcsFormFile[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<IcsFormFile>>(null);

  // retrieve() L148-163: 서비스 sys.Sys10_File.getIcsFile(parentId 0, lawType null, "%검색어%", firstRegDateYn true)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await icsApi.searchFormFiles(searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  // [E0] 화면 열림 (생성자 L58-87) → Settings(), show(), retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => { if (open) { setSearchText(''); setRows([]); } }, [open]);
  useEffect(() => { if (open) void retrieveRef.current(); }, [open]);

  // buildGrid() L123-146
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L139
    gb.text('lawName', 150, '법령구분'),  // L140
    gb.text('note', 150, '내용'),  // L141
    gb.text('fileName', 350, '서식파일'),  // L142
    // L143 downloadCell: FileDownload?fileType=file&fileId=
    iconCell<IcsFormFile>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  // [E3] confirmButton[확인].Select (L109) → confirm() L165-187: "서식파일 N건을 불러오시겠습니까?" → [E5] msgBox.DialogHide [YES] (L170) → callback.execute(selectList); hide()
  const confirm = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인',
      content: `서식파일 ${selected.length}건을 불러오시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 450,
      onOk: () => { onSelect(selected); onClose(); },
    });
  };

  return (
    <Modal
      open={open}
      title="불러오기"
      width={940}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] closeButton[닫기].Select (L115) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 500 }}>
        {/* [E1] searchText.KeyPress [Enter] (L93) → retrieve(), [E2] retrieveButton[조회].Select (L103) → retrieve() */}
        <SearchBar onSearch={retrieve} loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 400 }} placeholder="법령구분/내용/서식파일" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<IcsFormFile> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} loading={loading} />
        </div>
      </div>
    </Modal>
  );
};
