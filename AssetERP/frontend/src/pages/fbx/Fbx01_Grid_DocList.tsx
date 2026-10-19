/**
 * 파일조회의 파일 목록 (F12) — Fbx01_Tab_Search 가운데
 * AS-IS: myApp/client/vi/fbx/Fbx01_Grid_DocList.java (202줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L50-107: 툴바(문서분류/파일명 300 · 등록자 100 · [검색]) + 파일 그리드(체크박스 단일)
 * 미리보기는 파일 공통 Sys10_Lookup_FileViewer (다른 도메인 부품, 이미 변환됨)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 원본에 초기화가 없어 UX-02는 넣지 않는다
 */
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { fbxApi } from '@/api/fbx';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { FbxFile } from '@/types/fbx';
import { FileInfo } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar, useSearchParams } from '@/components/search';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';

const gb = gbFor<FbxFile>();

export interface Fbx01_Grid_DocListHandle {
  /** AS-IS retrieve(boxId) — 보관함을 고르면 부른다 */
  retrieve: (boxId: number) => void;
}

export const Fbx01_Grid_DocList = forwardRef<Fbx01_Grid_DocListHandle>((_props, ref) => {
  // [E0] 화면 열림 (생성자 L50-107) → 초기화: regEmpName.setEmptyText("등록자"), 자동 조회는 없다
  const sp = useSearchParams(() => ({ fileName: '', regEmpName: '' }));
  const [rows, setRows] = useState<FbxFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const boxId = useRef<number | null>(null);
  const seq = useRef(0);

  // retrieve() L161-197: fbx.Fbx03_File.selectByBoxId(boxId, orgId, empId, companyId, fileName, regEmpName) — 조직·사원·회사는 서버가 세션에서, 빈 값은 서버가 %로
  const retrieve = async (id: number | null = boxId.current) => {
    boxId.current = id;
    if (id == null) return;
    const my = ++seq.current;
    setLoading(true);
    try {
      const { fileName, regEmpName } = sp.current.current;
      const list = await fbxApi.searchFilesByBox(id, fileName, regEmpName);
      if (my === seq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    retrieve: id => void retrieve(id),
  }));

  // viewCell("View") L111-138: sys.Sys10_File.selectByParentId(parentId = 파일 ID) → 첫 행으로 Sys10_Lookup_FileViewer.open
  const viewRow = async (row: FbxFile) => {
    try {
      const list = await fileApi.searchByParentId(row.fileId);
      if (list.length > 0) setViewFile(list[0]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // downloadCell("Down") L110-120: FileDownload?fileType=fbxFile&fileId&boxId&empId&orgId (서버가 기록 04를 남김)
  const downRow = async (row: FbxFile) => {
    try {
      await fbxApi.downloadFile(row.boxId, row.fileId);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // buildGrid() L109-159 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('crtDate', 100, '등록일'),  // L151
    gb.text('dcrClassName', 600, '문서분류'),  // L152
    gb.text('fileName', 400, '파일명'),  // L153
    gb.textCenter('empName', 100, '등록자'),  // L154
    iconCell<FbxFile>('view', 'actionCell01', 80, '미리보기', row => void viewRow(row)),  // L155
    iconCell<FbxFile>('down', 'actionCell02', 80, '파일받기', row => void downRow(row)),  // L156
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* [E1] fileName.KeyPress [Enter] (L79) · [E2] regEmpName.KeyPress [Enter] (L87) · [E3] retrieveButton[검색].Select (L95) → retrieve(boxId) */}
      <SearchBar onSearch={() => retrieve()} searchText="검색" loading={loading}>
        <SearchBar.Field label="문서분류/파일명">
          <SearchBar.Input style={{ width: 300 }} value={sp.values.fileName} onChange={e => sp.set('fileName', e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="등록자">
          <SearchBar.Input style={{ width: 100 }} placeholder="등록자" value={sp.values.regEmpName} onChange={e => sp.set('regEmpName', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<FbxFile>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.fileId)}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
    </div>
  );
});
Fbx01_Grid_DocList.displayName = 'Fbx01_Grid_DocList';
