/**
 * 상세 관리 컴포넌트 (R09) — Ast02_Grid_DetailManagement
 * AS-IS: myApp/client/vi/ast/Ast02_Grid_DetailManagement.java (383줄)
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Splitter } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { AstClassTree, AstItemDetail, AstItemDetailSaveReq } from '@/types/ast';
import { Ast02_Lookup_Detail } from './Ast02_Lookup_Detail';
import { Ast03_Lookup_CfInfo } from './Ast03_Lookup_CfInfo';
import { Ast10_Grid_Manager, Ast10GridManagerHandle } from './Ast10_Grid_Manager';

export interface Ast02GridDetailManagementHandle {
  loadNode: (node: AstClassTree) => void;
  clear: () => void;
}

interface Ast02GridDetailManagementProps {
  currentNode: AstClassTree | null;
}

const gb = gbFor<AstItemDetail>();

export const Ast02_Grid_DetailManagement = forwardRef<Ast02GridDetailManagementHandle, Ast02GridDetailManagementProps>(
  ({ currentNode }, ref) => {
    const [node, setNode] = useState<AstClassTree | null>(currentNode);
    const [content, setContent] = useState('');
    const [rows, setRows] = useState<AstItemDetail[]>([]);
    const [selectedRows, setSelectedRows] = useState<AstItemDetail[]>([]);
    const [loading, setLoading] = useState(false);

    // 모달 상태
    const [cfModalOpen, setCfModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const managerRef = useRef<Ast10GridManagerHandle>(null);

    // [E1] retrieveButton[조회].Select (L106) → retrieve()
    const retrieve = useCallback(async (targetNode?: AstClassTree | null) => {
      const activeNode = targetNode ?? node;
      if (!activeNode || !activeNode.classTreeId) {
        setRows([]);
        setContent('');
        return;
      }
      setLoading(true);
      try {
        const data = await astApi.getItemDetails(activeNode.classTreeId);
        setRows(data);
        setContent(activeNode.content || '');
      } catch (e) {
        message.error(errorMessage(e));
      } finally {
        setLoading(false);
      }
    }, [node]);

    const loadNode = useCallback((selectedNode: AstClassTree) => {
      setNode(selectedNode);
      retrieve(selectedNode);
      if (managerRef.current) {
        managerRef.current.retrieve(selectedNode.classTreeId);
      }
    }, [retrieve]);

    const clear = useCallback(() => {
      setNode(null);
      setRows([]);
      setContent('');
      if (managerRef.current) {
        managerRef.current.clear();
      }
    }, []);

    useImperativeHandle(ref, () => ({
      loadNode,
      clear,
    }));

    // [E0] 화면 열림 (생성자 L98-102) → settings(), makeLayout()
    useEffect(() => {
      if (currentNode) {
        loadNode(currentNode);
      } else {
        clear();
      }
    }, [currentNode, loadNode, clear]);

    // [E5] addButton[항목추가].Select (L141) → insert()
    const insert = () => {
      if (!node) {
        message.warning('자산 종목을 먼저 선택해주세요.');
        return;
      }
      setDetailModalOpen(true);
    };

    const handleSelectTemplates = (templates: AstItemDetail[]) => {
      if (!node) return;
      const newItems: AstItemDetail[] = templates.map((t, idx) => ({
        detailId: -Date.now() - idx,
        astClassTreeId: node.classTreeId,
        seq: rows.length + idx + 1,
        title: t.title,
        value: '',
        note: '',
        useYn: 'true',
        defaultYn: 'false',
        tag: t.tag,
      }));
      setRows((prev) => [...prev, ...newItems]);
    };

    // [E4] cfButton[현금흐름표].Select [classTreeModel == null] (L124) → retrieve()
    const openCfInfo = () => {
      if (!node) {
        message.warning('자산 종목을 먼저 선택해주세요.');
        return;
      }
      setCfModalOpen(true);
    };

    // [E3] deleteButton[삭제].Select (L118) → deleteRow()
    const deleteRow = () => {
      if (selectedRows.length === 0) {
        message.warning('삭제할 항목을 선택해주세요');
        return;
      }
      // [E6] msgBox.DialogHide [YES] (L337) → delete()
      Modal.confirm({
        title: '항목 삭제',
        content: '선택한 항목을 삭제하시겠습니까?',
        onOk: async () => {
          const persistedIds = selectedRows.filter((r) => r.detailId > 0).map((r) => r.detailId);
          if (persistedIds.length > 0) {
            try {
              await astApi.deleteItemDetails(persistedIds);
              message.success('삭제되었습니다.');
            } catch (e) {
              message.error(errorMessage(e));
              return;
            }
          }
          const selectedSet = new Set(selectedRows.map((r) => r.detailId));
          setRows((prev) => prev.filter((r) => !selectedSet.has(r.detailId)));
          setSelectedRows([]);
        },
      });
    };

    // [E2] updateButton[저장].Select (L112) → update()
    const update = async () => {
      if (!node) return;
      try {
        // 비고/내용 업데이트
        if (content !== node.content) {
          await astApi.updateItemClass(node.classTreeId, {
            classTreeId: node.classTreeId,
            content,
          });
        }
        // 상세 항목 업데이트
        const payload: AstItemDetailSaveReq[] = rows.map((r) => ({
          detailId: r.detailId > 0 ? r.detailId : undefined,
          astClassTreeId: node.classTreeId,
          seq: r.seq,
          title: r.title,
          value: r.value,
          note: r.note,
          useYn: r.useYn,
          tag: r.tag,
        }));
        await astApi.saveItemDetails(payload);
        message.success('저장되었습니다.');
        retrieve();
      } catch (e) {
        message.error(errorMessage(e));
      }
    };

    // buildGrid 컬럼 (L210-213)
    const columns: ColDef<AstItemDetail>[] = useMemo(
      () => [
        gb.longCenter('seq', 70, '순번', { editable: true }),
        gb.textCenter('title', 120, '항목', { editable: true }),
        gb.textArea('value', 350, '정보', { editable: true }),
        gb.textArea('note', 350, '비고', { editable: true }),
      ],
      []
    );

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        {/* 상단 툴바 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* [E1] retrieveButton[조회].Select */}
            <Button type="search" onClick={() => retrieve()} disabled={!node}>
              조회
            </Button>
            {/* [E3] deleteButton[삭제].Select */}
            <Button type="delete" onClick={deleteRow} disabled={!node}>
              삭제
            </Button>
            {/* [E5] addButton[항목추가].Select */}
            <Button type="register" onClick={insert} disabled={!node}>
              항목추가
            </Button>
          </div>
          <div>
            {/* [E4] cfButton[현금흐름표].Select */}
            <Button type="register" onClick={openCfInfo} disabled={!node}>
              현금흐름표
            </Button>
          </div>
        </div>

        {/* 비고/내용 입력란 */}
        <div style={{ marginBottom: 8 }}>
          <Input.TextArea
            placeholder="비고 / 상세설명"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
        </div>

        {/* 상하 분할: 상단 상세 그리드 + 하단 담당자 그리드 */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <Splitter layout="vertical">
            <Splitter.Panel defaultSize="65%" min="40%" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 6 }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<AstItemDetail>
                  columnDefs={columns}
                  rowData={rows}
                  loading={loading}
                  onCheckedChange={(selected: AstItemDetail[]) => setSelectedRows(selected)}
                  getRowId={(params) => String(params.data.detailId)}
                />
              </div>
            </Splitter.Panel>
            <Splitter.Panel defaultSize="35%" min="25%" style={{ display: 'flex', flexDirection: 'column', paddingTop: 6 }}>
              <Ast10_Grid_Manager ref={managerRef} linkId={node?.classTreeId ?? null} />
            </Splitter.Panel>
          </Splitter>
        </div>

        {/* 하단 저장 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          {/* [E2] updateButton[저장].Select */}
          <Button type="save" onClick={update} disabled={!node}>
            저장
          </Button>
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
          astClassTreeId={node?.classTreeId ?? null}
          onClose={() => setCfModalOpen(false)}
        />
      </div>
    );
  }
);

Ast02_Grid_DetailManagement.displayName = 'Ast02_Grid_DetailManagement';
