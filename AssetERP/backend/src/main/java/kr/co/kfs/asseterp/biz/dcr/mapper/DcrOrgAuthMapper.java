package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassTreeRef;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthClassRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrOrgAuthOrgRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr03_org_auth.xml + org01_code.selectByDcrCodeId + dcr01_class_tree.selectByOrgCodeId_1Bang·selectByClasssTreeId */
@Mapper
public interface DcrOrgAuthMapper {
    /** AS-IS org01_code.selectByDcrCodeId: 한 단계(상위조직 parentCodeId의 하위) + 문서분류 dcrCodeId의 권한 */
    List<DcrOrgAuthOrgRes> selectOrgsByClassTree(@Param("companyId") Long companyId, @Param("parentCodeId") Long parentCodeId,
                                                 @Param("dcrCodeId") Long dcrCodeId);

    /** AS-IS dcr01_class_tree.selectByOrgCodeId_1Bang: 회사 문서분류 전체(문서분류·문서구분) + 조직 orgCodeId의 권한, 전위 순서 + depth */
    List<DcrOrgAuthClassRes> selectClassTreesByOrg(@Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId);

    /** AS-IS dcr01_class_tree.selectByClasssTreeId: 문서분류와 그 하위(사용 중인 것만) */
    List<DcrClassTreeRef> selectDownClassTrees(@Param("classTreeId") Long classTreeId);

    int countClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    int countOrg(@Param("companyId") Long companyId, @Param("orgCodeId") Long orgCodeId);

    /** AS-IS sys01_company.selectById 중 dcrDetailUseYn ('true'면 문서세부분류 사용) */
    String selectDcrDetailUseYn(@Param("companyId") Long companyId);

    /** AS-IS dcr30_link.selectByClassTreeId: 문서분류에 걸린 Link 건수 */
    int countLinksByClassTree(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS dcr03_org_auth.deleteByOrgAuthId: 같은 (조직, 문서분류) 중복 행 중 가장 큰 ID 하나만 남긴다 */
    int deleteDuplicates(@Param("orgCodeId") Long orgCodeId, @Param("classTreeId") Long classTreeId);

    /** AS-IS dcr03_org_auth.inUpdateRight: (조직, 문서분류)가 있으면 고치고 없으면 새 ID로 넣는다 */
    int upsertAuth(@Param("orgCodeId") Long orgCodeId, @Param("classTreeId") Long classTreeId,
                   @Param("retrieveYn") String retrieveYn, @Param("updateYn") String updateYn);
}
