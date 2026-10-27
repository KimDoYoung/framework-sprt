package kr.co.kfs.asseterp.biz.ast.mapper;

import kr.co.kfs.asseterp.biz.ast.dto.AstAssetItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeItemRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstClassTreeRes;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemClassUpdateReq;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeCond;
import kr.co.kfs.asseterp.biz.ast.dto.AstItemTreeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface AstClassTreeMapper {

    /** AS-IS ast01_class_tree.selectByCompanyId (F07) — 사용 중인 노드를 전위 순서로, 종목(IT)은 내가·내 조직이 담당자인 것만 */
    List<AstItemTreeRes> selectItemTree(@Param("c") AstItemTreeCond cond);

    /** AS-IS ast01_class_tree.selectByAssetType (P10 자산별 펀드 조회) — 기준일에 펀드 운용자산이 있는 종목(IT) */
    List<AstAssetItemRes> selectByAssetType(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate,
                                            @Param("assetType") String assetType, @Param("searchText") String searchText);

    /** R08 본 화면 전체 트리 조회 (AS-IS ast01_class_tree.selectByCompanyId) */
    List<AstClassTreeRes> selectClassTree(@Param("companyId") Long companyId,
                                          @Param("typeCode") String typeCode,
                                          @Param("assetType") String assetType);

    /** R08 우측 종목 상세 목록 (AS-IS ast01_class_tree.selectByParentId) */
    List<AstClassTreeItemRes> selectByParentId(@Param("companyId") Long companyId,
                                               @Param("parentId") Long parentId,
                                               @Param("typeCode") String typeCode);

    AstClassTreeRes selectById(@Param("classTreeId") Long classTreeId);

    String createCode(@Param("companyId") Long companyId,
                      @Param("parentId") Long parentId,
                      @Param("typeCode") String typeCode);

    long selectNextId();

    int insertClassTree(AstClassTreeRes row);

    int updateClassTreeInfo(@Param("classTreeId") Long classTreeId,
                            @Param("classTreeName") String classTreeName,
                            @Param("seq") Long seq,
                            @Param("useYn") String useYn);

    int updateClassTree(AstClassTreeRes row);

    int updateParentId(@Param("classTreeId") Long classTreeId,
                       @Param("parentId") Long parentId);

    int modelUpdate(AstItemClassUpdateReq req);

    int checkUseAstId(@Param("classTreeId") Long classTreeId);

    int deleteByAstClassTreeId(@Param("classTreeId") Long classTreeId);

    int deleteManagerByLinkId(@Param("classTreeId") Long classTreeId);

    int deleteClassTree(@Param("classTreeId") Long classTreeId);
}
