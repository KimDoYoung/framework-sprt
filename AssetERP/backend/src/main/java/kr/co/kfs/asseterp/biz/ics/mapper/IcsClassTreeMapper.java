package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeRes;
import kr.co.kfs.asseterp.biz.ics.dto.ClassTreeSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsCompanyInfoRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawPeriodRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawContentReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDeadlineRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawDetailRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawExceptRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawLookupRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawManageRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawSaveReq;
import kr.co.kfs.asseterp.biz.ics.dto.IcsLawViewRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsWriteTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsClassTreeMapper {

    /** AS-IS ics01_class_tree.selectByPeriod (H04) — 월별 법규조회. advisYn·exceptDailyYn은 AS-IS처럼 'true'/'false' 글자 */
    List<IcsLawPeriodRes> selectLawPeriod(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                          @Param("searchText") String searchText, @Param("level1Name") String level1Name, @Param("level2Name") String level2Name,
                                          @Param("cycleCode") String cycleCode, @Param("lawPublicType") String lawPublicType,
                                          @Param("exceptDailyYn") String exceptDailyYn, @Param("advisYn") String advisYn);

    /** AS-IS ics01_class_tree.selectByParentTreeId (H04) — 바로 아래 분류 */
    List<IcsClassTreeItemRes> selectChildren(@Param("parentTreeId") Long parentTreeId, @Param("searchText") String searchText);

    /** AS-IS ics01_class_tree.selectByAll (H04) — 최상위(parent 0)를 뺀 모든 분류 */
    List<IcsClassTreeItemRes> selectAllItems(@Param("searchText") String searchText);

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

    /** AS-IS ics01_class_tree.selectByTypeCodePaging (Ics01_Tab_ClassTreeUserView, H02) */
    List<IcsLawViewRes> selectLawView(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                      @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                      @Param("detailSearchYn") boolean detailSearchYn, @Param("advisYn") boolean advisYn,
                                      @Param("limit") long limit, @Param("offset") long offset);

    /** AS-IS ics01_class_tree.selectByTypeCodePagingTotal (H02) */
    long selectLawViewTotal(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                            @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                            @Param("detailSearchYn") boolean detailSearchYn, @Param("advisYn") boolean advisYn);

    /** AS-IS ics01_class_tree.selectByTypeCodePaging (Ics01_Tab_ClassTreeUser, H08) — mngGroupId(관리그룹)가 있으면 그 그룹의 법규만 */
    List<IcsLawManageRes> selectLawManage(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                          @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                                          @Param("detailSearchYn") boolean detailSearchYn, @Param("advisYn") boolean advisYn,
                                          @Param("mngGroupId") Long mngGroupId, @Param("limit") long limit, @Param("offset") long offset);

    /** AS-IS ics01_class_tree.selectByTypeCodePagingTotal (H08) */
    long selectLawManageTotal(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                              @Param("lawSearch") String lawSearch, @Param("statuteSearch") String statuteSearch,
                              @Param("detailSearchYn") boolean detailSearchYn, @Param("advisYn") boolean advisYn,
                              @Param("mngGroupId") Long mngGroupId);

    /** AS-IS ics01_class_tree.refresh (H08) — 한 행 */
    IcsLawManageRes selectLawManageById(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    /** AS-IS ics01_class_tree.selectByExcept (Ics01_Lookup_Except, H08). exceptYn은 'true'/'false'/'%', cycleCode·publicType은 '%', 검색어는 %…% */
    List<IcsLawExceptRes> selectLawExcept(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId, @Param("typeCode") String typeCode,
                                          @Param("cycleCode") String cycleCode, @Param("publicType") String publicType, @Param("exceptYn") String exceptYn,
                                          @Param("searchText") String searchText, @Param("detailSearchYn") String detailSearchYn);

    /** AS-IS ics03_company_info.selectByClassTreeId */
    List<IcsCompanyInfoRes> selectCompanyInfo(@Param("classTreeId") Long classTreeId, @Param("companyId") Long companyId);

    /** AS-IS ics.Ics03_CompanyInfo.modelUpdate INSERT (제외·자동·일임 글자 'true'/'false') */
    int insertCompanyInfo(@Param("companyInfoId") Long companyInfoId, @Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId,
                          @Param("autoYn") String autoYn, @Param("exceptYn") String exceptYn, @Param("advisYn") String advisYn);

    /** AS-IS ics.Ics03_CompanyInfo.modelUpdate UPDATE */
    int updateCompanyInfo(@Param("companyInfoId") Long companyInfoId, @Param("companyId") Long companyId,
                          @Param("autoYn") String autoYn, @Param("exceptYn") String exceptYn, @Param("advisYn") String advisYn);

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
