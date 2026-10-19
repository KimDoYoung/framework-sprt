package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrClassLinkRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrLinkRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr30_link.xml + dcr03_org_auth.update·updateByBakDcr + sys01_company.selectByAll·sys09_code.linkCheck */
@Mapper
public interface DcrLinkMapper {
    List<Long> selectCompanyIds();

    /** AS-IS dcr30_link.selectByClassTreeId (F02): 문서분류에 걸린 Link */
    List<DcrClassLinkRes> selectByClassTreeId(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS sys09_code.linkCheck: 코드 종류의 코드 목록(순번 순) */
    List<String> selectLinkCodes(@Param("kindCode") String kindCode);

    /** AS-IS dcr30_link.selectByLinkCode의 행 수 */
    int countByLinkCode(@Param("companyId") Long companyId, @Param("linkCode") String linkCode);

    Long selectNextId();

    int insertLink(@Param("linkId") Long linkId, @Param("linkCode") String linkCode, @Param("companyId") Long companyId);

    List<DcrLinkRes> selectBySearchId(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    DcrLinkRes selectById(@Param("linkId") Long linkId);

    Long selectLinkCompanyId(@Param("linkId") Long linkId);

    int updateLinkRow(@Param("companyId") Long companyId, @Param("linkId") Long linkId,
                      @Param("classTreeId") Long classTreeId, @Param("note") String note);

    int updateNote(@Param("linkId") Long linkId, @Param("note") String note);

    /** AS-IS dcr30_link.selectByCompanyId: 문서분류ID만 */
    List<Long> selectClassTreeIdsByCompanyId(@Param("companyId") Long companyId);

    String selectDcrDetailUseYn(@Param("companyId") Long companyId);

    int updateOrgAuth(@Param("classTreeId") Long classTreeId);

    int updateOrgAuthByBakDcr(@Param("companyId") Long companyId, @Param("classTreeId") Long classTreeId);

    /** AS-IS dcr30_link.updateLink (upsert) */
    int upsertLink(@Param("companyId") Long companyId, @Param("linkCode") String linkCode,
                   @Param("classTreeId") Long classTreeId, @Param("note") String note, @Param("formMappingId") Long formMappingId);

    /** AS-IS dcr30_link.updateFormDcr30 (upsert) */
    int upsertFormLink(@Param("companyId") Long companyId, @Param("linkCode") String linkCode, @Param("classTreeId") Long classTreeId,
                       @Param("note") String note, @Param("formMappingId") Long formMappingId);

    /** AS-IS com10_form_mapping.insertForm: 관리자 회사의 양식 내용을 새 양식 행으로 복사 */
    int insertForm(@Param("companyId") Long companyId, @Param("linkCode") String linkCode, @Param("formMappingId") Long formMappingId);
}
