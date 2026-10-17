/**
 * Table Spec의 컬럼 주석 탭 (오른쪽) — Dbm01_Tab_TabComments가 테이블을 고르면 retrieve(tableName)을 부른다.
 * AS-IS: myApp/client/vi/dbm/Dbm02_TabPage_ColComments.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L41-120: 헤더 없는 패널 = 셀 편집 그리드(Column ID 250 · Comment 300 · Type 80 · Null 60 · Length 60, 체크 단일) + 아래 가운데 버튼줄
 *   XML · Model · Properties · GridBuilder · Table Print · Report Print · RD Print · Comment Save
 * 미변환(작업기록 의존): XML·Model·Properties·GridBuilder·Comment Save는 DB 프로시저(sp_Java*·sp_DDLRun)가 asseterpdb에 없어 서버가 거절,
 *   Table Print는 서버 PDF(Dbm02_ColCommentsPDF), Report Print는 dcr 도메인(Dcr10_MailSenderPDF)
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { dbmApi } from '@/api/dbm';
import { errorMessage } from '@/api/client';
import { DbColumn, DbSourceKind } from '@/types/dbm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Dbm02_PopupSourceGenerator } from './Dbm02_PopupSourceGenerator';

const gb = gbFor<DbColumn>();

const NEW_ROW: Partial<DbColumn> = {};

export interface Dbm02_TabPage_ColCommentsHandle {
  /** AS-IS retrieve(tableName) L150-155 */
  retrieve: (tableName: string) => void;
}

export const Dbm02_TabPage_ColComments = forwardRef<Dbm02_TabPage_ColCommentsHandle>((_props, ref) => {
  const tableName = useRef<string | undefined>(undefined);  // AS-IS 필드 tableName
  const [source, setSource] = useState<string | null>(null);  // Dbm02_PopupSourceGenerator의 문자열

  // [E0] 화면 열림 (생성자 L41-120) → 초기화 (버튼줄 구성)
  const crud = useGridCrud<DbColumn>({
    idField: 'columnId',
    // retrieve(tableName) L150-155: 서비스 dbm.Dbm02_ColComments.selectByTableName
    search: useCallback(() => (tableName.current ? dbmApi.searchColumns(tableName.current) : Promise.resolve([])), []),
    // update() L157-160: 서비스 dbm.Dbm02_ColComments.update(변경 행) — 서버가 거절한다
    save: async rows => { await dbmApi.updateColumnComments(rows); return rows; },
    // 행 추가·삭제 버튼이 없다
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  useImperativeHandle(ref, () => ({
    retrieve: name => { tableName.current = name; crud.retrieve(); },
  }), [crud.retrieve]);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L122-134
  const columnDefs = useMemo(() => [
    gb.text('columnName', 250, 'Column ID'),  // L127
    gb.text('columnComment', 300, 'Comment', { editor: 'text' }),  // L128
    gb.text('dataType', 80, 'Type'),  // L129
    gb.text('nullAble', 60, 'Null'),  // L130
    gb.text('columnLength', 60, 'Length'),  // L131
  ], []);

  // popupXML() L162-170 · popupModel() L172-180 · popupProperties() L182-190 · popupGridBuilder() L192-201 (inOut = 1)
  // → ServiceCall.execute(…, this) → getServiceResult() L136-148: 실패면 오류 알림, 결과(오류 문구 포함)를 Dbm02_PopupSourceGenerator "Generating"으로 연다
  const popup = async (kind: DbSourceKind) => {
    if (!tableName.current) return;
    try {
      setSource(await dbmApi.generateSource(tableName.current, kind));
    } catch (err) {
      const msg = errorMessage(err, '소스 생성 실패');
      message.error(msg);
      setSource(msg);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<DbColumn> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Space wrap>
          {/* [E1] xmlGeneratorButton[XML].Select (L45) → popupXML() */}
          <Button onClick={() => popup('xml')}>XML</Button>
          {/* [E2] modelGeneratorButton[Model].Select (L53) → popupModel() */}
          <Button onClick={() => popup('model')}>Model</Button>
          {/* [E3] modelPropertiesButton[Properties].Select (L61) → popupProperties() */}
          <Button onClick={() => popup('properties')}>Properties</Button>
          {/* [E4] gridBuilderButton[GridBuilder].Select (L69) → popupGridBuilder() */}
          <Button onClick={() => popup('grid-builder')}>GridBuilder</Button>
          {/* [E5] retrievePDFButton[Table Print].Select (L77-84) → PDFViewer.open("className=dbm.Dbm02_ColCommentsPDF&tableName=" + tableName) — 서버 PDF 출력 미변환 */}
          <Button onClick={() => message.warning('Table Print: 서버 PDF 출력(Dbm02_ColCommentsPDF)이 아직 변환되지 않았습니다')}>Table Print</Button>
          {/* [E6] retrievePDF2Button[Report Print].Select (L87-94) → PDFViewer.open("className=dcr.Dcr10_MailSenderPDF") — dcr 도메인 미변환 */}
          <Button onClick={() => message.warning('Report Print: 서버 PDF 출력(Dcr10_MailSenderPDF)이 아직 변환되지 않았습니다')}>Report Print</Button>
          {/* [E7] retrieveRDButton[RD Print].Select (L97-108) → 원본 본문이 모두 주석 처리되어 아무 일도 하지 않는다 */}
          <Button onClick={() => undefined}>RD Print</Button>
          {/* [E8] updateButton[Comment Save].Select (L111) → update() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>Comment Save</Button>
        </Space>
      </div>
      <Dbm02_PopupSourceGenerator text={source} onClose={() => setSource(null)} />
    </div>
  );
});
Dbm02_TabPage_ColComments.displayName = 'Dbm02_TabPage_ColComments';
