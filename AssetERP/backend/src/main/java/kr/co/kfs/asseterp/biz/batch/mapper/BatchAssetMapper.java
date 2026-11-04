package kr.co.kfs.asseterp.biz.batch.mapper;

import kr.co.kfs.asseterp.biz.batch.dto.BatchAstClassTree;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** 자산분류(ast01) 반영용 SQL (AS-IS BatchMain.assetErpItemInsert·createAstManager가 쓰는 것) */
@Mapper
public interface BatchAssetMapper {

    /** AS-IS sys01_company.astManagerAutoYn — 자산 담당부서 자동 생성 여부('true'/'false'/null) */
    String selectAstManagerAutoYn(@Param("companyId") Long companyId);

    /** AS-IS ast01_class_tree.selectByClassTreeName — 운용자산(2) 분류를 상위+이름으로 찾아 첫 ID, 없으면 null */
    Long selectClassTreeIdByName(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("assetName") String assetName);

    /** AS-IS ast01_class_tree.selectByIsin — 운용자산(2) 종목을 상위+표준코드로 찾아 첫 ID, 없으면 null */
    Long selectClassTreeIdByIsin(@Param("companyId") Long companyId, @Param("parentId") Long parentId, @Param("itemCode") String itemCode);

    /** AS-IS ast01_class_tree.createCodeOne */
    String createCode(@Param("parentId") Long parentId, @Param("typeCode") String typeCode, @Param("companyId") Long companyId);

    /** AS-IS ast01_class_tree.createSeq */
    Long createSeq(@Param("companyId") Long companyId, @Param("parentId") Long parentId);

    /** AS-IS ast01_class_tree.insert */
    int insertClassTree(@Param("p") BatchAstClassTree tree);

    /** AS-IS org01_code.selectByCompanyId — 기준일에 유효한 부서 ID들 */
    List<Long> selectOrgIds(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate);

    /** AS-IS ast10_manager.insert (부서 담당, 자산 연결) */
    int insertDeptManager(@Param("managerId") Long managerId, @Param("linkId") Long linkId, @Param("orgId") Long orgId, @Param("companyId") Long companyId);
}
