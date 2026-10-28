/**
 * 상세 관리 컴포넌트 (R09) — Ast02_Grid_DetailManagement
 * AS-IS: myApp/client/vi/ast/Ast02_Grid_DetailManagement.java (383줄)
 */
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Splitter } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { AstClassTree, AstItemDetail, AstItemDetailSaveReq } from '@/types/ast';
import { Ast02_Lookup_Detail } from './Ast02_Lookup_Detail';
import { Ast03_Lookup_CfInfo } from './Ast03_Lookup_CfInfo';
import { Ast10_Grid_Manager, Ast10GridManagerHandle } from './Ast10_Grid_Manager';

export interface Ast02GridDetailManagementHandle {
  loadNode: (node: AstClassTree) => void;
  visible: () => void;
  clear: () => void;
}

interface Ast02GridDetailManagementProps {
  /** 저장한 내용(content)을 부른 쪽 트리 목록에도 반영 — 같은 종목을 다시 고르면 저장한 내용이 보여야 한다 */
  onContentSaved?: (classTreeId: number, content: string) => void;
}

const gb = gbFor<AstItemDetail>();

export const Ast02_Grid_DetailManagement = forwardRef<Ast02GridDetailManagementHandle, Ast02GridDetailManagementProps>(
  ({ onContentSaved }, ref) => {
    const [node, setNode] = useState<AstClassTree | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [content, setContent] = useState('');
    const [editorKey, setEditorKey] = useState(0);

    // 모달 상태
    const [cfModalOpen, setCfModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const managerRef = useRef<Ast10GridManagerHandle>(null);
    const nodeRef = useRef<AstClassTree | null>(null);
    nodeRef.current = node;

    // AS-IS update() 검사 — 순번·항목 필수
    const validateRows = (changed: AstItemDetail[]): string | undefined => {
      for (const model of changed) {
        if (model.seq == null) return '순번을 입력해주세요';
        if (model.title == null || model.title === '') return '항목을 입력해주세요';
      }
      return undefined;
    };

    const crud = useGridCrud<AstItemDetail>({
      idField: 'detailId',
      validate: validateRows,
      deleteConfirm: (n) => `${n}건의 항목을 삭제하시겠습니까?`,
      search: useCallback(async () => {
        const active = nodeRef.current;
        if (!active?.classTreeId) return [];
        return astApi.getItemDetails(active.classTreeId);
      }, []),
      save: useCallback(async (changed: AstItemDetail[]) => {
        const active = nodeRef.current;
        if (!active?.classTreeId) return [];
        const payload: AstItemDetailSaveReq[] = changed.map((r) => ({
          detailId: r.detailId > 0 ? r.detailId : undefined,
          astClassTreeId: active.classTreeId,
          seq: r.seq,
          title: r.title,
          value: r.value,
          note: r.note,
          useYn: r.useYn ?? 'true',
          defaultYn: r.defaultYn ?? 'false',
          tag: r.tag,
        }));
        return astApi.saveItemDetails(payload);
      }, []),
      remove: astApi.deleteItemDetails,
      newRow: useCallback(
        () => ({
          astClassTreeId: nodeRef.current?.classTreeId ?? 0,
          useYn: 'true',
          defaultYn: 'false',
        }),
        []
      ),
      reloadAfterSave: true,
    });

    // [E1] retrieveButton[조회].Select (L106) → retrieve()
    const retrieve = useCallback(
      async (targetNode?: AstClassTree | null) => {
        const activeNode = targetNode ?? nodeRef.current;
        if (!activeNode || !activeNode.classTreeId) {
          crud.clear();
          setContent('');
          setEditorKey((k) => k + 1);
          return;
        }
        setEnabled(true);
        setNode(activeNode);
        nodeRef.current = activeNode;
        setContent(activeNode.content || '');
        setEditorKey((k) => k + 1);
        managerRef.current?.retrieve(activeNode.classTreeId);
        await crud.retrieve();
      },
      [crud.clear, crud.retrieve]
    );

    const loadNode = useCallback(
      (selectedNode: AstClassTree) => {
        retrieve(selectedNode);
      },
      [retrieve]
    );

    // visible() L218-220: this.setEnabled(false)
    const visible = useCallback(() => {
      setEnabled(false);
    }, []);

    const clear = useCallback(() => {
      setEnabled(false);
      setNode(null);
      nodeRef.current = null;
      crud.clear();
      setContent('');
      setEditorKey((k) => k + 1);
      managerRef.current?.clear();
    }, [crud.clear]);

    useImperativeHandle(ref, () => ({
      loadNode,
      visible,
      clear,
    }));

    // [E5] addButton[항목추가].Select (L141) → insert()
    const insert = () => {
      if (!node) {
        message.warning('좌측 자산종목을 선택해주세요');
        return;
      }
      setDetailModalOpen(true);
    };

    const handleSelectTemplates = (templates: AstItemDetail[]) => {
      if (!node) return;
      const inits: Partial<AstItemDetail>[] = templates.map((t) => ({
        astClassTreeId: node.classTreeId,
        title: t.title,
        value: '',
        note: '',
        useYn: 'true',
        defaultYn: 'false',
        tag: t.tag,
      }));
      crud.addRows(inits, true);
    };

    // [E4] cfButton[현금흐름표].Select [classTreeModel == null] (L124) → retrieve()
    const openCfInfo = () => {
      if (!node) {
        message.warning('좌측 자산종목을 선택해주세요');
        return;
      }
      setCfModalOpen(true);
    };

    // [E3] deleteButton[삭제].Select (L118) → deleteRow()
    // [E6] msgBox.DialogHide [YES] (L337) → delete(): deleteConfirm 확인 뒤 DELETE
    const deleteRow = () => {
      if ((crud.gridRef.current?.api?.getSelectedRows().length ?? 0) === 0) {
        message.warning('삭제할 항목을 선택해주세요');
        return;
      }
      crud.deleteChecked();
    };

    // [E2] updateButton[저장].Select (L112) → update()
    // 순서: 그리드 검사 → 종목 내용 저장(modelUpdate) → 그리드 저장(GridUpdate)
    const update = async () => {
      if (!node) return;
      crud.gridRef.current?.api?.stopEditing();
      const invalid = validateRows(crud.getChanged());
      if (invalid) {
        message.warning(invalid);
        return;
      }

      try {
        await astApi.updateItemClass(node.classTreeId, {
          classTreeId: node.classTreeId,
          content,
          itemLClassCode: node.itemLClassCode,
          itemMClassCode: node.itemMClassCode,
          itemSClassCode: node.itemSClassCode,
          itemDClassCode: node.itemDClassCode,
          accountType: node.accountType,
          trUnit: node.trUnit,
          issueDate: node.issueDate,
          matDate: node.matDate,
          corpId: node.corpId,
          curCode: node.curCode,
          depnYear: node.depnYear,
          depnRate: node.depnRate,
          depnType: node.depnType,
          evalType: node.evalType,
        });
      } catch (e) {
        message.error(errorMessage(e));
        return;
      }
      const saved = { ...node, content };
      setNode(saved);
      nodeRef.current = saved;
      onContentSaved?.(node.classTreeId, content);

      // 그리드에 바뀐 행이 없으면 완료 메시지만, 있으면 saveRows가 건수와 함께 알린다(실패하면 그쪽에서 오류를 알린다)
      if (crud.getChanged().length === 0) {
        message.success('저장이 완료되었습니다.');
        return;
      }
      await crud.saveRows();
    };

    // buildGrid 컬럼 (L205-216)
    const columns: ColDef<AstItemDetail>[] = useMemo(
      () => [
        gb.longCenter('seq', 70, '순번', { editor: 'number' }),
        gb.textCenter('title', 120, '항목', { editor: 'text' }),
        gb.textArea('value', 350, '정보', { editor: 'largeText' }),
        gb.textArea('note', 350, '비고', { editor: 'largeText' }),
      ],
      []
    );

    const isDisabled = !enabled || !node;

    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          border: '1px solid #d9d9d9',
          padding: 10,
          gap: 8,
          opacity: isDisabled ? 0.6 : 1,
          pointerEvents: isDisabled ? 'none' : 'auto',
        }}
      >
        {/* 상단 50%: 툴바 + 상세 그리드 (center=form) */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #d9d9d9',
            padding: 8,
            gap: 8,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {/* [E1] retrieveButton[조회].Select */}
              <Button type="search" onClick={() => retrieve()} disabled={isDisabled}>
                조회
              </Button>
              {/* [E3] deleteButton[삭제].Select */}
              <Button type="delete" onClick={deleteRow} disabled={isDisabled}>
                삭제
              </Button>
              {/* [E5] addButton[항목추가].Select */}
              <Button type="register" onClick={insert} disabled={isDisabled}>
                항목추가
              </Button>
            </div>
            <div>
              {/* [E4] cfButton[현금흐름표].Select */}
              <Button type="register" onClick={openCfInfo} disabled={isDisabled}>
                현금흐름표
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<AstItemDetail>
              crud={crud}
              columnDefs={columns}
              rowNumber={false}
            />
          </div>
        </div>

        {/* 하단 50%: 좌측 HtmlEditor (0.7) + 우측 담당자 그리드 (0.3) + 하단 저장 버튼 */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <Splitter style={{ height: '100%' }}>
              <Splitter.Panel defaultSize="70%" style={{ paddingRight: 6, boxSizing: 'border-box' }}>
                <HtmlEditor key={editorKey} value={content} onChange={setContent} />
              </Splitter.Panel>
              <Splitter.Panel
                defaultSize="30%"
                style={{
                  paddingLeft: 6,
                  border: '1px solid #d9d9d9',
                  padding: 8,
                  boxSizing: 'border-box',
                }}
              >
                <Ast10_Grid_Manager ref={managerRef} />
              </Splitter.Panel>
            </Splitter>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* [E2] updateButton[저장].Select */}
            <Button type="save" onClick={update} disabled={isDisabled}>
              저장
            </Button>
          </div>
        </div>

        {/* 기본항목 조회/추가 모달 */}
        <Ast02_Lookup_Detail
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onSelect={handleSelectTemplates}
        />

        {/* 현금흐름표 모달 */}
        <Ast03_Lookup_CfInfo
          open={cfModalOpen}
          classTreeModel={node}
          onClose={() => {
            setCfModalOpen(false);
            if (node) retrieve(node);
          }}
        />
      </div>
    );
  }
);

Ast02_Grid_DetailManagement.displayName = 'Ast02_Grid_DetailManagement';
