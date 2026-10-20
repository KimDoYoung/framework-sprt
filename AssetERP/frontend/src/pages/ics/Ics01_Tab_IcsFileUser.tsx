/**
 * [1009] 준법감시 > 00. 법규정보 > 법규보고 서식파일 (H07)
 * AS-IS: myApp/client/vi/ics/Ics01_Tab_IcsFileUser.java (135줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-79: center=세로(툴바 49 + 그리드) — 검색 300 · [조회]. 그리드(체크박스 단일 선택): 법령구분 150 · 내용 150 · 등록일 100 · 서식파일 500 · 다운로드 80(아이콘)
 * 열 때 바로 조회한다(생성자 L78 retrieve()). 관리자용 짝은 `Ics01_Tab_IcsFileUpload`(E02, #1107)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8). 초기화(UX-02)는 조건이 하나라 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { icsApi } from '@/api/ics';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { IcsFormFile } from '@/types/ics';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcsFormFile>();

export const Ics01_Tab_IcsFileUser: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcsFormFile[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E1] retrieveButton[조회].Select (L42)·[E2] searchTextField.KeyPress [Enter] (L48) → retrieve() L106-130: sys.Sys10_File.getIcsFile(parentId 0, lawType null)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // fileGrid.mask()
    try {
      const list = await icsApi.searchFormFilesUser(searchText);
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L40-79) → show(), retrieve()
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildApprFileGrid() L81-104
  const columnDefs = useMemo(() => [
    gb.text('lawName', 150, '법령구분'),  // L97
    gb.text('note', 150, '내용'),  // L98
    gb.date('regDate', 100, '등록일'),  // L99
    gb.text('fileName', 500, '서식파일'),  // L100
    // L101 downloadCell(Down): FileDownload?fileType=file&fileId=
    iconCell<IcsFormFile>('down', 'actionCellDown', 80, '다운로드', row => {
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => retrieve()} searchText="조회" loading={loading}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcsFormFile>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
    </div>
  );
};
