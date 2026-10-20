package kr.co.kfs.asseterp.biz.icr.mapper;

import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDeadlineRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeDetailRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeLookupRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrClassTreeViewRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleContentReq;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleRes;
import kr.co.kfs.asseterp.biz.icr.dto.IcrRuleSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcrClassTreeMapper {

    /** AS-IS icr01_class_tree.selectByCompanyId (Icr01_Lookup_SelectParent) — 최상위(parent 0)부터 사용 중인 노드를 전위 순서로 */
    List<IcrClassTreeRes> selectTree(@Param("companyId") Long companyId, @Param("typeCode") String typeCode);

    /** AS-IS icr01_class_tree.selectByTypeCodePaging (Icr01_Lookup_SelectMulti) */
    List<IcrClassTreeLookupRes> selectLookup(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                             @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                             @Param("detailSearchYn") boolean detailSearchYn, @Param("limit") long limit, @Param("offset") long offset,
                                             @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS icr01_class_tree.selectByTypeCodePaging (Icr01_Tab_ClassTreeView, H03) — 내규조회 그리드 열. 건수는 selectLookupTotal을 그대로 쓴다 */
    List<IcrClassTreeViewRes> selectView(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                         @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                         @Param("detailSearchYn") boolean detailSearchYn, @Param("limit") long limit, @Param("offset") long offset,
                                         @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS icr01_class_tree.selectByTypeCodePagingTotal */
    long selectLookupTotal(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                           @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                           @Param("detailSearchYn") boolean detailSearchYn,
                           @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS icr01_class_tree.selectById (Icr01_Lookup_ClassTreeDetail) */
    IcrClassTreeDetailRes selectDetail(@Param("classTreeId") Long classTreeId);

    /** AS-IS icr01_class_tree.selectByListIcrId (Icr01_Lookup_SelectMulti "deadline") */
    List<IcrClassTreeDeadlineRes> selectDeadlines(@Param("classTreeIds") List<Long> classTreeIds);

    // ---- 내규관리(H09) 분류 트리 쓰기 (Icr01_Edit_ClassTree·Icr01_Move_TreeGrid) ----

    /** AS-IS icr01_class_tree.selectById 중 트리 열 (로그인 회사 것만) */
    IcrClassTreeRes selectTreeNodeById(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** 로그인 회사의 분류·내규 개수(0 또는 1) */
    int countById(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS UpdateDataModel INSERT (분류 IC) */
    int insertTreeNode(@Param("classTreeId") Long classTreeId, @Param("req") IcrClassTreeSaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel UPDATE (분류코드·분류명·조회순서) */
    int updateTreeNode(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("req") IcrClassTreeSaveReq req);

    /** AS-IS Icr01_Move_*.moveTree: 상위 분류만 바꾼다 */
    int updateParent(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("parentTreeId") Long parentTreeId);

    /** AS-IS icr01_class_tree.getDownTreeId — id만(자신 포함) */
    List<Long> selectDownTreeIds(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS icr01_class_tree.insertIcrDel */
    int insertDeleteHistory(@Param("classTreeId") Long classTreeId, @Param("empId") Long empId);

    /** AS-IS icr01_class_tree.deleteByClassTreeId */
    int deleteById(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    // ---- 내규관리(H09) 내규 그리드 (Icr01_Grid_IcrType) ----

    /** AS-IS icr01_class_tree.selectByClassTreeId — 고른 분류와 모든 하위의 내규 */
    List<IcrRuleRes> selectRules(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                 @Param("searchText") String searchText);

    /** AS-IS icr01_class_tree.refresh */
    IcrRuleRes selectRuleRefresh(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS Icr01_ClassTree.update(UpdateDataModel)의 UPDATE — 화면이 고치는 열만 */
    int updateRule(@Param("companyId") Long companyId, @Param("req") IcrRuleSaveReq req);

    /** AS-IS GridInsertRow 모델(회사·상위·구분 IT·사용 true) + UpdateDataModel INSERT */
    int insertRule(@Param("classTreeId") Long classTreeId, @Param("req") IcrRuleSaveReq req, @Param("companyId") Long companyId);

    /** AS-IS icr.Icr01_ClassTree.modelUpdate — 상세내용 + 열기 전에 반영된 편집 열 */
    int updateRuleContent(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("req") IcrRuleContentReq req);

    /** AS-IS icr.Icr01_ClassTree.delete(UpdateDataModel.deleteModel) */
    int deleteRule(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS sys.Sys10_File.delete(UpdateDataModel.deleteModel) — sys10_file 행만 지운다(저장된 파일은 그대로) */
    int deleteFileRow(@Param("classTreeId") Long classTreeId, @Param("fileId") Long fileId);
}
