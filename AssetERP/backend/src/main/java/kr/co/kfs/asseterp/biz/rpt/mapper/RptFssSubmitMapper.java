package kr.co.kfs.asseterp.biz.rpt.mapper;

import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitRes;
import kr.co.kfs.asseterp.biz.rpt.dto.RptFssSubmitSaveReq;
import kr.co.kfs.asseterp.biz.rpt.dto.RptWriteGuideRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/rpt/mapper/rpt10_fss_submit.xml + UpdateDataModel(rpt10_fss_submit) — 금감원 업무보고서 */
@Mapper
public interface RptFssSubmitMapper {
    /** AS-IS selectBySearchText: 보고서코드 LIKE(대소문자 무시) + 제출주기 이름 */
    List<RptFssSubmitRes> selectBySearchText(@Param("searchText") String searchText);

    /** AS-IS selectByReportCode: 작성요령·변경이력, 없는 코드면 빈 글자 한 행 */
    List<RptWriteGuideRes> selectByReportCode(@Param("reportCode") String reportCode);

    RptFssSubmitRes selectById(@Param("submitId") Long submitId);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** 같은 보고서코드(rpt10_report_cd UNIQUE)의 다른 행 수 */
    int countByReportCode(@Param("reportCode") String reportCode, @Param("submitId") Long submitId);

    int insert(@Param("submitId") Long submitId, @Param("req") RptFssSubmitSaveReq req);

    int update(@Param("req") RptFssSubmitSaveReq req);

    /** UpdateDataModel.deleteModel (ID로 DELETE) */
    int deleteByIds(@Param("ids") List<Long> ids);
}
