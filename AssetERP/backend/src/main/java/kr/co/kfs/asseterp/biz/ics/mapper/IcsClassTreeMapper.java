package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDeadlineRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawLookupRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsWriteTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface IcsClassTreeMapper {

    /** AS-IS ics01_class_tree.selectByCompanyId (ics_tree_all_postgresql) — 최상위(parent 0)부터 사용 중인 노드를 전위 순서로 */
    List<ClassTreeRes> selectTree(@Param("typeCode") String typeCode);

    /** AS-IS ics01_class_tree.selectByCompanyId (F03) — selectTree와 같은 트리에 구분(typeCode)·상세내용(content)까지 */
    List<IcsWriteTreeRes> selectWriteTree(@Param("typeCode") String typeCode);

    /** AS-IS ics01_class_tree.selectById 중 트리 열 */
    ClassTreeRes selectTreeNodeById(@Param("classTreeId") Long classTreeId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS UpdateDataModel INSERT (분류 등록) */
    int insertTreeNode(@Param("classTreeId") Long classTreeId, @Param("req") ClassTreeSaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel UPDATE (분류 수정) — 화면이 고치는 열(분류코드·분류명·조회순서)만 */
    int updateTreeNode(@Param("classTreeId") Long classTreeId, @Param("req") ClassTreeSaveReq req);

    /** AS-IS Ics01_Move_TreeGrid / Ics01_Move_Grid → update 중 parent 바꾸기 */
    int updateParent(@Param("classTreeId") Long classTreeId, @Param("parentTreeId") Long parentTreeId);

    /** AS-IS ics01_class_tree.getDownTreeId — 자신과 모든 하위 id(부모 먼저) */
    List<Long> selectDownTreeIds(@Param("classTreeId") Long classTreeId);

    /** AS-IS ics01_class_tree.insertIcsDel — 삭제 이력 */
    int insertDeleteHistory(@Param("classTreeId") Long classTreeId, @Param("empId") Long empId);

    /** AS-IS ics01_class_tree.deleteByClassTreeId */
    int deleteById(@Param("classTreeId") Long classTreeId);

    // ── 법규 (Ics01_Grid_IcsType) ──

    /** AS-IS ics01_class_tree.selectByClassTreeId */
    List<IcsLawRes> selectLaws(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId, @Param("typeCode") String typeCode,
                               @Param("publicType") String publicType, @Param("searchText") String searchText, @Param("advisYn") boolean advisYn);

    /** AS-IS ics01_class_tree.selectByTypeCodePaging (Ics01_Lookup_SelectMulti, E03) */
    List<IcsLawLookupRes> selectLawLookup(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                          @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                          @Param("detailSearchYn") boolean detailSearchYn, @Param("limit") long limit, @Param("offset") long offset,
                                          @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS ics01_class_tree.selectByTypeCodePagingTotal */
    long selectLawLookupTotal(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                              @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                              @Param("detailSearchYn") boolean detailSearchYn,
                              @Param("relateTable") String relateTable, @Param("relateId") Long relateId);

    /** AS-IS ics01_class_tree.selectById (Ics01_Lookup_ClassTreeDetail, E03-1) */
    IcsLawDetailRes selectLawDetail(@Param("classTreeId") Long classTreeId);

    /** AS-IS ics01_class_tree.selectByListIcsId (Ics01_Lookup_SelectMulti "deadline", E04) */
    List<IcsLawDeadlineRes> selectLawDeadlines(@Param("classTreeIds") List<Long> classTreeIds);

    /** AS-IS ics01_class_tree.refresh */
    IcsLawRes selectLawRefresh(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    /** AS-IS 법규 행 존재 확인 (UpdateDataModel IsNewData) */
    int countById(@Param("classTreeId") Long classTreeId);

    /** AS-IS UpdateDataModel UPDATE (법규 저장) — 화면이 고치는 열만 */
    int updateLaw(@Param("req") IcsLawSaveReq req);

    /** AS-IS UpdateDataModel INSERT (법규 등록: typeCode IT, 사용여부 true, 업무분류 '0') */
    int insertLaw(@Param("classTreeId") Long classTreeId, @Param("req") IcsLawSaveReq req, @Param("companyId") Long companyId);

    /** AS-IS ics.Ics01_ClassTree.modelUpdate (Ics01_Lookup_Content 저장) — 상세내용과 그 행의 편집 열 */
    int updateLawContent(@Param("classTreeId") Long classTreeId, @Param("req") IcsLawContentReq req);

    /** AS-IS GridDeleteData → UpdateDataModel.deleteModel (id로 행마다 DELETE) */
    int deleteLaw(@Param("classTreeId") Long classTreeId);
}
