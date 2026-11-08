/**
 * 양식 창 (V05) — 상신 편집창의 [양식]이 연다. 문서분류에 연결된 문서양식(또는 [전체보기]로 모든 양식)을 골라 상신내용 본문에 넣는다.
 * AS-IS: myApp/client/vi/dcr/Dcr05_Lookup_FormView.java (281줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * [E0] 화면 열림 (생성자 L77-79) → init() L87-187: 800×700 모달 "양 식", 위 [구분 콤보 150][검색 200]["전체보기" 체크][조회], 그리드(구분 150 · 양식 제목 340 · 비고 250), 아래 안내 + 미리보기, 푸터 [확인][닫기]
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDocForm } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprDocForm>();

interface Props {
  /** AS-IS Dcr05_Lookup_FormView(classTreeId, callback) — 값이 있으면 열린다 */
  open: boolean;
  classTreeId: number | null;
  /** [확인] — callback.execute(html): 고른 양식의 본문 */
  onResult: (html: string) => void;
  onClose: () => void;
}

export const Dcr05_Lookup_FormView: React.FC<Props> = ({ open, classTreeId, onResult, onClose }) => {
  const [formClassCode, setFormClassCode] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [all, setAll] = useState(false);
  const [rows, setRows] = useState<AprDocForm[]>([]);
  const [selected, setSelected] = useState<AprDocForm | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // retrieve() L204-231: [전체보기]면 selectByName, 아니면 selectByClassTreeId
  const retrieve = useCallback(async (code: string, text: string, allView: boolean) => {
    setLoading(true);
    try {
      setRows(await aprAttachApi.docForms({ classTreeId, all: allView, searchText: text, formClassCode: code }));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [classTreeId]);

  // init() L87-187 끝: 열리면 바로 조회
  useEffect(() => {
    if (!open) return;
    setFormClassCode('%'); setSearchText(''); setAll(false); setSelected(undefined);
    void retrieve('%', '', false);
  }, [open, retrieve]);

  // [E4] insertButton[확인].Select (L126) → insert() L247-255: 고른 양식이 없으면 "양식을 선택해주세요"
  const insert = () => {
    if (!selected) {
      Modal.info({ title: '확인', content: '양식을 선택해주세요', okText: '확인' });
      return;
    }
    onResult(selected.content ?? '');
  };

  const columnDefs = useMemo(() => [
    gb.text('formClassName', 150, '구분'),  // L145
    gb.text('title', 340, '양식 제목'),  // L146
    gb.text('note', 250, '비고'),  // L147
  ], []);

  return (
    <LookupModal
      open={open}
      title="양 식"
      width={880}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="select" onClick={insert}>확인</Button>
          {/* [E5] closeButton[닫기].Select (L132) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] docFormClassComboBox.Collapse (L103) · [E2] searchText.KeyPress [Enter] (L112) · [E3] searchButton[조회].Select (L120) → retrieve() */}
        <SearchBar onSearch={() => retrieve(formClassCode, searchText, all)} searchText="조회" loading={loading}>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="DocFormClassCode" altCode={['%', '전체']} style={{ width: 150 }} value={formClassCode}
              onChange={c => { const v = c ?? '%'; setFormClassCode(v); void retrieve(v, searchText, all); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="양식제목을 입력해주세요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox checked={all} onChange={e => setAll(e.target.checked)}>전체보기</Checkbox>
        </SearchBar>
        <div style={{ height: 'min(220px, calc(100vh - 560px))', minHeight: 140 }}>
          <SingleGrid<AprDocForm>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.docTypeId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            onSelect={setSelected}
          />
        </div>
        <div style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}> ● 미리보기 화면과 실제 화면은 차이가 있을 수 있습니다 ● </div>
        {/* [E6] grid.Selection (L138) → setHtml(): 고른 양식의 본문을 아래에 보인다 */}
        <HtmlView html={selected?.content ?? ''} height={260} />
      </div>
    </LookupModal>
  );
};
