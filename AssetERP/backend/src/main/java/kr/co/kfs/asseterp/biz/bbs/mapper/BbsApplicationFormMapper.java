package kr.co.kfs.asseterp.biz.bbs.mapper;

import kr.co.kfs.asseterp.biz.bbs.dto.ApplicationFormRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/bbs/mapper/bbs12_application_form.xml · sys09_code.selectByApplicationForm */
@Mapper
public interface BbsApplicationFormMapper {
    /** AS-IS sys09_code.selectByApplicationForm — 양식이 아직 없는 신청구분 코드 */
    List<String> selectMissingCodes(@Param("companyId") Long companyId, @Param("kindCode") String kindCode);

    Long selectNextId();

    /** AS-IS insert (공개여부 false, 내용 없음) */
    int insertForm(@Param("applicationFormId") Long applicationFormId, @Param("companyId") Long companyId, @Param("appType") String appType);

    List<ApplicationFormRes> selectByCompanyId(@Param("companyId") Long companyId);

    int updatePublicYn(@Param("companyId") Long companyId, @Param("applicationFormId") Long applicationFormId, @Param("publicYn") Boolean publicYn);

    int updateContent(@Param("companyId") Long companyId, @Param("applicationFormId") Long applicationFormId,
                      @Param("content") String content, @Param("contentMobi") String contentMobi);
}
